import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import Colors from '../constants/Colors';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const CartScreen = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useStore();

    const handleCheckout = () => {
        if (cart.length === 0) {
            Alert.alert("Cart is empty", "Please add items to cart primarily.");
            return;
        }
        // Navigate to checkout or order confirmation
        // router.push('/checkout'); // Assuming checkout route exists
        Alert.alert("Proceeding to Checkout", "Total: ₹" + cartTotal().toFixed(2));
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        style={styles.qtyBtn}
                    >
                        <Feather name="minus" size={16} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        style={styles.qtyBtn}
                    >
                        <Feather name="plus" size={16} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                style={styles.removeBtn}
            >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'My Cart', headerShadowVisible: false }} />

            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Feather name="shopping-cart" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.back()}>
                        <Text style={styles.shopNowText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>₹{cartTotal().toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        alignItems: 'center',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    itemPrice: {
        fontFamily: 'novabold',
        fontSize: 15,
        color: Colors.primary,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    qtyBtn: {
        padding: 8,
    },
    qtyText: {
        fontFamily: 'novabold',
        fontSize: 14,
        color: '#333',
        paddingHorizontal: 8,
    },
    removeBtn: {
        padding: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    totalLabel: {
        fontFamily: 'novamedium',
        fontSize: 18,
        color: '#666',
    },
    totalValue: {
        fontFamily: 'novabold',
        fontSize: 22,
        color: '#333',
    },
    checkoutBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        elevation: 4,
    },
    checkoutText: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'novamedium',
        fontSize: 18,
        color: '#999',
        marginTop: 20,
        marginBottom: 30,
    },
    shopNowBtn: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: Colors.primary,
        borderRadius: 25,
    },
    shopNowText: {
        fontFamily: 'novabold',
        color: '#fff',
        fontSize: 16,
    }
});

export default CartScreen;
