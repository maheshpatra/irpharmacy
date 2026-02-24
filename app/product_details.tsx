import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

import { ApiService } from '../services/api';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
    const params = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('About');
    const [fetchedProduct, setFetchedProduct] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Initial product data from params
    const initialProduct = {
        id: params.id,
        name: params.name || '',
        price: params.price || '',
        image: params.image || 'https://cdn-icons-png.flaticon.com/512/2965/2965386.png',
        description: params.desc || params.description || '',
        dosage: 'As prescribed by the physician.',
        sideEffects: 'Consult your doctor.',
        rating: 4.5,
        reviews: 120,
        category: params.category || 'Medicine',
        composition: params.composition || '',
        manufacturer: (params.company_name || params.companyname || params.mfr || params.manufacturer) ? `Mkt: ${params.company_name || params.companyname || params.mfr || params.manufacturer}` : '',
        stockStatus: 'available',
        discount: params.discount ? parseInt(params.discount as string) : 0,
        availableQty: 10 // Default until fetched
    };

    const product = fetchedProduct ? { ...initialProduct, ...fetchedProduct } : initialProduct;

    React.useEffect(() => {
        if (params.id) {
            fetchProductDetails(params.id as string);
        }
    }, [params.id]);

    const fetchProductDetails = async (id: string) => {
        setLoading(true);
        try {
            const response = await ApiService.getMedicineById(id);
            if (response.status === 'success' && response.data) {
                const data = response.data;
                setFetchedProduct({
                    name: data.name,
                    price: `₹${data.price}`,
                    description: data.desc,
                    category: data.category,
                    composition: data.composition,
                    manufacturer: data.company_name ? `Mkt: ${data.company_name}` : '',
                    stockStatus: data.status, // "out_of_stock" or "available"
                    availableQty: data.aviqty,
                    discount: data.discount || 0
                });
            }
        } catch (error) {
            console.log("Error fetching product details", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Customize Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="cart-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {loading || !product.name ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        {/* Product Image */}
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: product.image as string }} style={styles.productImage} resizeMode="contain" />
                        </View>

                        {/* Info Container */}
                        <View style={styles.infoContainer}>
                            <View style={styles.titleRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.categoryText}>{product.category}</Text>
                                    <Text style={styles.productName}>{product.name}</Text>
                                    <Text style={styles.compositionText}>{product.composition}</Text>
                                </View>
                                <View style={styles.ratingBadge}>
                                    <FontAwesome name="star" size={12} color="#fff" />
                                    <Text style={styles.ratingText}>{product.rating}</Text>
                                </View>
                            </View>

                            <Text style={styles.manufacturer}>{product.manufacturer}</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.reviewCount}>({product.reviews} verified ratings)</Text>
                                {product.stockStatus === 'out_of_stock' || product.availableQty === 0 ? (
                                    <Text style={{ color: 'red', fontFamily: 'novabold', fontSize: 12 }}>Out of Stock</Text>
                                ) : (
                                    <Text style={{ color: 'green', fontFamily: 'novabold', fontSize: 12 }}>In Stock</Text>
                                )}
                            </View>

                            <View style={styles.priceRow}>
                                <View>
                                    {product.price && (
                                        <>
                                            {product.discount > 0 && (
                                                <Text style={styles.mrpText}>MRP <Text style={{ textDecorationLine: 'line-through' }}>
                                                    ₹{(parseFloat(product.price.toString().replace(/[^0-9.]/g, '')) * (100 / (100 - product.discount))).toFixed(2)}
                                                </Text> <Text style={{ color: 'green', marginLeft: 5 }}>{product.discount}% OFF</Text></Text>
                                            )}
                                            <Text style={styles.price}>{product.price}</Text>
                                            <Text style={styles.taxText}>Inclusive of all taxes</Text>
                                        </>
                                    )}
                                </View>
                                {product.stockStatus !== 'out_of_stock' && product.availableQty !== 0 && (
                                    <View style={styles.quantityControl}>
                                        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                                            <Ionicons name="remove" size={18} color="#555" />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyText}>{quantity}</Text>
                                        <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                                            <Ionicons name="add" size={18} color="#555" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Description Tabs */}
                            <View style={styles.tabContainer}>
                                {['About', 'Dosage', 'Side Effects'].map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setActiveTab(tab)}
                                        style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
                                    >
                                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.tabContent}>
                                {activeTab === 'About' && <Text style={styles.contentText}>{product.description}</Text>}
                                {activeTab === 'Dosage' && <Text style={styles.contentText}>{product.dosage}</Text>}
                                {activeTab === 'Side Effects' && <Text style={styles.contentText}>{product.sideEffects}</Text>}
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.safetyContainer}>
                                <Text style={styles.sectionHeader}>Safety Advice</Text>
                                <View style={styles.safetyItem}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png' }} style={styles.safetyIcon} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.safetyTitle}>Alcohol</Text>
                                        <Text style={styles.safetyDesc}>Unsafe. Avoid alcohol consumption while taking this medication.</Text>
                                    </View>
                                </View>
                                <View style={styles.safetyItem}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2821/2821901.png' }} style={styles.safetyIcon} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.safetyTitle}>Pregnancy</Text>
                                        <Text style={styles.safetyDesc}>Consult your doctor. Limited data available.</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </ScrollView>

                    {/* Bottom Action Bar */}
                    <View style={styles.bottomBar}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total Price</Text>
                            <Text style={styles.totalPrice}>
                                ₹{(parseFloat(product.price.toString().replace(/[^0-9.]/g, '')) * quantity).toFixed(2)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.addToCartBtn, (product.stockStatus === 'out_of_stock' || product.availableQty === 0) && { opacity: 0.5 }]}
                            disabled={product.stockStatus === 'out_of_stock' || product.availableQty === 0}
                        >
                            <LinearGradient
                                colors={product.stockStatus === 'out_of_stock' || product.availableQty === 0 ? ['#ccc', '#ccc'] : [Colors.primary, '#7C9644']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientBtn}
                            >
                                <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.btnText}>
                                    {product.stockStatus === 'out_of_stock' || product.availableQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}

        </View>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
        paddingBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
        zIndex: 10,
    },
    headerTitle: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.2),
        color: '#333',
    },
    iconBtn: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
    },
    imageContainer: {
        height: responsiveScreenHeight(35),
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    infoContainer: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    categoryText: {
        fontFamily: 'novaregular',
        color: Colors.primary,
        fontSize: responsiveFontSize(1.6),
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    productName: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.8),
        color: '#333',
        lineHeight: 32,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        fontFamily: 'novabold',
        color: '#fff',
        marginLeft: 4,
        fontSize: 12,
    },
    reviewCount: {
        fontFamily: 'novaregular',
        color: '#999',
        fontSize: 12,
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    price: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(3),
        color: Colors.primary,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 4,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    qtyText: {
        fontFamily: 'novabold',
        fontSize: 16,
        marginHorizontal: 15,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    tabBtn: {
        marginRight: 20,
        paddingBottom: 5,
    },
    activeTabBtn: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.8),
        color: '#999',
    },
    activeTabText: {
        fontFamily: 'novabold',
        color: Colors.primary,
    },
    tabContent: {
        minHeight: 100,
    },
    contentText: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.8),
        color: '#555',
        lineHeight: 24,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#999',
    },
    totalPrice: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.4),
        color: '#333',
    },
    addToCartBtn: {
        flex: 1.5,
        height: 50,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    gradientBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#fff',
    },
    compositionText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'novaregular',
        marginBottom: 4,
    },
    manufacturer: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'novabold',
        marginBottom: 8,
    },
    mrpText: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'novaregular',
        marginBottom: 2
    },
    taxText: {
        fontSize: 10,
        color: '#999',
        fontFamily: 'novaregular',
    },
    safetyContainer: {
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 16,
        fontFamily: 'novabold',
        color: '#333',
        marginBottom: 15,
    },
    safetyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 12,
    },
    safetyIcon: {
        width: 32,
        height: 32,
        marginRight: 15,
    },
    safetyTitle: {
        fontSize: 14,
        fontFamily: 'novabold',
        color: '#333',
        marginBottom: 2,
    },
    safetyDesc: {
        fontSize: 12,
        fontFamily: 'novaregular',
        color: '#666',
        marginTop: 1,
    }
});
