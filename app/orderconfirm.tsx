import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { responsiveFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router'

const { width } = Dimensions.get('window');

export default function OrderConfirm() {
  const { total, order_id } = useLocalSearchParams<{
    total: string;
    order_id: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* ── Celebration Section ──────────────────────────────── */}
      <View style={styles.successSection}>
        <View style={styles.iconRing}>
          <LinearGradient
            colors={[Colors.primary, '#7C9644']}
            style={styles.gradientIcon}
          >
            <Ionicons name="checkmark" size={60} color="#fff" />
          </LinearGradient>
        </View>
        
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successSubtitle}>
          Thank you for shopping with IR Pharmacy. Your health is our priority.
        </Text>
      </View>

      {/* ── Order Summary Card ───────────────────────────────── */}
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderIdText}>{order_id}</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Processing</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.orderFooter}>
          <View style={styles.amountWrap}>
            <Text style={styles.amountLabel}>Total Paid</Text>
            <Text style={styles.amountValue}>₹{total}</Text>
          </View>
          <View style={styles.deliveryBadge}>
            <Feather name="truck" size={14} color="#2E7D32" />
            <Text style={styles.deliveryText}>Free Delivery</Text>
          </View>
        </View>
      </View>

      {/* ── Action Buttons ───────────────────────────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => router.replace('/tabs/orders')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, '#5DA34A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.primaryBtnText}>View My Orders</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => router.replace('/tabs/home')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
      
      {/* ── Bottom Illustration (Optional) ───────────────────── */}
      <Image 
        source={require('../assets/images/homepage-con.png')} 
        style={styles.bottomIllu}
        resizeMode="contain"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  successSection: {
    alignItems: 'center',
    marginTop: responsiveFontSize(8),
    paddingHorizontal: 30,
  },
  iconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 24,
  },
  gradientIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontFamily: 'novabold',
    fontSize: 28,
    color: '#1A1A2E',
    marginBottom: 12,
  },
  successSubtitle: {
    fontFamily: 'novaregular',
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  orderCard: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 40,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderLabel: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  orderIdText: {
    fontFamily: 'novabold',
    fontSize: 15,
    color: '#1A1A2E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'novabold',
    fontSize: 12,
    color: '#EF6C00',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: 'novaregular',
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  amountValue: {
    fontFamily: 'novabold',
    fontSize: 24,
    color: Colors.primary,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deliveryText: {
    fontFamily: 'novabold',
    fontSize: 11,
    color: '#2E7D32',
    marginLeft: 4,
  },
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 30,
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  primaryBtnText: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#fff',
  },
  secondaryBtn: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryBtnText: {
    fontFamily: 'novabold',
    fontSize: 15,
    color: '#666',
  },
  bottomIllu: {
    width: width * 0.6,
    height: 150,
    position: 'absolute',
    bottom: -20,
    opacity: 0.1,
  }
});