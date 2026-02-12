import { View, RefreshControl, Text, FlatList, StyleSheet, Image, Alert, ActivityIndicator, ToastAndroid, StatusBar } from 'react-native';
import { responsiveScreenFontSize, responsiveScreenWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router, useFocusEffect } from 'expo-router';
import { _retrieveData } from "../../local_storage";
import { useEffect, useState, useCallback } from 'react';
import axios from '../../helper';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const DUMMY_PRESCRIPTIONS = [
  { id: '1', name: 'Prescription #1023', date: '12 Feb 2024', status: 'Pending', image: 'https://cdn-icons-png.flaticon.com/512/2965/2965386.png', medicine_count: 3 },
  { id: '2', name: 'Prescription #1024', date: '10 Feb 2024', status: 'Approved', image: 'https://cdn-icons-png.flaticon.com/512/2965/2965386.png', medicine_count: 5 },
  { id: '3', name: 'Prescription #1025', date: '08 Feb 2024', status: 'Rejected', image: null, medicine_count: 1 },
];

const Prescription = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  useFocusEffect(
    useCallback(() => {
      // Re-fetch when screen focuses
      if (data) {
        getPrescriptions()
      }
    }, [data])
  )

  useEffect(() => {
    _retrieveData("USER_DATA").then((userdata) => {
      if (userdata && userdata !== 'error') {
        setData(userdata)
      }
      // If no user/error, we essentially stay in guest mode or empty state
    });
  }, [])

  useEffect(() => {
    if (data) {
      getPrescriptions()
    } else {
      // Fallback to dummy data for demonstration if no user or just to show design
      setPrescriptions(DUMMY_PRESCRIPTIONS);
    }
  }, [data])

  const getPrescriptions = async () => {
    if (!data?.mobile) {
      setPrescriptions(DUMMY_PRESCRIPTIONS);
      return;
    }

    setLoading(true)
    const fd = new FormData();
    fd.append("mobile", data?.mobile)
    fd.append("case", 'get_prescriptions')
    try {
      const { data: res } = await axios.post('prescription/prescription.php', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res && res.data && res.data.length > 0) {
        setPrescriptions(res.data)
      } else {
        // Use dummy data if API returns empty, for better UX demonstration (optional, or show empty state)
        // For now, let's show empty state if API is real but empty, 
        // BUT since the user asked to "add some dummy data", we will merge or fallback.
        setPrescriptions(DUMMY_PRESCRIPTIONS);
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      // Fallback on error
      setPrescriptions(DUMMY_PRESCRIPTIONS);
      console.log('Error fetching prescriptions, showing dummy data', err);
    }
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'confirm') return '#4CAF50';
    if (s === 'pending') return '#FFC107';
    if (s === 'rejected') return '#F44336';
    return '#999';
  }

  const getStatusBg = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'confirm') return '#E8F5E9';
    if (s === 'pending') return '#FFF8E1';
    if (s === 'rejected') return '#FFEBEE';
    return '#F5F5F5';
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (item.status?.toLowerCase() === 'confirm' || item.status?.toLowerCase() === 'approved') {
          // Assuming prescriptiondetails expects an ID
          router.push({ pathname: `/prescriptiondetails`, params: { data: item.id } })
        } else {
          ToastAndroid.show('Prescription is still processing.', ToastAndroid.SHORT);
        }
      }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="file-prescription" size={20} color={Colors.primary} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.presName}>{item.name || 'Prescription'}</Text>
            <Text style={styles.presDate}>{item.date || 'Date not available'}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status || 'Unknown'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          {item.medicine_count ? `${item.medicine_count} Medicines` : 'View Details'}
        </Text>
        <View style={styles.arrowBtn}>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[Colors.primary, '#599C88']}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>My Prescriptions</Text>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => router.push('uploadprescriptions')}
        >
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={prescriptions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getPrescriptions} colors={[Colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="file-document-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No Prescriptions Found</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('uploadprescriptions')}
              >
                <Text style={styles.emptyBtnText}>Upload Now</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontFamily: 'novabold',
    fontSize: 24,
    color: '#fff',
  },
  uploadBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F9F4', // Light green tint
    justifyContent: 'center',
    alignItems: 'center',
  },
  presName: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#333',
  },
  presDate: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#888',
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'novabold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'novamedium',
    fontSize: 13,
    color: '#666',
  },
  arrowBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'novabold',
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    fontFamily: 'novabold',
    color: '#fff',
  }
});

export default Prescription;

