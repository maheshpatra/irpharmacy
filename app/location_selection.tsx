import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LocationSelection = () => {
    const [location, setLocation] = useState<any>(null);
    const [address, setAddress] = useState<string>("Fetching location...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                setAddress("Permission denied");
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });

            // Reverse Geocode
            try {
                let addresses = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });

                if (addresses && addresses.length > 0) {
                    const addr = addresses[0];
                    setAddress(`${addr.name || ''} ${addr.street || ''}, ${addr.city}, ${addr.region}`);
                }
            } catch (e) {
                setAddress("Unknown Location");
            }

            setLoading(false);
        })();
    }, []);

    const handleConfirm = () => {
        // In a real app, save address to context/storage
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent={true} />

            {/* Map View */}
            {location ? (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={location}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    <Marker coordinate={location} />
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Locating you...</Text>
                </View>
            )}

            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Bottom Sheet for Address */}
            <View style={styles.bottomSheet}>
                <View style={styles.handleIndicator} />

                <Text style={styles.sheetTitle}>Confirm Location</Text>

                <View style={styles.addressContainer}>
                    <View style={styles.pinIconContainer}>
                        <Ionicons name="location" size={24} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.addressLabel}>Current Location</Text>
                        <Text style={styles.addressText} numberOfLines={2}>
                            {address}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                    <LinearGradient
                        colors={[Colors.primary, '#7C9644']}
                        style={styles.gradientBtn}
                    >
                        <Text style={styles.confirmText}>Confirm Location</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default LocationSelection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: width,
        height: height, // Full screen map
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontFamily: 'novaregular',
        color: '#666',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    handleIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetTitle: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(2.2),
        color: '#333',
        marginBottom: 20,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 15,
        marginBottom: 25,
    },
    pinIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#eefcf1',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    addressLabel: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    addressText: {
        fontFamily: 'novabold',
        fontSize: responsiveFontSize(1.8),
        color: '#333',
    },
    confirmBtn: {
        height: 56,
        borderRadius: 15,
        overflow: 'hidden',
    },
    gradientBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmText: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#fff',
    },
});
