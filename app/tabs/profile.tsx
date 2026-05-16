import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, ToastAndroid } from 'react-native';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { _retrieveData, _removeData, _storeData } from "../../local_storage";
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import EmailUpdate from '../../components/EmailUpdate';
import NameUpdate from '../../components/NameUpdate';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ApiService } from '../../services/api';
import { path } from '../../components/server';
import { showAlert } from '../../components/CustomAlert';

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
      try {
        if (field === 'email') {
          const response = await ApiService.updateEmail(value);
          if (response.status !== 'success') {
            ToastAndroid.show(response.message || "Failed to update email", ToastAndroid.SHORT);
            return;
          }
        }

        const updatedUser = { ...data, [field]: value };
        setData(updatedUser);
        await _storeData('USER_DATA', updatedUser);
        // Alert.alert("Success", "Profile updated successfully");
      } catch (error: any) {
        ToastAndroid.show(error.message || "An error occurred during update", ToastAndroid.SHORT);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      ToastAndroid.show('Sorry, we need camera roll permissions to make this work!', ToastAndroid.LONG);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      try {
        const response = await ApiService.uploadPhoto(uri);
        if (response.status === 'success') {
          const baseUrl = path.replace('v2/', '');
          const photoUrl = `${baseUrl}${response.data.photo_url}`;

          const updatedUser = { ...data, profile_image: photoUrl };
          setData(updatedUser);
          await _storeData('USER_DATA', updatedUser);
          ToastAndroid.show("Profile photo updated successfully", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.message || "Upload failed", ToastAndroid.SHORT);
        }
      } catch (e: any) {
        ToastAndroid.show(e.message || "Upload error", ToastAndroid.SHORT);
      }
    }
  };

  const handleLogout = () => {
    showAlert({
      type: 'confirm',
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await _removeData('USER_DATA');
            await _removeData('ACCESS_TOKEN');
            await _removeData('REFRESH_TOKEN');
            router.replace('/');
          }
        }
      ]
    });
  };

  const MenuSection = ({ title, items }: { title: string, items: any[] }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, index === items.length - 1 && { borderBottomWidth: 0 }]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color || '#E3F2FD' }]}>
              <Feather name={item.icon} size={20} color={item.iconColor || Colors.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.label}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#004d40', '#00695c']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: data?.profile_image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                <Feather name="camera" size={14} color="#004d40" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{data?.username || 'Guest User'}</Text>
              <Text style={styles.userPhone}>+91 {data?.mobile || '----------'}</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setPopupVisiblen(true)}
              >
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Account Info Card */}
        <View style={styles.emailCard}>
          <View style={styles.emailIcon}>
            <Feather name="mail" size={20} color="#555" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emailLabel}>Email Address</Text>
            <Text style={styles.emailValue}>{data?.email || 'Add Email Address'}</Text>
          </View>
          <TouchableOpacity onPress={() => setPopupVisible(true)}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        <MenuSection
          title="Medical Records"
          items={[
            { icon: 'file-text', label: 'My Prescriptions', action: () => router.push('/tabs/prescription'), color: '#E3F2FD', iconColor: '#1976D2' },
            { icon: 'shopping-bag', label: 'My Orders', action: () => router.push('/tabs/orders'), color: '#E8F5E9', iconColor: '#388E3C' },
          ]}
        />

        <MenuSection
          title="Account Settings"
          items={[
            { icon: 'map-pin', label: 'Saved Addresses', action: () => router.push('/addresses'), color: '#FFF3E0', iconColor: '#F57C00' },
            // { icon: 'credit-card', label: 'Payment Methods', action: () => {}, color: '#F3E5F5', iconColor: '#7B1FA2' },
          ]}
        />

        <MenuSection
          title="App Support"
          items={[
            { icon: 'info', label: 'About Us', action: () => router.push('/about'), color: '#ECEFF1', iconColor: '#455A64' },
            { icon: 'help-circle', label: 'Help & Support', action: () => router.push('/support'), color: '#ECEFF1', iconColor: '#455A64' },
            { icon: 'shield', label: 'Terms & Policies', action: () => router.push('/terms'), color: '#ECEFF1', iconColor: '#455A64' },
          ]}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#D32F2F" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

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
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#004d40',
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
    marginBottom: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'novabold',
    fontSize: 22,
    color: '#fff',
    marginBottom: 4,
  },
  userPhone: {
    fontFamily: 'novaregular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editBtnText: {
    fontFamily: 'novamedium',
    fontSize: 12,
    color: '#fff',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10, // overlap with header
  },
  emailCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emailLabel: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  emailValue: {
    fontFamily: 'novamedium',
    fontSize: 14,
    color: '#333',
  },
  changeLink: {
    fontFamily: 'novabold',
    fontSize: 14,
    color: Colors.primary,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'novabold',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'novamedium',
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutButtonText: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#D32F2F',
    marginLeft: 10,
  }
});