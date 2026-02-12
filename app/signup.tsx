import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import Colors from "../constants/Colors";
import { Ionicons, Entypo, FontAwesome } from "@expo/vector-icons";
import { Link, router, useNavigation, useLocalSearchParams } from "expo-router";
import { _storeData } from "../local_storage";
import axios from '../helper';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { LinearGradient } from 'expo-linear-gradient';

const Signup = () => {
  const ts = Dimensions.get('screen').width / 100
  const navigate = useNavigation();
  const { mobile } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    name: "",
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const signup = async () => {
    if (!data.name.trim()) {
      Alert.alert('Signup Error', 'Please Enter Name.');
      return;
    } else if (!data.email.trim()) {
      Alert.alert('Signup Error', 'Please Enter Email.');
      return;
    }

    setLoading(true);
    let bodyContent = new FormData();
    bodyContent.append("case", "register");
    bodyContent.append("name", data.name);
    // @ts-ignore
    bodyContent.append("mobile", mobile);
    bodyContent.append("email", data.email);

    try {
      // NOTE: Using login.php or dedicated register endpoint? 
      // Based on previous code, likely auth/login.php handled register case. 
      // If v2 structure implies separate, please verify. Keeping auth/login.php as per user history or register.php?
      // Reverting to auth/login.php as per original file, assuming it handles 'case=register'.
      // However, v2 usually separates these. Let's try auth/register.php if standard, but sticking to previous logic:
      // Previous code used: axios.post("auth/login.php", ... case='register')

      const { data: res } = await axios.post("auth/login.php", bodyContent, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log(res);

      if (res.error) {
        setLoading(false);
        Alert.alert('Signup Error', res.message);
      } else if (res.code == "REGISTERED" || res.status === 'success') {
        // Handle successful registration
        const userPayload = res.data || res.user; // Adapt based on actual response
        var datab = {
          username: userPayload.name || data.name,
          email: userPayload.email || data.email,
          userid: userPayload.id,
          mobile: userPayload.mobile || mobile
        };

        await _storeData("USER_DATA", datab);
        if (res.access_token) await _storeData('ACCESS_TOKEN', res.access_token);
        if (res.refresh_token) await _storeData('REFRESH_TOKEN', res.refresh_token);

        setLoading(false);
        router.replace('/tabs');
      } else {
        setLoading(false);
        Alert.alert('Signup Error', res.message || 'Unknown error');
      }

    } catch (err) {
      setLoading(false);
      console.log(JSON.stringify(err, null, 2));
      Alert.alert('Error', 'Something went wrong during registration.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <LinearGradient
        colors={[Colors.primary, '#7C9644']}
        style={styles.headerBackground}
      >
        <Image
          resizeMode="contain"
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Complete your profile to continue</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, focusedInput === 'name' && styles.inputFocused]}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Ex. John Doe"
                placeholderTextColor="#999"
                style={styles.textInput}
                value={data.name}
                onChangeText={(text) => setData({ ...data, name: text })}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputFocused]}>
              <Entypo name="mail" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Ex. john@example.com"
                placeholderTextColor="#999"
                style={styles.textInput}
                value={data.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setData({ ...data, email: text })}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={[styles.inputWrapper, { backgroundColor: '#f0f0f0', borderColor: '#e0e0e0' }]}>
              <Ionicons name="call-outline" size={20} color="#999" style={styles.icon} />
              <TextInput
                // @ts-ignore
                value={mobile}
                editable={false}
                style={[styles.textInput, { color: '#888' }]}
              />
              <Ionicons name="lock-closed" size={16} color="#999" />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={signup}
            disabled={loading}
            style={styles.buttonShadow}
          >
            <LinearGradient
              colors={[Colors.primary, '#7C9644']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: responsiveScreenHeight(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: StatusBar.currentHeight,
  },
  logo: {
    height: 60,
    width: 60,
    marginBottom: 10,
    tintColor: '#fff'
  },
  headerTitle: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(3),
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(1.8),
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    flex: 1,
    marginTop: -30,
    backgroundColor: '#fff',
    marginHorizontal: responsiveScreenWidth(5),
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
    backgroundColor: '#fafafa',
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(2),
    color: '#333',
    height: '100%',
  },
  buttonShadow: {
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 12,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(2.2),
    color: '#fff',
  },
});
