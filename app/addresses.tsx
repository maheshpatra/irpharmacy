import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import HeaderAB from '../components/HeaderAB';
import { useStore } from '../store/useStore';
import Colors from '../constants/Colors';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { showAlert } from '../components/CustomAlert';


export default function Addresses() {
    const { addresses, removeAddress } = useStore();

    const handleAddAddress = () => {
        router.push({ pathname: '/location_selection', params: { source: 'addresses' } } as any);
    };

    const handleDelete = (id: string) => {
        showAlert({
            type: 'confirm',
            title: 'Delete Address',
            message: 'Are you sure you want to delete this address?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => removeAddress(id) }
            ]
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.addressCard}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={item.label.toLowerCase() === 'work' ? 'briefcase' : 'home'}
                    size={24}
                    color={Colors.primary}
                />
            </View>
            <View style={styles.addressContent}>
                <Text style={styles.addressLabel}>{item.label}</Text>
                <Text style={styles.addressDetails} numberOfLines={3}>{item.details}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Feather name="trash-2" size={18} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <HeaderAB title={'Saved Addresses'} notification={false} />

            {addresses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconBg}>
                        <Ionicons name="location-outline" size={60} color={Colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>No Addresses Found</Text>
                    <Text style={styles.emptySubtitle}>Save your delivery locations for faster checkout.</Text>
                    <TouchableOpacity style={styles.addBtnLarge} onPress={handleAddAddress}>
                        <Text style={styles.addBtnText}>Add New Address</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.addBtnLarge} onPress={handleAddAddress}>
                            <Text style={styles.addBtnText}>Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#F0F9F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    addressContent: {
        flex: 1,
        marginRight: 10,
    },
    addressLabel: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2),
        color: '#333',
        marginBottom: 4,
    },
    addressDetails: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.7),
        color: '#666',
        lineHeight: 20,
    },
    deleteBtn: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -50,
    },
    emptyIconBg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F9F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    emptyTitle: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.5),
        color: '#333',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontFamily: 'novaregular',
        fontSize: responsiveFontSize(1.8),
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addBtnLarge: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    addBtnText: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2),
        color: '#fff',
    }
});
