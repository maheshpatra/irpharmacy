import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { ApiService } from '../services/api';
import { useStore } from '../store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Search = () => {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState<'default' | 'priceLowHigh' | 'priceHighLow'>('default');
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const { addToCart } = useStore();

    // Check if valid category search
    const categoryParam = params.category as string | undefined;
    const initialCategory = categoryParam ? categoryParam : '';

    useEffect(() => {
        if (initialCategory) {
            setSearchQuery(initialCategory);
            fetchData(1, true, initialCategory);
        }
    }, [initialCategory]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    const performSearch = () => {
        if (!searchQuery.trim()) return;
        fetchData(1, true);
    };

    const fetchData = async (pageNum: number, reset: boolean = false, queryOverride?: string) => {
        const query = queryOverride || searchQuery;
        if (!query.trim()) return;

        if (reset) {
            setLoading(true);
            setProducts([]);
            setPage(1);
            setHasMore(true);
        }

        try {
            let newData: any[] = [];

            // Determine if strict category search or general search
            // If the query exactly matches the initial category parameter, treat it as category search
            const isCategorySearch = initialCategory && initialCategory.toLowerCase() === query.toLowerCase();

            if (isCategorySearch) {
                // Category Search
                const response = await ApiService.getMedicinesByCategory(query, pageNum);
                if (response.status === 'success' && Array.isArray(response.data)) {
                    newData = response.data;
                    // Check if more pages exist based on limit (default 20)
                    if (newData.length < 20) setHasMore(false);
                } else {
                    setHasMore(false);
                }
            } else {
                // General Search
                // Using new signature with page/limit
                const response = await ApiService.searchMedicines(query, "721434", pageNum, 20);

                if (Array.isArray(response)) {
                    newData = response;
                    if (newData.length < 20) setHasMore(false);
                } else if (response && response.status === 'success' && Array.isArray(response.data)) {
                    newData = response.data;
                    if (newData.length < 20) setHasMore(false);
                } else {
                    setHasMore(false);
                }
            }

            // Normalise + filter:
            //   - skip items that are out of stock / unavailable
            //   - skip items with price = 0 or null
            const normalizedData = newData
                .map(item => ({
                    ...item,
                    manufacturer: item.company_name || item.companyname || item.mfr || '',
                    description: item.desc || item.description || '',
                    priceVal: parseFloat((item.price || '0').toString().replace(/[^0-9.]/g, ''))
                }))
                .filter(item => {
                    // Remove zero / missing price
                    if (!item.price || item.priceVal <= 0) return false;
                    // Remove out-of-stock items
                    const avail = item.aviqty ?? item.available_qty ?? item.availableQty;
                    if (avail !== undefined && avail !== null && Number(avail) === 0) return false;
                    // Filter by status string
                    const s = (item.status || '').toLowerCase();
                    if (s === 'out of stock' || s === 'out_of_stock' || s === 'unavailable') return false;
                    return true;
                });

            if (reset) {
                setProducts(normalizedData);
            } else {
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = normalizedData.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
            }

            if (reset) setInitialLoadDone(true);

            // Increment page for next load
            if (hasMore) setPage(pageNum + 1);

        } catch (error) {
            console.log('Search fetch error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore && products.length > 0) {
            fetchData(page, false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData(1, true);
    };

    const applySort = (data: any[]) => {
        if (sortBy === 'priceLowHigh') {
            return [...data].sort((a, b) => a.priceVal - b.priceVal);
        } else if (sortBy === 'priceHighLow') {
            return [...data].sort((a, b) => b.priceVal - a.priceVal);
        }
        return data;
    };

    const sortedProducts = applySort(products);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/product_details', params: item })}
        >
            <FastImage
                source={item.image ? { uri: item.image } : require('../assets/images/med.jpg')}
                style={styles.itemImage}
                resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.itemContent}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemCategory} numberOfLines={1}>
                    {item.composition || item.category || 'Medicine'}
                </Text>
                <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    {item.discount > 0 ? (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{item.discount}% OFF</Text>
                        </View>
                    ) : null}
                </View>
                {item.manufacturer ? (
                    <Text style={styles.companyName} numberOfLines={1}>{item.manufacturer}</Text>
                ) : null}
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={async () => {
                    try {
                        await addToCart({
                            id: item.id.toString(),
                            name: item.name,
                            price: item.price?.toString() || '0',
                            image: item.image || '',
                            quantity: 1,
                            category: item.category
                        });
                        router.push('/cart');
                    } catch {
                        // Error Alert already shown by the store
                    }
                }}
            >
                <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header with Search */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
                <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 10 }}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        onSubmitEditing={performSearch}
                        returnKeyType="search"
                        autoFocus={!initialCategory}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); setProducts([]); setInitialLoadDone(false); }}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={styles.filterBtn}>
                    <Ionicons name="funnel-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Filter Options */}
            {showFilter && (
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterOption, sortBy === 'default' && styles.activeFilter]}
                        onPress={() => setSortBy('default')}
                    >
                        <Text style={[styles.filterText, sortBy === 'default' && styles.activeFilterText]}>Relevance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterOption, sortBy === 'priceLowHigh' && styles.activeFilter]}
                        onPress={() => setSortBy('priceLowHigh')}
                    >
                        <Text style={[styles.filterText, sortBy === 'priceLowHigh' && styles.activeFilterText]}>Price: Low to High</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterOption, sortBy === 'priceHighLow' && styles.activeFilter]}
                        onPress={() => setSortBy('priceHighLow')}
                    >
                        <Text style={[styles.filterText, sortBy === 'priceHighLow' && styles.activeFilterText]}>Price: High to Low</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading && page === 1 ? (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.emptyText}>Searching...</Text>
                </View>
            ) : (
                <FlatList
                    data={sortedProducts}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15, paddingBottom: 50 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={
                        loading && page > 1 ? (
                            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 10 }} />
                        ) : null
                    }
                    ListEmptyComponent={
                        initialLoadDone ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search-outline" size={60} color="#ddd" />
                                <Text style={styles.emptyText}>
                                    {searchQuery ? `No medicines found matching "${searchQuery}"` : "Type to search for medicines"}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="medical-outline" size={60} color="#ddd" />
                                <Text style={styles.emptyText}>Type to search for medicines</Text>
                            </View>
                        )
                    }
                />
            )}
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 45,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'novaregular',
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    filterBtn: {
        padding: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterOption: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    activeFilter: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: 12,
        fontFamily: 'novaregular',
        color: '#555',
    },
    activeFilterText: {
        color: '#fff',
        fontFamily: 'novabold',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 }
    },
    itemImage: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    itemCategory: {
        fontFamily: 'novaregular',
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    companyName: {
        fontFamily: 'novaregular',
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        fontFamily: 'novabold',
        fontSize: 16,
        color: Colors.primary,
        marginRight: 10,
    },
    discountBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    discountText: {
        fontFamily: 'novabold',
        fontSize: 10,
        color: 'green',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontFamily: 'novaregular',
        fontSize: 16,
        color: '#999',
        marginTop: 20,
        textAlign: 'center',
    },
    addButton: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: '#F0F9F4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
    }
});
