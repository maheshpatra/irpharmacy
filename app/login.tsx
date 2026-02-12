import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useNavigation } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { responsiveFontSize, responsiveScreenWidth, responsiveScreenHeight } from "react-native-responsive-dimensions";
import axios from '../helper';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  const validateNumber = (val) => {
    const numberRegex = /^\d+(\.\d+)?$/; // Matches integers and decimals
    return numberRegex.test(val);
  };

  const sendotp = async (val) => {
    if (!val || val.length < 10) {
      ToastAndroid.show("Please enter a valid 10-digit mobile number", ToastAndroid.SHORT);
      return;
    }
    if (!validateNumber(val)) {
      ToastAndroid.show("Please enter a valid mobile number", ToastAndroid.SHORT);
      return;
    }
    console.log(val);
    setLoading(true);

    try {
      let bodyContent = new FormData();
      bodyContent.append("mobile", val);

      let { data } = await axios.post("auth/request_otp.php", bodyContent, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(data);
      if (data?.status == 'success') {
        ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
        // We don't know if user is new or old yet, so we assume verify_otp will handle it or return the info.
        // For now, pass newuser as false or let verify handle the routing.
        // @ts-ignore
        navigation.navigate('otp', { mobile: val, newuser: 'false' });
      } else {
        ToastAndroid.show(data?.message || "Failed to send OTP", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      ToastAndroid.show("Something went wrong. Please try again.", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle={'dark-content'} backgroundColor="#fff" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>IR Pharmacy</Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../assets/images/loginpage-icon.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to manage and order your medicines seamlessly.
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View
              style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused
              ]}
            >
              <View style={styles.prefixContainer}>
                <Image
                  source={{ uri: 'https://flagcdn.com/w40/in.png' }} // Simple flag icon (optional, or use local asset)
                  style={styles.flagIcon}
                />
                <Text style={styles.prefixText}>+91</Text>
                <View style={styles.separator} />
              </View>
              <TextInput
                value={mobile}
                keyboardType="number-pad"
                onChangeText={(txt) => setMobile(txt)}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#A0A0A0"
                style={styles.textInput}
                maxLength={10}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {mobile.length === 10 && (
                <Entypo name="check" size={20} color={Colors.primary} style={styles.checkIcon} />
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => sendotp(mobile)}
              disabled={loading}
              style={styles.buttonShadow}
            >
              <LinearGradient
                colors={[Colors.primary, '#7C9644']} // Slightly darker shade for gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Get Verification Code</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer / Terms */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              By signing in, you agree to our
            </Text>
            <View style={styles.termsLinks}>
              <TouchableOpacity>
                <Text style={styles.linkText}>Terms & Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}> and </Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveScreenWidth(6),
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveScreenHeight(2),
  },
  logo: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'novabold',
    color: Colors.primary,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(3),
  },
  illustration: {
    height: responsiveScreenWidth(50),
    width: responsiveScreenWidth(70),
  },
  welcomeContainer: {
    marginBottom: responsiveScreenHeight(4),
  },
  welcomeTitle: {
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'novabold',
    color: '#000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'novaregular',
    color: '#666',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: responsiveScreenHeight(4),
  },
  inputLabel: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'novabold',
    color: '#333',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 56,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#F9FFF9', // very light green hint
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flagIcon: {
    width: 24,
    height: 16,
    borderRadius: 2,
    marginRight: 6,
  },
  prefixText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'novabold',
    color: '#333',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    fontFamily: 'novaregular',
    color: '#333',
    height: '100%',
  },
  checkIcon: {
    marginLeft: 10,
  },
  buttonShadow: {
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
  footerContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(1.6),
    color: '#888',
  },
  termsLinks: {
    flexDirection: 'row',
    marginTop: 4,
  },
  linkText: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(1.6),
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
