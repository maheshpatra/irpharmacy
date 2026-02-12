import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';

const DUMMY_MEDICINES = [
    { id: 1, name: 'Paracetamol 500mg', price: '₹20.00', discount: '10% OFF', image: 'https://5.imimg.com/data5/SELLER/Default/2020/10/YW/OY/XU/49579469/paracetamol-tablets-ip-500mg-500x500.jpg', category: 'Fever' },
    { id: 2, name: 'Vitamin C Tablets', price: '₹150.00', discount: '5% OFF', image: 'https://m.media-amazon.com/images/I/71N7vj5cSXL._AC_UF1000,1000_QL80_.jpg', category: 'Supplement' },
    { id: 3, name: 'Cough Syrup', price: '₹85.00', discount: '15% OFF', image: 'https://5.imimg.com/data5/SELLER/Default/2022/12/YI/QW/YE/37190933/herbal-cough-syrup-500x500.jpg', category: 'Syrup' },
    { id: 4, name: 'Pain Relief Gel', price: '₹120.00', discount: '20% OFF', image: 'https://cdn01.pharmeasy.in/dam/products_otc/I40695/volini-pain-relief-gel-tube-of-75-g-2-1671743653.jpg', category: 'Pain Relief' },
    { id: 5, name: 'Dolo 650', price: '₹30.00', discount: '10% OFF', image: 'https://5.imimg.com/data5/SELLER/Default/2023/7/322312675/GV/OW/ZS/192666504/dolo-650-tablet-500x500.jpg', category: 'Fever' },
    { id: 6, name: 'Betadine Ointment', price: '₹110.00', discount: '5% OFF', image: 'https://5.imimg.com/data5/SELLER/Default/2023/5/306936324/EX/XM/SD/3414008/betadine-ointment-500x500.jpg', category: 'First Aid' },
];

const Search = () => {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(DUMMY_MEDICINES);

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text) {
            const newData = DUMMY_MEDICINES.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
        } else {
            setFilteredData(DUMMY_MEDICINES);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => router.push({ pathname: 'product_details', params: item })}
        >
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}</Text>
                    </View>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header with Search */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 10 }}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search medicines..."
                        value={search}
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {search.length > 0 &&
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    }
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={60} color="#ddd" />
                        <Text style={styles.emptyText}>No medicines found matching "{search}"</Text>
                    </View>
                }
            />
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
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
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
    },
    searchInput: {
        flex: 1,
        fontFamily: 'novaregular',
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
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
    }
});
