import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import Colors from "../constants/Colors";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { _storeData } from '../local_storage';
import axios from '../helper';
import { responsiveFontSize, responsiveScreenWidth, responsiveScreenHeight } from "react-native-responsive-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { showAlert } from '../components/CustomAlert';

const Otp = () => {
  const { mobile, newuser } = useLocalSearchParams();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const statusBarHeight = insets.top;

  const verify = async (mob, p) => {
    if (!p || p.length < 4) {
      ToastAndroid.show('Please enter the 4-digit OTP', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    try {
      let bodyContent = new FormData();
      bodyContent.append("mobile", mob);
      bodyContent.append("otp", p);

      let { data } = await axios.post("auth/verify_otp.php", bodyContent, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(data);
      if (data.status === 'error') {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      } else if (data.status === 'success') {
        // Store Token
        if (data.data.access_token) await _storeData('ACCESS_TOKEN', data.data.access_token);
        if (data.data.refresh_token) await _storeData('REFRESH_TOKEN', data.data.refresh_token);

        // Check if user object exists (existing user) or if we need to signup
        if (data.data.user && data.data.user.name) {
          const KEY = 'USER_DATA';
          var udata = { username: data.data.user.name, userid: data.data.user.id, mobile: data.data.user.mobile };
          await _storeData(KEY, udata);
          setLoading(false);
          router.replace('/tabs');
        } else {
          // If no user object or name, assume new user -> Signup
          // @ts-ignore
          navigation.navigate("signup", { mobile: mob });
        }
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      }
    } catch (err) {
      ToastAndroid.show("Verification failed. Please try again.", ToastAndroid.SHORT);
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
        <View style={styles.innerContainer}>

          {/* Header / Back Button */}
          <View style={[styles.header, { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <FontAwesome name="chevron-left" color='#333' size={responsiveFontSize(2.5)} />
            </TouchableOpacity>
          </View>

          {/* Illustration/Icon */}
          <View style={styles.iconContainer}>
            <Image
              resizeMode="contain"
              source={require('../assets/images/otpicon.png')}
              style={styles.otpIcon}
            />
          </View>

          {/* Texts */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
              We have sent a 4-digit confirmation code to:
            </Text>
            <View style={styles.mobileContainer}>
              <Text style={styles.mobileText}>{mobile}</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <OtpInput
              numberOfDigits={4}
              focusColor={Colors.primary}
              focusStickBlinkingDuration={500}
              onTextChange={(text) => setOtp(text)}
              theme={{
                pinCodeTextStyle: styles.pinCodeText,
                pinCodeContainerStyle: styles.pinCodeContainer,
                focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
              }}
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => verify(mobile, otp)}
            disabled={loading}
            style={styles.buttonShadow}
          >
            <LinearGradient
              colors={[Colors.primary, '#7C9644']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.verifyButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={() => showAlert({ type: 'info', title: 'Resend Code', message: 'Resend OTP functionality coming soon!' })}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(6),
  },
  header: {
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align left
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(3),
  },
  otpIcon: {
    height: responsiveScreenWidth(35),
    width: responsiveScreenWidth(35),
  },
  textContainer: {
    marginBottom: responsiveScreenHeight(4),
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'novabold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'novaregular',
    color: '#666',
    marginBottom: 5,
  },
  mobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileText: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'novabold',
    color: '#333',
    marginRight: 10,
  },
  changeLink: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'novaregular',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    marginBottom: responsiveScreenHeight(5),
  },
  pinCodeContainer: {
    width: responsiveScreenWidth(16),
    height: responsiveScreenWidth(16),
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
  },
  focusedPinCodeContainer: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF',
  },
  pinCodeText: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'novabold',
    color: '#333',
  },
  buttonShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 12,
  },
  verifyButton: {
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontFamily: 'novaregular',
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },
  resendLink: {
    fontFamily: 'novabold',
    fontSize: responsiveFontSize(1.8),
    color: Colors.primary,
  },
});
