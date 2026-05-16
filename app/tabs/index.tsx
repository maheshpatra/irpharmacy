import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  NativeModules,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import BannerComponent from '../../components/BannerComponent';
import { ApiService } from '../../services/api';
import { useStore } from '../../store/useStore';
import { Ionicons, FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { _retrieveData, _storeData } from '../../local_storage';
import { showAlert } from '../../components/CustomAlert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DUMMY_CATEGORIES = [
  { id: 1, name: 'Diabetes', url: 'https://cdn-icons-png.flaticon.com/512/2821/2821901.png' },
  { id: 2, name: 'Heart', url: 'https://cdn-icons-png.flaticon.com/512/2554/2554245.png' },
  { id: 3, name: 'Stomach', url: 'https://cdn-icons-png.flaticon.com/512/2821/2821804.png' },
  { id: 4, name: 'Skin', url: 'https://cdn-icons-png.flaticon.com/512/2965/2965386.png' },
  { id: 5, name: 'Eye', url: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png' },
  { id: 6, name: 'Covid', url: 'https://cdn-icons-png.flaticon.com/512/2750/2750794.png' },
];

const Home = () => {
  const { StatusBarManager } = NativeModules;
  const insets = useSafeAreaInsets();
  const { username, setUser, addToCart, cart, addresses } = useStore();

  const [data, setdata] = useState<any>([]);
  const [tabdata, settabdata] = useState<any[]>(DUMMY_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [featuredMedicines, setFeaturedMedicines] = useState<any[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  useEffect(() => {
    loadUser();
    fetchBanners();
    fetchTabs();
    fetchFeaturedMedicines();
  }, []);

  useEffect(() => {
    // If no address selected, force location selection
    const timer = setTimeout(() => {
      if (addresses.length === 0) {
        router.push({ pathname: '/location_selection', params: { source: 'addresses' } } as any);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [addresses]);

  const loadUser = async () => {
    let userData = await _retrieveData('USER_DATA');
    if (userData) setUser(userData);
    try {
      const response = await ApiService.getUser();
      if (response && response.status === 'success' && response.data) {
        const freshUser = {
          ...userData,
          userid: response.data.id,
          username: response.data.name,
          mobile: response.data.mobile,
          email: response.data.email,
          profile_image: response.data.photo ? `https://irhealthcareservice.com/app_api/${response.data.photo}` : null
        };
        setUser(freshUser);
        await _storeData('USER_DATA', freshUser);
      }
    } catch { }
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const bannerData = await ApiService.getBanners('top');
      let formattedBanners = [];
      if (bannerData?.status === 'success' && bannerData?.data && Array.isArray(bannerData.data)) {
        formattedBanners = bannerData.data.map((item: any) => ({
          ...item,
          img: item.image_url ? `https://irhealthcareservice.com/app_api/${item.image_url}` : '',
          link: item.click_url || item.image_link || ''
        }));
      } else if (bannerData?.banner && Array.isArray(bannerData.banner)) {
        formattedBanners = bannerData.banner;
      }
      setdata({ banner: formattedBanners });
    } catch { }
    finally { setLoading(false); }
  };

  const fetchFeaturedMedicines = async () => {
    setFeaturedLoading(true);
    try {
      const res = await ApiService.getFeaturedMedicines('721434', 10);
      const raw = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setFeaturedMedicines(raw.slice(0, 10));
    } catch { }
    finally { setFeaturedLoading(false); }
  };

  const fetchTabs = async () => {
    try {
      const categoriesResponse = await ApiService.getCategories();
      if (categoriesResponse.status === 'success' && Array.isArray(categoriesResponse.data)) {
        const mappedCategories = categoriesResponse.data.map((catName: string, index: number) => {
          let imageUrl = 'https://cdn-icons-png.flaticon.com/512/2965/2965386.png';
          const lowerName = catName.toLowerCase();
          if (lowerName.includes('food')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/2821/2821901.png';
          else if (lowerName.includes('medicine')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/2554/2554245.png';
          else if (lowerName.includes('otc')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/2821/2821804.png';
          else if (lowerName.includes('surgical')) imageUrl = 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png';
          return { id: index + 1, name: catName, url: imageUrl };
        });
        settabdata(mappedCategories);
      }
    } catch { }
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      category: item.category
    });
    showAlert({
      type: 'success', title: 'Added to Cart', message: `${item.name} added to your cart.`,
      buttons: [
        { text: 'Continue', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    });
  };

  const SkeletonLoader = () => (
    <View style={{ paddingHorizontal: 15 }}>
      <SkeletonPlaceholder backgroundColor='#e1e9ee' highlightColor="#f2f8fc">
        <SkeletonPlaceholder.Item width={width - 30} height={180} borderRadius={15} />
      </SkeletonPlaceholder>
    </View>
  );

  const renderLocationHeader = () => (
    <View style={styles.topHeaderContainer}>
      <View style={styles.locationRow}>
        <TouchableOpacity style={styles.locationBtn} onPress={() => router.push('location_selection')}>
          <View style={styles.locationIconBg}>
            <Ionicons name="location" size={18} color="#fff" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.locationLabel}>Delivering to</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.locationValue} numberOfLines={1}>
                {addresses.length > 0 ? addresses[addresses.length - 1].details : 'Select Location'}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#333" style={{ marginLeft: 2 }} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={22} color="#333" />
            {cart.length > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderGreetingHeader = () => (
    <View style={styles.greetingContainer}>
      <View style={styles.headerGreeting}>
        <Text style={styles.greetingText}>Hello,</Text>
        <Text style={styles.usernameText}>{username} 👋</Text>
      </View>
    </View>
  );

  const renderStickySearchBar = () => (
    <View style={styles.stickySearchWrapper}>
      <TouchableOpacity
        style={styles.searchContainer}
        activeOpacity={0.9}
        onPress={() => router.push('search')}
      >
        <Ionicons name="search" size={20} color={Colors.primary} style={{ marginRight: 10, opacity: 0.8 }} />
        <Text style={styles.searchInput}>Search for medicines, health products...</Text>
        <View style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.9}
        onPress={() => router.push('uploadprescriptions')}
      >
        <LinearGradient
          colors={['#E3FDF5', '#FFE6FA']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.actionGradient}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.actionTitle}>Order via</Text>
            <Text style={styles.actionSubtitle}>Prescription</Text>
            <View style={styles.ctaContainer}>
              <Text style={styles.actionCta}>Upload Now</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
            </View>
          </View>
          <Image
            source={require('../../assets/images/homepage-con.png')}
            style={styles.actionImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        activeOpacity={0.9}
        onPress={() => Linking.openURL(`tel:${'9800424058'}`)}
      >
        <LinearGradient
          colors={['#FFF1EB', '#ACE0F9']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.actionGradient}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.actionTitle}>Call to</Text>
            <Text style={styles.actionSubtitle}>Order</Text>
            <View style={styles.ctaContainer}>
              <Text style={styles.actionCta}>Call Now</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
            </View>
          </View>
          <Image
            source={require('../../assets/images/homepage-cicon-2.png')}
            style={styles.actionImage}
            resizeMode="contain"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderMedicineItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.medicineCard}
      onPress={() => router.push({ pathname: '/product_details', params: item })}
    >
      <View style={styles.discountTag}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.medicineImage} resizeMode="contain" />
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineCategory}>{item.category}</Text>
        <Text numberOfLines={2} style={styles.medicineName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.medicinePrice}>{item.price}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: 'search', params: { category: item.name } })}
      style={styles.categoryItem} activeOpacity={0.7}>
      <View style={styles.categoryIconContainer}>
        <Image source={{ uri: item.url }} style={styles.categoryIcon} resizeMode="contain" />
      </View>
      <Text numberOfLines={2} style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} backgroundColor="#ffffff" style="dark" />

      {renderLocationHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickyHeaderIndices={[1]}
      >
        {renderGreetingHeader()}
        {renderStickySearchBar()}

        {renderQuickActions()}

        {/* Banners */}
        <View style={styles.sectionContainer}>
          {loading ? <SkeletonLoader /> : (
            data?.banner?.length > 0 && (
              <BannerComponent h={responsiveScreenWidth(45)} images={data?.banner} />
            )
          )}
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => router.push('categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={tabdata}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {/* Shop By Concern */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { marginLeft: 15, marginBottom: 15 }]}>Shop by Health Concern</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 15 }}>
            {['Diabetes', 'Heart Care', 'Stomach Care', 'Eye Care', 'Skin Care'].map((concern, index) => (
              <TouchableOpacity key={index} style={styles.concernCard}>
                <View style={styles.concernIcon}>
                  <FontAwesome name="heartbeat" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.concernText}>{concern}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Medicines — Live API */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Medicines</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: 'search', params: { query: 'tablet' } } as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredLoading ? (
            <View style={{ paddingLeft: 15, flexDirection: 'row' }}>
              {[1, 2].map(i => (
                <SkeletonPlaceholder key={i} backgroundColor='#e1e9ee' highlightColor='#f2f8fc'>
                  <SkeletonPlaceholder.Item width={responsiveScreenWidth(42)} height={200} borderRadius={18} marginRight={15} />
                </SkeletonPlaceholder>
              ))}
            </View>
          ) : featuredMedicines.length > 0 ? (
            <FlatList
              data={featuredMedicines}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
              renderItem={renderMedicineItem}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Text style={{ paddingHorizontal: 20, color: '#aaa', fontFamily: 'novaregular' }}>No featured items available</Text>
          )}
        </View>

        {/* Brand Images (Existing) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { marginLeft: 15, marginBottom: 10 }]}>Trusted Brands</Text>
          <View style={styles.brandGrid}>
            {["https://irhealthcareservice.com/assets/images/brand-logo/brand-logo-1.jpg",
              "https://irhealthcareservice.com/assets/images/brand-logo/brand-logo-2.jpg",
              "https://irhealthcareservice.com/assets/images/brand-logo/brand-logo-3.jpg",
              "https://irhealthcareservice.com/assets/images/brand-logo/brand-logo-4.jpg"].map((img, i) => (
                <View key={i} style={styles.brandItem}>
                  <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  topHeaderContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 10,
    zIndex: 101,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  stickySearchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 100,
    marginTop: -1,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationLabel: {
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(1.6),
    color: '#999',
    marginBottom: 2,
  },
  locationValue: {
    fontFamily: 'novabold',
    fontSize: 14,
    color: '#333',
    maxWidth: 150,
  },
  headerGreeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(2),
    color: '#666',
  },
  usernameText: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(3.2),
    color: '#333',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 42,
    height: 42,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red || 'red',
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingLeft: 15,
    paddingRight: 5,
    height: 54,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(1.8),
    color: '#333',
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 25,
    zIndex: 0,
  },
  actionCard: {
    width: '48%',
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  actionGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 5,
  },
  actionTitle: {
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(1.5),
    color: '#666',
  },
  actionSubtitle: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(2),
    color: '#000',
    marginBottom: 6,
    lineHeight: 24,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  actionCta: {
    fontFamily: 'novabold',
    fontSize: 12,
    color: Colors.primary,
    marginRight: 4,
  },
  actionImage: {
    width: 55,
    height: 55,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(2.2),
    color: '#333',
  },
  seeAllText: {
    fontFamily: 'novabold',
    fontSize: 14,
    color: Colors.primary,
  },
  // Medicine Card
  medicineCard: {
    width: responsiveScreenWidth(42),
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'novabold',
    color: Colors.primary,
  },
  medicineImage: {
    width: '100%',
    height: 110,
    marginBottom: 10,
    marginTop: 15,
  },
  medicineInfo: {
    marginTop: 5,
  },
  medicineCategory: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'novaregular',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  medicineName: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'novabold',
    color: '#333',
    marginBottom: 6,
    height: 42,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicinePrice: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'novabold',
    color: '#333',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Category Item
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 75,
  },
  categoryIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f8f8f8',
  },
  categoryIcon: {
    width: 32,
    height: 32,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'novamedium', // Changed to medium if avail or regular
    color: '#444',
    textAlign: 'center',
    lineHeight: 16,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  brandItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  concernCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  concernIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F4', // Light primary tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  concernText: {
    fontFamily: 'novabold',
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
  }
});
