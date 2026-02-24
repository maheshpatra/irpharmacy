import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { responsiveFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import Colors from '../constants/Colors';
import { ApiService } from '../services/api';

const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getCategories();

            let categoriesData: string[] = [];
            if (Array.isArray(response)) {
                categoriesData = response;
            } else if (response.status === 'success' && Array.isArray(response.data)) {
                categoriesData = response.data;
            }

            if (categoriesData.length > 0) {
                const mappedCategories = categoriesData.map((catName: string, index: number) => {
                    let imageUrl = 'https://cdn-icons-png.flaticon.com/512/2965/2965386.png'; // Default
                    const lowerName = typeof catName === 'string' ? catName.toLowerCase() : '';

                    if (lowerName.includes('food')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/2821/2821901.png';
                    else if (lowerName.includes('medicine')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/2554/2554245.png';
                    else if (lowerName.includes('otc')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/2821/2821804.png';
                    else if (lowerName.includes('surgical')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png';

                    return {
                        id: index + 1,
                        name: catName,
                        url: imageUrl
                    };
                });
                setCategories(mappedCategories);
            }
        } catch (e) {
            console.log('Error fetching categories', e);
        } finally {
            setLoading(false);
        }
    };

    const renderCategoryItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            activeOpacity={0.8}
            onPress={() => {
                // Navigate to search or product listing filtering by this category
                router.push({ pathname: 'search', params: { category: item.name } });
            }}
        >
            <View style={styles.iconContainer}>
                <Image source={{ uri: item.url }} style={styles.icon} resizeMode="contain" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shop by Category</Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCategoryItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                />
            )}
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        paddingBottom: 15,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    backBtn: {
        padding: 5,
        marginRight: 15,
    },
    headerTitle: {
        fontFamily: 'novabold',
        fontSize: 20,
        color: '#333',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 15,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    categoryItem: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        width: responsiveScreenWidth(44),
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F3F6F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        width: 35,
        height: 35,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    categoryName: {
        fontSize: 14,
        fontFamily: 'novabold',
        color: '#444',
        flex: 1,
        textAlign: 'center',
        marginRight: 5
    }
});
