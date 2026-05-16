import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Image, ActivityIndicator, StatusBar, Dimensions,
} from 'react-native';
import { useStore } from '../store/useStore';
import Colors from '../constants/Colors';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { showAlert } from '../components/CustomAlert';

const { width } = Dimensions.get('window');

const CartScreen = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, syncCartFromServer, cartLoading } = useStore();

    useEffect(() => {
        syncCartFromServer();
    }, []);

    const handleCheckout = () => {
        if (cart.length === 0) {
            showAlert({ type: 'warning', title: 'Cart is Empty', message: 'Please add items to cart first.' });
            return;
        }
        router.push('/checkout');
    };

    const handleRemove = (id: string, name: string) => {
        showAlert({
            type: 'confirm',
            title: 'Remove Item',
            message: `Remove "${name}" from cart?`,
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
            ],
        });
    };

    const formatPrice = (price: any): string => {
        if (price === undefined || price === null) return '0.00';
        const str = typeof price === 'number' ? price.toString() : String(price);
        const num = parseFloat(str.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    const toNum = (price: any): number => parseFloat(formatPrice(price));

    const itemTotal = (item: any) =>
        (toNum(item.price) * (item.quantity || 1)).toFixed(2);

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.cartItem}>
            {/* Rx badge for medicines */}
            <View style={styles.rxBadge}>
                <Text style={styles.rxText}>Rx</Text>
            </View>

            {/* Product image */}
            <View style={styles.imageBox}>
                <Image
                    source={item.image ? { uri: item.image } : require('../assets/images/med.jpg')}
                    style={styles.itemImage}
                    resizeMode="contain"
                />
            </View>

            {/* Details */}
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPriceLabel}>
                    ₹{formatPrice(item.price)} <Text style={styles.itemPerUnit}>per unit</Text>
                </Text>

                {/* Qty stepper */}
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        style={[styles.qtyCircle, item.quantity <= 1 && { opacity: 0.4 }]}
                        activeOpacity={0.7}
                    >
                        <Feather name="minus" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        style={styles.qtyCircle}
                        activeOpacity={0.7}
                    >
                        <Feather name="plus" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Right column — total + delete */}
            <View style={styles.rightCol}>
                <Text style={styles.itemTotal}>₹{itemTotal(item)}</Text>
                <TouchableOpacity
                    onPress={() => handleRemove(item.id, item.name)}
                    style={styles.deletePill}
                    activeOpacity={0.75}
                >
                    <Ionicons name="trash-outline" size={15} color="#E53935" />
                </TouchableOpacity>
            </View>
        </View>
    );

    /* ── LOADING ── */
    if (cartLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Stack.Screen options={{
                    headerShown: true,
                    title: 'My Cart',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                    headerTitleStyle: {
                        fontFamily: 'novabold',
                        fontSize: 16,
                        color: '#333',
                    },
                }} />
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 12, color: '#888', fontFamily: 'novaregular', fontSize: 14 }}>
                    Syncing your cart…
                </Text>
            </View>
        );
    }

    /* ── EMPTY ── */
    if (cart.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F7FBFF" />
                <Stack.Screen options={{
                    headerShown: true,
                    title: 'My Cart',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                }} />
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconRing}>
                        <MaterialCommunityIcons name="cart-outline" size={64} color={Colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Add medicines and healthcare products to get started
                    </Text>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85}>
                        <LinearGradient
                            colors={[Colors.primary, '#7C9644']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.browseBtn}
                        >
                            <Ionicons name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.browseBtnText}>Browse Medicines</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    /* ── FILLED CART ── */
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F7FBFF" />
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: `My Cart (${cart.length})`,
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#F7FBFF' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => showAlert({
                                type: 'confirm',
                                title: 'Clear Cart',
                                message: 'Remove all items from your cart?',
                                buttons: [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Clear All', style: 'destructive', onPress: clearCart },
                                ],
                            })}
                            style={{ marginRight: 16 }}
                        >
                            <Text style={{ color: '#E53935', fontFamily: 'novabold', fontSize: 14 }}>Clear All</Text>
                        </TouchableOpacity>
                    ),
                }}
            />

            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.deliveryBanner}>
                        <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                        <Text style={styles.deliveryText}>  Free delivery on this order 🎉</Text>
                    </View>
                }
            />

            {/* ── FOOTER ── */}
            <View style={styles.footer}>
                {/* Bill summary */}
                <View style={styles.billCard}>
                    <Text style={styles.billTitle}>Bill Summary</Text>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</Text>
                        <Text style={styles.billValue}>₹{cartTotal().toFixed(2)}</Text>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <View style={styles.freePill}>
                            <Text style={styles.freeText}>FREE</Text>
                        </View>
                    </View>

                    <View style={[styles.billRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{cartTotal().toFixed(2)}</Text>
                    </View>
                </View>

                {/* Checkout CTA */}
                <TouchableOpacity onPress={handleCheckout} activeOpacity={0.88} style={styles.checkoutWrapper}>
                    <LinearGradient
                        colors={[Colors.primary, '#5DA34A']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.checkoutBtn}
                    >
                        <View style={styles.checkoutLeft}>
                            <Text style={styles.checkoutItemCount}>{cart.length} item{cart.length !== 1 ? 's' : ''}</Text>
                            <Text style={styles.checkoutTotal}>₹{cartTotal().toFixed(2)}</Text>
                        </View>
                        <View style={styles.checkoutRight}>
                            <Text style={styles.checkoutLabel}>Proceed to Checkout</Text>
                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FBFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 240,
    },
    deliveryBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 10,
        borderRadius: 10,
        marginBottom: 16,
    },
    deliveryText: {
        fontFamily: 'novabold',
        fontSize: 13,
        color: '#2E7D32',
    },

    // ── Cart Item ──────────────────────────────────────────────
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#3A7D44',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F5FF',
        position: 'relative',
    },
    rxBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#EFF8FF',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    rxText: {
        fontFamily: 'novabold',
        fontSize: 9,
        color: '#2563EB',
        letterSpacing: 0.5,
    },
    imageBox: {
        width: 80,
        height: 80,
        backgroundColor: '#F8FAFE',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEF2FF',
        marginTop: 4,
    },
    itemImage: {
        width: 65,
        height: 65,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontFamily: 'novabold',
        fontSize: 14,
        color: '#1A1A2E',
        marginBottom: 4,
        lineHeight: 20,
    },
    itemPriceLabel: {
        fontFamily: 'novabold',
        fontSize: 13,
        color: Colors.primary,
        marginBottom: 10,
    },
    itemPerUnit: {
        fontFamily: 'novaregular',
        fontSize: 11,
        color: '#999',
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F0F7F0',
        borderWidth: 1.5,
        borderColor: Colors.primary + '55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#1A1A2E',
        paddingHorizontal: 14,
        minWidth: 40,
        textAlign: 'center',
    },
    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        paddingLeft: 8,
    },
    itemTotal: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#1A1A2E',
    },
    deletePill: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FFF0F0',
        borderWidth: 1,
        borderColor: '#FFCDD2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Footer ────────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 28,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
    },
    billCard: {
        marginBottom: 14,
    },
    billTitle: {
        fontFamily: 'novabold',
        fontSize: 15,
        color: '#1A1A2E',
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
    },
    billLabel: {
        fontFamily: 'novaregular',
        fontSize: 13,
        color: '#777',
    },
    billValue: {
        fontFamily: 'novabold',
        fontSize: 13,
        color: '#333',
    },
    freePill: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    freeText: {
        fontFamily: 'novabold',
        fontSize: 11,
        color: '#2E7D32',
        letterSpacing: 0.5,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 6,
        paddingTop: 10,
    },
    totalLabel: {
        fontFamily: 'novabold',
        fontSize: 17,
        color: '#1A1A2E',
    },
    totalValue: {
        fontFamily: 'novabold',
        fontSize: 22,
        color: Colors.primary,
    },
    checkoutWrapper: {
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    checkoutLeft: {
        alignItems: 'flex-start',
    },
    checkoutItemCount: {
        fontFamily: 'novaregular',
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 0.3,
    },
    checkoutTotal: {
        fontFamily: 'novabold',
        fontSize: 20,
        color: '#fff',
    },
    checkoutRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkoutLabel: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#fff',
        marginRight: 4,
    },

    // ── Empty state ───────────────────────────────────────────
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconRing: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#EFF8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        borderWidth: 2,
        borderColor: Colors.primary + '33',
    },
    emptyTitle: {
        fontFamily: 'novabold',
        fontSize: 24,
        color: '#1A1A2E',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#888',
        marginBottom: 36,
        textAlign: 'center',
        lineHeight: 22,
    },
    browseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 15,
        borderRadius: 18,
    },
    browseBtnText: {
        fontFamily: 'novabold',
        color: '#fff',
        fontSize: 15,
    },
});

export default CartScreen;
