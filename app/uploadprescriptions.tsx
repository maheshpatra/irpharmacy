import { View, Text, TouchableOpacity, Image, Modal, Alert, ScrollView, FlatList, StyleSheet, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveScreenFontSize, responsiveScreenWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'
import axios from '../helper'
import { _retrieveData } from "../local_storage";
import { LinearGradient } from 'expo-linear-gradient';

export default function UploadPrescriptions() {

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [selecttype, setSelectType] = useState({
    id: 1,
    name: 'Instant Order',
    desc: 'Our pharmacist will call you to confirm medicines.',
    badge: 'Fastest'
  });
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    _retrieveData("USER_DATA").then((userdata) => {
      if (userdata && userdata !== 'error') {
        setData(userdata)
      } else {
        Alert.alert('Error', 'User not found!')
      }
    });
  }, [])

  const orderTypes = [
    {
      id: 1,
      name: 'Instant Order',
      desc: 'Our pharmacist will call you to confirm medicines.',
      badge: 'Fastest'
    },
    {
      id: 2,
      name: 'Digitized Order',
      desc: 'Convert to digital list first (1-2 hrs), then order.',
      badge: 'Detailed'
    }
  ]

  const pickCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setModalVisible(false)
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setModalVisible(false)
    }
  };

  const upload = async () => {
    setLoading(true);
    if (!image) {
      Alert.alert('No photo selected', 'Please select a photo first.');
      setLoading(false);
      return;
    }
    const assets_ = {
      uri: image.uri,
      name: image.uri.split("/").pop(),
      type: 'image/jpeg', // Force jpeg type for simplicity
    };
    let bodyContent = new FormData();
    bodyContent.append("image", assets_ as any);
    bodyContent.append("mobile", data.mobile);
    bodyContent.append("type", selecttype.name);
    bodyContent.append("name", data.username);

    try {
      const { data: result } = await axios.post('prescription/upload.php', bodyContent, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!result.error) {
        setLoading(false)
        Alert.alert("Success", "Prescription Uploaded Successfully!");
        router.push('/tabs/prescription') // Fixed route name to match list
      } else {
        setLoading(false)
        Alert.alert('Upload failed', result.message || "Unknown error");
      }
    } catch (error) {
      setLoading(false);
      console.error('Error uploading photo: ', error);
      Alert.alert('Upload failed', 'An error occurred while uploading. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header */}
      <LinearGradient
        colors={[Colors.primary, '#599C88']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Prescription</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.mainTitle}>Order via Prescription</Text>
        <Text style={styles.subTitle}>Upload a clear image of your prescription and we will handle the rest.</Text>

        {/* Upload Area */}
        <View style={styles.uploadContainer}>
          {!image ? (
            <TouchableOpacity style={styles.uploadBox} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
              <View style={styles.uploadIconCircle}>
                <FontAwesome name="cloud-upload" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.uploadText}>Tap to Upload</Text>
              <Text style={styles.uploadSubText}>Take a photo or choose from gallery</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="contain" />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => {
                  Alert.alert('Remove', 'Do you want to remove this image?', [
                    { text: 'Cancel' },
                    { text: 'Remove', onPress: () => setImage(null), style: 'destructive' }
                  ])
                }}
              >
                <AntDesign name='close' size={16} color='#fff' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.replaceBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.replaceText}>Replace</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Guidelines */}
        {!image && (
          <View style={styles.guideContainer}>
            <Text style={styles.guideTitle}>Valid Prescription Guide</Text>
            <View style={styles.guideRow}>
              <MaterialIcons name="check-circle" size={20} color="green" />
              <Text style={styles.guideText}>Clearly visible doctor details & signature</Text>
            </View>
            <View style={styles.guideRow}>
              <MaterialIcons name="check-circle" size={20} color="green" />
              <Text style={styles.guideText}>Patient name & date must be visible</Text>
            </View>
            <View style={styles.guideRow}>
              <MaterialIcons name="check-circle" size={20} color="green" />
              <Text style={styles.guideText}>Don't crop out any part of the image</Text>
            </View>
          </View>
        )}

        {image && (
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionHeader}>Select Processing Mode</Text>
            {orderTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionCard,
                  selecttype.id === item.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectType(item)}
                activeOpacity={0.9}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.radioCircle, selecttype.id === item.id && styles.radioCircleSelected]}>
                      {selecttype.id === item.id && <View style={styles.radioDot} />}
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[styles.optionTitle, selecttype.id === item.id && { color: Colors.primary }]}>
                        {item.name}
                      </Text>
                      <Text style={styles.optionDesc}>{item.desc}</Text>
                    </View>
                  </View>
                  <View style={[styles.badgeContainer, { backgroundColor: item.id === 1 ? '#E3FDF5' : '#E8EAF6' }]}>
                    <Text style={[styles.badgeText, { color: item.id === 1 ? 'green' : '#3F51B5' }]}>{item.badge}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.7 }]}
              onPress={loading ? undefined : upload}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.submitBtnText}>Uploading...</Text>
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Submit Prescription</Text>
                  <Feather name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Upload Prescription</Text>

            <TouchableOpacity style={styles.modalOption} onPress={pickCamera}>
              <View style={[styles.modalIconBox, { backgroundColor: '#E3F2FD' }]}>
                <FontAwesome name="camera" size={24} color="#2196F3" />
              </View>
              <View style={styles.modalTextBox}>
                <Text style={styles.modalOptionTitle}>Take a Photo</Text>
                <Text style={styles.modalOptionSub}>Use your camera to capture</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
              <View style={[styles.modalIconBox, { backgroundColor: '#E8F5E9' }]}>
                <FontAwesome name="image" size={24} color="#4CAF50" />
              </View>
              <View style={styles.modalTextBox}>
                <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.modalOptionSub}>Select an existing photo</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    padding: 5
  },
  headerTitle: {
    fontFamily: 'novabold',
    fontSize: 20,
    color: '#fff'
  },
  scrollContent: {
    padding: 20
  },
  mainTitle: {
    fontFamily: 'novabold',
    fontSize: 22,
    color: '#333',
    marginBottom: 5
  },
  subTitle: {
    fontFamily: 'novaregular',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20
  },
  uploadContainer: {
    marginBottom: 25
  },
  uploadBox: {
    height: responsiveScreenWidth(50),
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  uploadIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  uploadText: {
    fontFamily: 'novabold',
    fontSize: 18,
    color: Colors.primary
  },
  uploadSubText: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#999',
    marginTop: 5
  },
  previewContainer: {
    height: responsiveScreenWidth(80),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0'
  },
  removeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  replaceBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  replaceText: {
    fontFamily: 'novabold',
    color: '#333'
  },
  guideContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  guideTitle: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#333',
    marginBottom: 15
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  guideText: {
    fontFamily: 'novaregular',
    fontSize: 14,
    color: '#555',
    marginLeft: 10
  },
  optionsContainer: {
    marginTop: 10
  },
  sectionHeader: {
    fontFamily: 'novabold',
    fontSize: 18,
    color: '#333',
    marginBottom: 15
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FFF4'
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioCircleSelected: {
    borderColor: Colors.primary
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary
  },
  optionTitle: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#333'
  },
  optionDesc: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#777',
    marginTop: 4
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeText: {
    fontFamily: 'novabold',
    fontSize: 10
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }
  },
  submitBtnText: {
    fontFamily: 'novabold',
    fontSize: 18,
    color: '#fff'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalDismiss: {
    flex: 1
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontFamily: 'novabold',
    fontSize: 20,
    color: '#333',
    marginBottom: 25,
    textAlign: 'center'
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10
  },
  modalIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  modalTextBox: {
    flex: 1
  },
  modalOptionTitle: {
    fontFamily: 'novabold',
    fontSize: 16,
    color: '#333'
  },
  modalOptionSub: {
    fontFamily: 'novaregular',
    fontSize: 12,
    color: '#888'
  }
});