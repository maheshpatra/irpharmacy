import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // FontAwesome5 for better icons
import { router } from 'expo-router';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const NOTIFICATIONS = [
    {
        id: '1',
        title: 'Order Delivered',
        message: 'Your order #OD123456789 has been successfully delivered. Rate your experience!',
        time: '2 hours ago',
        type: 'order',
        icon: 'box-open' // FontAwesome5 icon name
    },
    {
        id: '2',
        title: 'Big Sale Alert! 50% OFF',
        message: 'Get flat 50% off on all wellness products. Offer valid till midnight.',
        time: '5 hours ago',
        type: 'promo',
        icon: 'tags'
    },
    {
        id: '3',
        title: 'Your Prescription is Verified',
        message: 'Our pharmacists have verified your prescription. You can now proceed to checkout.',
        time: '1 day ago',
        type: 'info',
        icon: 'file-medical'
    },
    {
        id: '4',
        title: 'Wallet Cashback Credited',
        message: '₹50 cashback has been credited to your wallet for your last purchase.',
        time: '2 days ago',
        type: 'wallet',
        icon: 'wallet'
    },
];

const Notifications = () => {
    const insets = useSafeAreaInsets();


    const getIconColor = (type: string) => {
        switch (type) {
            case 'order': return '#4CAF50';
            case 'promo': return '#FF9800';
            case 'wallet': return '#2196F3';
            default: return Colors.primary;
        }
    }

    const getIconBg = (type: string) => {
        switch (type) {
            case 'order': return '#E8F5E9';
            case 'promo': return '#FFF3E0';
            case 'wallet': return '#E3F2FD';
            default: return '#E0F2F1';
        }
    }

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
                <FontAwesome5 name={item.icon} size={20} color={getIconColor(item.type)} />
            </View>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={[styles.header, { paddingTop: Math.max(insets.top, 15) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.5),
        color: '#333',
    },
    clearText: {
        fontFamily: 'novabold',
        fontSize: 14,
        color: Colors.primary,
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    time: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#999',
    },
    message: {
        fontFamily: 'novaregular',
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        position: 'absolute',
        top: 15,
        right: 15,
    }
});
