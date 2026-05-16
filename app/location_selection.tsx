import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, StatusBar, TouchableOpacity,
    Dimensions, ActivityIndicator, Alert, TextInput, FlatList, Keyboard, Platform
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface SearchSuggestion {
    id: string;
    title: string;
    subtitle: string;
    latitude: number;
    longitude: number;
}

const LocationSelection = () => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [location, setLocation] = useState<Region | null>(null);
    const [address, setAddress] = useState<string>("Fetching location...");
    const [pincode, setPincode] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const params = useLocalSearchParams();
    const source = params.source;
    const addAddress = useStore((state) => state.addAddress);
    const [tag, setTag] = useState("Home");

    // ── Reverse geocode helper ─────────────────────────────────────
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const addrs = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (addrs && addrs.length > 0) {
                const a = addrs[0];
                const parts = [a.name, a.street, a.district, a.city, a.region, a.postalCode].filter(Boolean);
                const fullAddr = parts.join(', ') || `${a.city}, ${a.region}`;
                if (a.postalCode) setPincode(a.postalCode);
                return fullAddr;
            }
        } catch { }
        return "Unknown Location";
    };

    // ── Animate map + update address ───────────────────────────────
    const goToLocation = useCallback(async (lat: number, lng: number, animate = true) => {
        const region: Region = { latitude: lat, longitude: lng, latitudeDelta: 0.005, longitudeDelta: 0.005 };
        setLocation(region);
        if (animate && mapRef.current) {
            mapRef.current.animateToRegion(region, 800);
        }
        setAddress("Locating...");
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
    }, []);

    // ── Initial location fetch ─────────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                // Default fallback
                setLocation({ latitude: 20.5937, longitude: 78.9629, latitudeDelta: 5, longitudeDelta: 5 });

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setAddress("Permission denied");
                    setLoading(false);
                    return;
                }

                // 1) Try last known (instant)
                const lastKnown = await Location.getLastKnownPositionAsync({});
                if (lastKnown && !cancelled) {
                    await goToLocation(lastKnown.coords.latitude, lastKnown.coords.longitude, true);
                }

                // 2) Get fresh GPS with timeout
                const fresh = await Promise.race([
                    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
                    new Promise<null>(r => setTimeout(() => r(null), 8000)),
                ]);
                if (fresh && !cancelled) {
                    await goToLocation(fresh.coords.latitude, fresh.coords.longitude, true);
                }
            } catch (e) {
                console.warn("Location init error:", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Debounced search suggestions ───────────────────────────────
    const onSearchChange = (text: string) => {
        setSearchQuery(text);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (!text.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setShowSuggestions(true);
        searchTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await Location.geocodeAsync(text);
                if (results && results.length > 0) {
                    const mapped: SearchSuggestion[] = [];
                    for (let i = 0; i < Math.min(results.length, 5); i++) {
                        const { latitude, longitude } = results[i];
                        const addr = await reverseGeocode(latitude, longitude);
                        const parts = addr.split(', ');
                        mapped.push({
                            id: `${i}`,
                            title: parts.slice(0, 2).join(', ') || text,
                            subtitle: parts.slice(2).join(', ') || '',
                            latitude,
                            longitude,
                        });
                    }
                    setSuggestions(mapped);
                } else {
                    setSuggestions([]);
                }
            } catch {
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 600);
    };

    const selectSuggestion = (item: SearchSuggestion) => {
        Keyboard.dismiss();
        setSearchQuery(item.title);
        setShowSuggestions(false);
        setSuggestions([]);
        goToLocation(item.latitude, item.longitude, true);
    };

    // ── Re-locate me ───────────────────────────────────────────────
    const getCurrentLocation = async () => {
        setIsLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please enable location permissions.');
                return;
            }
            const loc = await Promise.race([
                Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
                new Promise<null>(r => setTimeout(() => r(null), 8000)),
            ]);
            if (loc) {
                await goToLocation(loc.coords.latitude, loc.coords.longitude, true);
            } else {
                Alert.alert("Timeout", "Could not fetch location. Please try again.");
            }
        } catch (e) {
            console.warn("Locate error:", e);
        } finally {
            setIsLocating(false);
        }
    };

    // ── Map drag handler ───────────────────────────────────────────
    const onRegionChangeComplete = useCallback(async (region: Region) => {
        setLocation(region);
        setAddress("Locating...");
        const addr = await reverseGeocode(region.latitude, region.longitude);
        setAddress(addr);
    }, []);

    // ── Confirm ────────────────────────────────────────────────────
    const handleConfirm = async () => {
        if (!location) { Alert.alert("Error", "Location not found yet."); return; }
        if (address === "Fetching location..." || address === "Locating...") {
            Alert.alert("Please Wait", "Still fetching the precise address..."); return;
        }

        const newAddr = {
            id: Date.now().toString(),
            label: tag || "Home",
            details: address,
            coordinates: { latitude: location.latitude, longitude: location.longitude },
        };

        await addAddress(newAddr);

        // Also set as selected address for immediate use in checkout
        const { setSelectedAddress } = useStore.getState();
        setSelectedAddress(newAddr);

        if (source === 'addresses') {
            Alert.alert("Success", "Address saved successfully!");
        }
        router.back();
    };

    // ── RENDER ─────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Map */}
            {location && (
                <MapView
                    ref={mapRef}
                    style={StyleSheet.absoluteFill}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={location}
                    showsUserLocation
                    showsMyLocationButton={false}
                    onRegionChangeComplete={onRegionChangeComplete}
                >
                    <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
                        <View style={styles.markerWrap}>
                            <View style={styles.markerDot} />
                        </View>
                    </Marker>
                </MapView>
            )}

            {/* Floating address pill */}
            {address === "Locating..." && (
                <View style={styles.mapLoader}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.mapLoaderText}>Fetching address...</Text>
                </View>
            )}

            {/* ── Search Bar ────────────────────────────────────── */}
            <View style={[styles.searchWrapper, { top: insets.top + 10 }]}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="arrow-back" size={22} color="#333" />
                    </TouchableOpacity>
                    <Ionicons name="search" size={18} color="#999" style={{ marginLeft: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for area, street name..."
                        placeholderTextColor="#aaa"
                        value={searchQuery}
                        onChangeText={onSearchChange}
                        onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}>
                            <Ionicons name="close-circle" size={20} color="#bbb" />
                        </TouchableOpacity>
                    )}
                    {isSearching && <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 6 }} />}
                </View>

                {/* ── Suggestions List ──────────────────────────── */}
                {showSuggestions && (
                    <View style={styles.suggestionsContainer}>
                        {isSearching && suggestions.length === 0 ? (
                            <View style={styles.suggestionLoading}>
                                <ActivityIndicator size="small" color={Colors.primary} />
                                <Text style={styles.suggestionLoadingText}>Searching...</Text>
                            </View>
                        ) : suggestions.length === 0 && searchQuery.trim().length > 2 ? (
                            <View style={styles.suggestionLoading}>
                                <Ionicons name="location-outline" size={20} color="#ccc" />
                                <Text style={styles.suggestionLoadingText}>No results found</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={suggestions}
                                keyExtractor={item => item.id}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.suggestionItem} onPress={() => selectSuggestion(item)}>
                                        <View style={styles.suggestionIcon}>
                                            <Ionicons name="location" size={18} color={Colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
                                            {item.subtitle ? <Text style={styles.suggestionSubtitle} numberOfLines={1}>{item.subtitle}</Text> : null}
                                        </View>
                                        <Ionicons name="arrow-forward-outline" size={16} color="#ccc" />
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                )}
            </View>

            {/* Initial Loading Overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContent}>
                        <View style={styles.loadingIconWrap}>
                            <Ionicons name="medical" size={36} color={Colors.primary} />
                        </View>
                        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 18 }} />
                        <Text style={styles.loadingTitle}>Locating you...</Text>
                        <Text style={styles.loadingSub}>Setting up your delivery experience</Text>
                    </View>
                </View>
            )}

            {/* Locate Me FAB */}
            <TouchableOpacity onPress={getCurrentLocation} style={[styles.locateFab, { bottom: 290 }]} activeOpacity={0.8}>
                {isLocating ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                    <Ionicons name="locate" size={24} color={Colors.primary} />
                )}
            </TouchableOpacity>

            {/* ── Bottom Sheet ──────────────────────────────────── */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Confirm Location</Text>

                <View style={styles.addressRow}>
                    <View style={styles.addrIconWrap}>
                        <Ionicons name="location" size={22} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.addrLabel}>Delivering to</Text>
                        <Text style={styles.addrText} numberOfLines={2}>{address}</Text>
                    </View>
                    <TouchableOpacity onPress={getCurrentLocation} style={styles.changeBtn}>
                        <Text style={styles.changeBtnText}>Relocate</Text>
                    </TouchableOpacity>
                </View>

                {source === 'addresses' && (
                    <View style={styles.tagInput}>
                        <Text style={styles.tagLabel}>Save As</Text>
                        <TextInput
                            style={styles.tagField}
                            placeholder="Home, Work, Other"
                            value={tag}
                            onChangeText={setTag}
                            placeholderTextColor="#999"
                        />
                    </View>
                )}

                <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85} style={styles.confirmBtn}>
                    <LinearGradient colors={[Colors.primary, '#7C9644']} style={styles.gradientBtn}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.confirmText}>Confirm Location</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LocationSelection;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // ── Map loader ──
    mapLoader: {
        position: 'absolute', top: '42%', alignSelf: 'center',
        backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 25, flexDirection: 'row', alignItems: 'center',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }, zIndex: 50,
    },
    mapLoaderText: { marginLeft: 10, fontFamily: 'novaregular', fontSize: 14, color: '#666' },

    // ── Search ──
    searchWrapper: { position: 'absolute', left: 16, right: 16, zIndex: 200 },
    searchBar: {
        backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, height: 54, elevation: 8, shadowColor: '#000',
        shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    },
    searchInput: { flex: 1, marginLeft: 8, fontFamily: 'novaregular', fontSize: 15, color: '#333' },

    // ── Suggestions ──
    suggestionsContainer: {
        backgroundColor: '#fff', borderRadius: 16, marginTop: 6,
        elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 }, maxHeight: 280, overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
        paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
    },
    suggestionIcon: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f9f4',
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    suggestionTitle: { fontFamily: 'novabold', fontSize: 14, color: '#333' },
    suggestionSubtitle: { fontFamily: 'novaregular', fontSize: 12, color: '#999', marginTop: 2 },
    suggestionLoading: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 20,
    },
    suggestionLoadingText: { marginLeft: 10, fontFamily: 'novaregular', fontSize: 14, color: '#999' },

    // ── Loading overlay ──
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.97)',
        justifyContent: 'center', alignItems: 'center', zIndex: 2000,
    },
    loadingContent: { alignItems: 'center', padding: 40 },
    loadingIconWrap: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0f9f4',
        justifyContent: 'center', alignItems: 'center',
    },
    loadingTitle: { marginTop: 16, fontFamily: 'novabold', fontSize: 20, color: '#333' },
    loadingSub: { marginTop: 8, fontFamily: 'novaregular', fontSize: 14, color: '#999' },

    // ── Locate FAB ──
    locateFab: {
        position: 'absolute', right: 16, backgroundColor: '#fff',
        width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center',
        elevation: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 }, zIndex: 50,
    },

    // ── Marker ──
    markerWrap: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(144,170,81,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    markerDot: {
        width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.primary,
        borderWidth: 3, borderColor: '#fff', elevation: 4,
    },

    // ── Bottom Sheet ──
    bottomSheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36,
        elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1, shadowRadius: 12,
    },
    handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#e0e0e0', alignSelf: 'center', marginBottom: 16 },
    sheetTitle: { fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333', marginBottom: 16 },
    addressRow: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9',
        padding: 14, borderRadius: 16, marginBottom: 20,
    },
    addrIconWrap: {
        width: 42, height: 42, borderRadius: 21, backgroundColor: '#eefcf1',
        justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    addrLabel: { fontFamily: 'novaregular', fontSize: 12, color: '#999', marginBottom: 3 },
    addrText: { fontFamily: 'novabold', fontSize: responsiveFontSize(1.7), color: '#333' },
    changeBtn: { backgroundColor: '#f0f9f4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    changeBtnText: { fontFamily: 'novabold', fontSize: 12, color: Colors.primary },
    tagInput: { marginBottom: 18 },
    tagLabel: { fontFamily: 'novabold', fontSize: 14, color: '#333', marginBottom: 8, marginLeft: 4 },
    tagField: {
        backgroundColor: '#f9f9f9', borderRadius: 12, paddingHorizontal: 15, height: 50,
        fontFamily: 'novaregular', fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#eee',
    },
    confirmBtn: { height: 56, borderRadius: 16, overflow: 'hidden' },
    gradientBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    confirmText: { fontFamily: 'novabold', fontSize: 16, color: '#fff' },
});
