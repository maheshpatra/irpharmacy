import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, StatusBar, Dimensions,
    ActivityIndicator, ToastAndroid, Platform, Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiService } from '../services/api';
import { useStore } from '../store/useStore';
import { showAlert } from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');

// ── helpers ─────────────────────────────────────────────────────────────────
const safePrice = (p: any): number => {
    if (p === undefined || p === null) return 0;
    const n = parseFloat(String(p).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
};

const isOutOfStock = (status: string | undefined, qty: number) => {
    if (qty === 0) return true;
    if (!status) return false;
    const s = status.toLowerCase();
    return s === 'out of stock' || s === 'out_of_stock' || s === 'unavailable';
};

const str = (v: any, fallback = '') => {
    if (!v) return fallback;
    return Array.isArray(v) ? v[0] || fallback : String(v);
};

// ── Safety items ─────────────────────────────────────────────────────────────
const SAFETY = [
    { icon: 'beer-outline' as any, label: 'Alcohol', desc: 'Avoid alcohol while taking this medication.', bg: '#FFF3E0', color: '#E65100' },
    { icon: 'woman-outline' as any, label: 'Pregnancy', desc: 'Consult your doctor before use during pregnancy.', bg: '#FCE4EC', color: '#C2185B' },
    { icon: 'car-outline' as any, label: 'Driving', desc: 'May cause drowsiness. Drive with caution.', bg: '#E3F2FD', color: '#1565C0' },
    { icon: 'body-outline' as any, label: 'Kidney', desc: 'Use with caution if you have kidney problems.', bg: '#E8F5E9', color: '#2E7D32' },
];

// ── Component ─────────────────────────────────────────────────────────────────
const ProductDetails = () => {
    const params = useLocalSearchParams();
    const { addToCart, cart } = useStore();

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'About' | 'Dosage' | 'Side Effects'>('About');
    const [fetchedProduct, setFetchedProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [imgError, setImgError] = useState(false);

    const productId = str(params.id);

    // ── param product (shown instantly while API loads) ──
    const paramProduct = {
        id: productId,
        name: str(params.name),
        price: str(params.price),
        image: str(params.image),
        description: str(params.desc) || str(params.description),
        category: str(params.category, 'Medicine'),
        composition: str(params.composition),
        manufacturer: (() => {
            const cn = params.company_name || params.companyname || params.mfr || params.manufacturer;
            const v = str(cn);
            return v ? `Mkt. by ${v}` : '';
        })(),
        stockStatus: 'available',
        discount: (() => {
            const d = str(params.discount);
            return d ? parseInt(d) : 0;
        })(),
        availableQty: 10,
        dosage: 'As prescribed by the physician. Do not self-medicate.',
        sideEffects: 'Contact your doctor if you experience unusual symptoms.',
        rating: 4.5,
        reviews: 120,
    };

    const product = fetchedProduct ? { ...paramProduct, ...fetchedProduct } : paramProduct;
    const outOfStock = isOutOfStock(product.stockStatus, product.availableQty);
    const priceNum = safePrice(product.price);
    const mrpNum = product.discount > 0 ? priceNum * (100 / (100 - product.discount)) : priceNum;

    // ── fetch ──
    useEffect(() => {
        // Always try to fetch by ID, regardless of whether we have params
        if (productId) {
            fetchProductDetails(productId);
        } else {
            // No ID at all — check if paramProduct has a name from params
            setLoading(false);
        }
    }, [productId]);

    const fetchProductDetails = async (id: string) => {
        setLoading(true);
        try {
            const response = await ApiService.getMedicineById(id);
            if (response && (response.status === 'success' || response.data) && response.data) {
                const d = response.data;
                setFetchedProduct({
                    name: d.name || paramProduct.name || '',
                    price: d.price !== undefined ? safePrice(d.price).toString() : paramProduct.price,
                    description: d.desc || d.description || '',
                    category: d.category || paramProduct.category || 'Medicine',
                    composition: d.composition || paramProduct.composition || '',
                    manufacturer: d.company_name
                        ? `Mkt. by ${d.company_name}`
                        : (d.mfr ? `Mkt. by ${d.mfr}` : paramProduct.manufacturer),
                    stockStatus: d.status || 'available',
                    availableQty: d.aviqty ?? d.available_qty ?? 10,
                    discount: d.discount ? parseInt(d.discount) : paramProduct.discount,
                });
            } else {
                // API failed but we still have param data — that's fine, paramProduct will be used
            }
        } catch { /* silent — paramProduct shown as fallback */ }
        finally { setLoading(false); }
    };

    // ── add to cart ──
    const handleAddToCart = async () => {
        if (!product.id) return;
        setAddingToCart(true);
        try {
            await addToCart({
                id: product.id.toString(),
                name: product.name,
                price: priceNum.toString(),
                image: product.image?.toString() || '',
                quantity,
                category: product.category,
            });
            if (Platform.OS === 'android') {
                ToastAndroid.show('Added to cart!', ToastAndroid.SHORT);
                router.push('/cart');
            } else {
                showAlert({
                    type: 'success',
                    title: 'Added to Cart',
                    message: `${product.name} added.`,
                    buttons: [
                        { text: 'Continue Shopping', style: 'cancel' },
                        { text: 'View Cart', onPress: () => router.push('/cart') },
                    ],
                });
            }
        } catch (err: any) {
            if (!err?.message) {
                showAlert({ type: 'error', title: 'Error', message: 'Could not add to cart. Try again.' });
            }
        } finally {
            setAddingToCart(false);
        }
    };

    // ── tab content ──
    const TAB_CONTENT: Record<string, string> = {
        'About': product.description || 'No description available for this product.',
        'Dosage': product.dosage || 'As prescribed by the physician.',
        'Side Effects': product.sideEffects || 'Consult your doctor for details.',
    };

    // Show "not found" only when BOTH: loading finished AND no name from EITHER source
    const hasProduct = !!(product.name || fetchedProduct?.name);

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* ── Floating header ── */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerBtn}
                        onPress={() => Share.share({ message: `Check out ${product.name}` })}
                    >
                        <Ionicons name="share-social-outline" size={22} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/cart' as any)}>
                        <Ionicons name="cart-outline" size={22} color="#333" />
                        {cart.length > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cart.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading product…</Text>
                </View>
            ) : !hasProduct ? (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={72} color="#eee" />
                    <Text style={styles.notFoundText}>Product not found</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => productId && fetchProductDetails(productId)}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        bounces={false}
                    >
                        {/* ── Image zone ── */}
                        <View style={styles.imageZone}>
                            <LinearGradient
                                colors={['#EBF5FB', '#F0FFF4']}
                                style={styles.imageGradient}
                            >
                                {/* Discount pill */}
                                {product.discount > 0 && (
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountBadgeText}>{product.discount}% OFF</Text>
                                    </View>
                                )}

                                <Image
                                    source={(!imgError && product.image)
                                        ? { uri: product.image }
                                        : require('../assets/images/med.jpg')}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                    onError={() => setImgError(true)}
                                />
                            </LinearGradient>
                        </View>

                        {/* ── Info sheet ── */}
                        <View style={styles.sheet}>

                            {/* Category + Stock */}
                            <View style={styles.topChips}>
                                <View style={styles.categoryChip}>
                                    <Ionicons name="medical-outline" size={12} color={Colors.primary} />
                                    <Text style={styles.categoryChipText}>{product.category}</Text>
                                </View>
                                <View style={[
                                    styles.stockBadge,
                                    { backgroundColor: outOfStock ? '#FFF0F0' : '#EAFAF1' }
                                ]}>
                                    <View style={[styles.stockDot, { backgroundColor: outOfStock ? '#E53935' : '#27AE60' }]} />
                                    <Text style={[styles.stockText, { color: outOfStock ? '#E53935' : '#27AE60' }]}>
                                        {outOfStock ? 'Out of Stock' : 'In Stock'}
                                    </Text>
                                </View>
                            </View>

                            {/* Name */}
                            <Text style={styles.productName}>{product.name}</Text>

                            {/* Composition */}
                            {!!product.composition && (
                                <Text style={styles.compositionText}>{product.composition}</Text>
                            )}

                            {/* Manufacturer */}
                            {!!product.manufacturer && (
                                <Text style={styles.manufacturerText}>{product.manufacturer}</Text>
                            )}

                            {/* Rating row */}
                            <View style={styles.ratingRow}>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <FontAwesome
                                            key={i}
                                            name={i <= Math.round(product.rating) ? 'star' : 'star-o'}
                                            size={14}
                                            color="#F59E0B"
                                            style={{ marginRight: 2 }}
                                        />
                                    ))}
                                    <Text style={styles.ratingNumText}>{product.rating}</Text>
                                </View>
                                <Text style={styles.reviewsText}>({product.reviews} ratings)</Text>
                            </View>

                            {/* Price block */}
                            <View style={styles.priceBlock}>
                                <View>
                                    {product.discount > 0 && (
                                        <View style={styles.mrpRow}>
                                            <Text style={styles.mrpLabel}>MRP </Text>
                                            <Text style={styles.mrpValue}>₹{mrpNum.toFixed(2)}</Text>
                                            <View style={styles.savingsPill}>
                                                <Text style={styles.savingsText}>Save ₹{(mrpNum - priceNum).toFixed(2)}</Text>
                                            </View>
                                        </View>
                                    )}
                                    {priceNum > 0 ? (
                                        <Text style={styles.priceText}>₹{priceNum.toFixed(2)}</Text>
                                    ) : (
                                        <Text style={styles.priceText}>Price on request</Text>
                                    )}
                                    <Text style={styles.taxNote}>Inclusive of all taxes</Text>
                                </View>

                                {/* Qty Stepper */}
                                {!outOfStock && (
                                    <View style={styles.qtyStepper}>
                                        <TouchableOpacity
                                            onPress={() => setQuantity(q => Math.max(1, q - 1))}
                                            style={[styles.qtyCircle, quantity <= 1 && { opacity: 0.4 }]}
                                        >
                                            <Feather name="minus" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyValue}>{quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => setQuantity(q => q + 1)}
                                            style={styles.qtyCircle}
                                        >
                                            <Feather name="plus" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <View style={styles.divider} />

                            {/* ── Tabs ── */}
                            <View style={styles.tabRow}>
                                {(['About', 'Dosage', 'Side Effects'] as const).map(tab => (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setActiveTab(tab)}
                                        style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                                    >
                                        <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.tabContent}>
                                <Text style={styles.tabContentText}>{TAB_CONTENT[activeTab]}</Text>
                            </View>

                            <View style={styles.divider} />

                            {/* ── Safety Advice ── */}
                            <Text style={styles.sectionTitle}>Safety Advice</Text>
                            <View style={styles.safetyGrid}>
                                {SAFETY.map(s => (
                                    <View key={s.label} style={[styles.safetyCard, { backgroundColor: s.bg }]}>
                                        <View style={[styles.safetyIconCircle, { borderColor: s.color + '44' }]}>
                                            <Ionicons name={s.icon} size={22} color={s.color} />
                                        </View>
                                        <Text style={[styles.safetyLabel, { color: s.color }]}>{s.label}</Text>
                                        <Text style={styles.safetyDesc} numberOfLines={2}>{s.desc}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.divider} />

                            {/* ── Info chips ── */}
                            <Text style={styles.sectionTitle}>Key Info</Text>
                            <View style={styles.infoChipRow}>
                                {[
                                    { icon: 'shield-checkmark-outline', label: 'Genuine', sub: '100% Original' },
                                    { icon: 'time-outline', label: 'Delivery', sub: 'Est. 2–4 days' },
                                    { icon: 'return-down-back-outline', label: 'Returns', sub: '7-day returns' },
                                ].map(c => (
                                    <View key={c.label} style={styles.infoChip}>
                                        <Ionicons name={c.icon as any} size={22} color={Colors.primary} />
                                        <Text style={styles.infoChipLabel}>{c.label}</Text>
                                        <Text style={styles.infoChipSub}>{c.sub}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* ── Sticky Bottom Bar ── */}
                    <View style={styles.bottomBar}>
                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>
                                {quantity} × ₹{priceNum > 0 ? priceNum.toFixed(2) : '—'}
                            </Text>
                            <Text style={styles.totalValue}>
                                ₹{(priceNum * quantity).toFixed(2)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.cartBtn, (outOfStock || addingToCart) && { opacity: 0.55 }]}
                            disabled={outOfStock || addingToCart}
                            onPress={handleAddToCart}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={outOfStock ? ['#9E9E9E', '#757575'] : [Colors.primary, '#5DA34A']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.cartBtnGradient}
                            >
                                {addingToCart ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons
                                            name={outOfStock ? 'close-circle-outline' : 'cart'}
                                            size={20} color="#fff"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text style={styles.cartBtnText}>
                                            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                        </Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export default ProductDetails;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FBFF' },

    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FBFF' },
    loadingText: { marginTop: 14, fontFamily: 'novaregular', fontSize: 14, color: '#888' },
    notFoundText: { fontFamily: 'novabold', fontSize: 18, color: '#aaa', marginTop: 16 },
    retryBtn: {
        marginTop: 16, paddingHorizontal: 28, paddingVertical: 12,
        backgroundColor: Colors.primary, borderRadius: 20,
    },
    retryText: { fontFamily: 'novabold', color: '#fff', fontSize: 14 },

    // ── header ──
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 99,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 6 : 44,
        paddingBottom: 10, paddingHorizontal: 16,
    },
    headerBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.92)',
        justifyContent: 'center', alignItems: 'center',
        elevation: 3, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4,
    },
    headerRight: { flexDirection: 'row', gap: 10 },
    cartBadge: {
        position: 'absolute', top: -2, right: -2,
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#fff',
    },
    cartBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'novabold' },

    // ── image zone ──
    imageZone: { width, height: height * 0.36 },
    imageGradient: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        paddingTop: 60,
    },
    discountBadge: {
        position: 'absolute', top: 60, right: 16,
        backgroundColor: '#E53935', borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 5,
        elevation: 4,
    },
    discountBadgeText: { fontFamily: 'novabold', fontSize: 12, color: '#fff' },
    productImage: { width: width * 0.65, height: height * 0.24 },

    // ── sheet ──
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        marginTop: -20,
        padding: 22,
        elevation: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12,
    },

    topChips: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    categoryChip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#EBF5FB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    },
    categoryChipText: { fontFamily: 'novabold', fontSize: 11, color: Colors.primary, marginLeft: 4 },
    stockBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    },
    stockDot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
    stockText: { fontFamily: 'novabold', fontSize: 11 },

    productName: {
        fontFamily: 'novabold', fontSize: responsiveFontSize(2.7), color: '#1A1A2E',
        lineHeight: 32, marginBottom: 6,
    },
    compositionText: {
        fontFamily: 'novaregular', fontSize: 13, color: '#666',
        marginBottom: 4, fontStyle: 'italic',
    },
    manufacturerText: { fontFamily: 'novaregular', fontSize: 12, color: '#999', marginBottom: 6 },

    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    starsRow: { flexDirection: 'row', alignItems: 'center', marginRight: 6 },
    ratingNumText: { fontFamily: 'novabold', fontSize: 13, color: '#F59E0B', marginLeft: 5 },
    reviewsText: { fontFamily: 'novaregular', fontSize: 12, color: '#aaa' },

    // ── price ──
    priceBlock: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 18,
    },
    mrpRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    mrpLabel: { fontFamily: 'novaregular', fontSize: 12, color: '#aaa' },
    mrpValue: {
        fontFamily: 'novaregular', fontSize: 12, color: '#aaa',
        textDecorationLine: 'line-through', marginRight: 8,
    },
    savingsPill: {
        backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    },
    savingsText: { fontFamily: 'novabold', fontSize: 11, color: '#2E7D32' },
    priceText: { fontFamily: 'novabold', fontSize: responsiveFontSize(3.4), color: Colors.primary },
    taxNote: { fontFamily: 'novaregular', fontSize: 10, color: '#bbb', marginTop: 2 },

    // ── qty stepper ──
    qtyStepper: { flexDirection: 'row', alignItems: 'center' },
    qtyCircle: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F0F7F0', borderWidth: 1.5,
        borderColor: Colors.primary + '55',
        justifyContent: 'center', alignItems: 'center',
    },
    qtyValue: {
        fontFamily: 'novabold', fontSize: 18, color: '#1A1A2E',
        paddingHorizontal: 16, minWidth: 44, textAlign: 'center',
    },

    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 18 },

    // ── tabs ──
    tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 16 },
    tabBtn: { marginRight: 22, paddingBottom: 12 },
    tabBtnActive: { borderBottomWidth: 2.5, borderBottomColor: Colors.primary },
    tabBtnText: { fontFamily: 'novaregular', fontSize: 14, color: '#aaa' },
    tabBtnTextActive: { fontFamily: 'novabold', color: Colors.primary },
    tabContent: { minHeight: 80, marginBottom: 4 },
    tabContentText: { fontFamily: 'novaregular', fontSize: 14, color: '#555', lineHeight: 24 },

    // ── safety ──
    sectionTitle: { fontFamily: 'novabold', fontSize: 16, color: '#1A1A2E', marginBottom: 14 },
    safetyGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    safetyCard: {
        width: '48%', borderRadius: 14, padding: 12, marginBottom: 12,
        alignItems: 'flex-start',
    },
    safetyIconCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#fff', borderWidth: 1.5,
        justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    },
    safetyLabel: { fontFamily: 'novabold', fontSize: 13, marginBottom: 3 },
    safetyDesc: { fontFamily: 'novaregular', fontSize: 11, color: '#666', lineHeight: 16 },

    // ── info chips ──
    infoChipRow: { flexDirection: 'row', justifyContent: 'space-between' },
    infoChip: {
        flex: 1, alignItems: 'center', padding: 12,
        backgroundColor: '#F8FAFE', borderRadius: 14, marginHorizontal: 4,
        borderWidth: 1, borderColor: '#EEF2FF',
    },
    infoChipLabel: { fontFamily: 'novabold', fontSize: 11, color: '#333', marginTop: 6 },
    infoChipSub: { fontFamily: 'novaregular', fontSize: 10, color: '#888', marginTop: 2, textAlign: 'center' },

    // ── bottom bar ──
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', paddingHorizontal: 18,
        paddingTop: 14, paddingBottom: 28,
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
        elevation: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08, shadowRadius: 12,
    },
    totalBox: { flex: 1, paddingRight: 12 },
    totalLabel: { fontFamily: 'novaregular', fontSize: 12, color: '#aaa' },
    totalValue: { fontFamily: 'novabold', fontSize: 22, color: '#1A1A2E' },
    cartBtn: {
        flex: 1.4, height: 52, borderRadius: 16, overflow: 'hidden',
        elevation: 6, shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
    },
    cartBtnGradient: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center',
    },
    cartBtnText: { fontFamily: 'novabold', fontSize: 16, color: '#fff' },
});
