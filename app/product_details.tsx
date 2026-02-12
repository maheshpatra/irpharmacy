import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
    const params = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('About');

    // Dummy data if params are missing (for dev preview)
    const product = {
        name: params.name || 'Paracetamol 500mg',
        price: params.price || '₹20.00',
        image: params.image || 'https://5.imimg.com/data5/SELLER/Default/2020/10/YW/OY/XU/49579469/paracetamol-tablets-ip-500mg-500x500.jpg',
        description: 'Paracetamol is a common painkiller used to treat aches and pain. It can also be used to reduce a high temperature.',
        dosage: 'Take 1 tablet every 4-6 hours as needed. Do not exceed 4 tablets in 24 hours.',
        sideEffects: 'Nausea, allergic reactions, liver damage (in higher doses).',
        rating: 4.5,
        reviews: 120,
        category: params.category || 'Fever',
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
                        </View>
                        <View style={styles.ratingBadge}>
                            <FontAwesome name="star" size={14} color="#fff" />
                            <Text style={styles.ratingText}>{product.rating}</Text>
                        </View>
                    </View>

                    <Text style={styles.reviewCount}>({product.reviews} Reviews)</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{product.price}</Text>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                                <Ionicons name="remove" size={18} color="#555" />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                                <Ionicons name="add" size={18} color="#555" />
                            </TouchableOpacity>
                        </View>
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

                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>
                        ₹{(parseFloat(product.price.toString().replace('₹', '')) * quantity).toFixed(2)}
                    </Text>
                </View>
                <TouchableOpacity style={styles.addToCartBtn}>
                    <LinearGradient
                        colors={[Colors.primary, '#7C9644']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBtn}
                    >
                        <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.btnText}>Add to Cart</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

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
});
