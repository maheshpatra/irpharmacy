import React, { useEffect, useState } from 'react';
import { View, Image, Text, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveScreenWidth, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { _retrieveData, _removeData, _storeData } from "../../local_storage";
import { router } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import EmailUpdate from '../../components/EmailUpdate';
import NameUpdate from '../../components/NameUpdate';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupVisiblen, setPopupVisiblen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userdata = await _retrieveData("USER_DATA");
    if (userdata && userdata !== 'error') {
      setData(userdata);
    }
  };

  const handleUpdate = async (field: string, value: string) => {
    if (data) {
      const updatedUser = { ...data, [field]: value };
      setData(updatedUser);
      await _storeData('USER_DATA', updatedUser);
    }
  };

  const menuItems = [
    {
      section: 'Medical', items: [
        { icon: 'file-text', label: 'My Prescriptions', action: () => router.push('/tabs/prescription') },
        { icon: 'shopping-bag', label: 'My Orders', action: () => router.push('/tabs/orders') },
      ]
    },
    {
      section: 'Account', items: [
        { icon: 'map-pin', label: 'Saved Addresses', action: () => { } },
        { icon: 'credit-card', label: 'Payment Methods', action: () => { } },
      ]
    },
    {
      section: 'App', items: [
        { icon: 'help-circle', label: 'Help & Support', action: () => { } },
        { icon: 'info', label: 'Terms & Conditions', action: () => { } },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header Profile Section */}
      <LinearGradient
        colors={[Colors.primary, '#599C88']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileHeaderContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: data?.profile_image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Feather name="camera" size={14} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.userName}>{data?.username || 'Guest User'}</Text>
              <TouchableOpacity onPress={() => setPopupVisiblen(true)}>
                <Feather name="edit-2" size={16} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userMobile}>+91 {data?.mobile || '----------'}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Text style={styles.userEmail}>{data?.email || 'Add Email Address'}</Text>
              <TouchableOpacity onPress={() => setPopupVisible(true)}>
                <Feather name="edit-2" size={14} color="rgba(255,255,255,0.8)" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Feather name="folder" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>₹0</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity style={styles.statItem}>
            <View style={styles.statIconBg}>
              <Feather name="package" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        {menuItems.map((section, sIndex) => (
          <View key={sIndex} style={styles.sectionWrapper}>
            <Text style={styles.sectionHeader}>{section.section}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, index === section.items.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: '#F0F9F5' }]}>
                    <Feather name={item.icon as any} size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Feather name="chevron-right" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: 'destructive',
                  onPress: async () => {
                    await _removeData('USER_DATA');
                    await _removeData('ACCESS_TOKEN');
                    await _removeData('REFRESH_TOKEN');
                    router.replace('/');
                  }
                }
              ]
            );
          }}
        >
          <Feather name="log-out" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>

      <EmailUpdate
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onUpdate={(val) => handleUpdate('email', val)}
      />
      <NameUpdate
        visible={isPopupVisiblen}
        onClose={() => setPopupVisiblen(false)}
        onUpdate={(val) => handleUpdate('username', val)}
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
    height: responsiveScreenHeight(28),
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'novabold',
    fontSize: 22,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userMobile: {
    fontFamily: 'novaregular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  userEmail: {
    fontFamily: 'novaregular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    flex: 1,
    marginTop: -40,
    paddingHorizontal: 20,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  statValue: {
    fontFamily: 'novabold',
    fontSize: 18,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: 'novabold',
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    marginLeft: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontFamily: 'novamedium',
    fontSize: 15,
    color: '#333',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    elevation: 1,
  },
  logoutText: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#FF6B6B',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#ccc',
    fontFamily: 'novaregular',
    fontSize: 12,
    marginBottom: 20,
  }
});