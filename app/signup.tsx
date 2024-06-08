import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image, Dimensions,
  SafeAreaView, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator
} from "react-native";
import Colors from "../constants/Colors";
import {
  Entypo, Feather, FontAwesome, Ionicons
} from "@expo/vector-icons";
import { Link, router, useNavigation, useLocalSearchParams } from "expo-router";
import { _storeData } from "../local_storage";
import { path } from "../components/server";
const Signup = () => {
  const [isChecked, setIsChecked] = useState(false);

  const ts = Dimensions.get('screen').width / 100
  const navigate = useNavigation();

  const { mobile } = useLocalSearchParams()
  const [eye, setEye] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    name: "",
  });

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };


  const signup = async () => {
    if(data.name == ''){
      Alert.alert('Signup Error','Please Enter Name.')
      return;
    }else if(data.email == ''){
      Alert.alert('Signup Error','Please Enter Email.')
      return;
    }
    else{
      setLoading(true)
    let bodyContent = new FormData();
    bodyContent.append("case", "register");
    bodyContent.append("name", data.name);
    bodyContent.append("mobile", mobile);
    bodyContent.append("email", data.email);
  
  console.log(mobile)
    try {
      const req = await fetch(path + "login.php", {
        body: bodyContent,
        method: 'post'
      })
      const res = await req.json();
      setLoading(false)
      console.log(res)
      if(res.error){
        Alert.alert('Signup Error',res.message);
        return
      }else if (res.code == "REGISTERED") {
        setLoading(true)
        var datab = new Object({ username: res.data.name, email: res.data.email, userid: res.data.id,  mobile: res.data.mobile, })
        _storeData("USER_DATA", datab)
          .then(v => {
            if (v === "saved") {
                    router.replace('/tabs')
                  }
          })
          .catch(err => console.log(err));
        // retrivedata()
      }

    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
    }
    
   
  }


  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{


          marginTop: "20%",
        }}
      >
        <Image resizeMode="stretch" source={require('../assets/images/logo.png')} style={{ height: ts * 40, width: ts * 55, alignSelf: 'center' }} />
        <Text
          style={{ alignSelf: "center", fontWeight: "normal", fontSize: 17, color: '#fff', marginTop: 15 }}
        >
          Please register your log in details below
        </Text>

        <View style={{ width: "85%", marginTop: 15 }}>
          <View style={{ marginTop: 15 }}>

            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={'#ccc'}
                placeholder="John Smith"
                style={styles.inputfild}
                value={data.name}
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      name: text,
                    };
                  })
                }
              />
              <Ionicons
                style={styles.inputIcon}
                name="person"
                size={17}
                color={'#555'}
              />
            </View>
          </View>

          <View style={{ marginTop: 15 }}>

            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={'#ccc'}
                placeholder="jonh@exmaple.com"
                style={styles.inputfild}
                value={data.email}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setData((prev) => {
                    return {
                      ...prev,
                      email: text,
                    };
                  })
                }
              />
              <Entypo
                style={styles.inputIcon}
                name="email"
                size={17}
                color={'  #555'}
              />
            </View>
          </View>

          

       

          <TouchableOpacity
            onPress={() => {
           
                signup() 
            }}
            style={{
              height: 50,
              width: "100%",
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: 30,
              borderRadius: 6,
            }}

          >
            {/* <Link href={"/home"} > */}
            {loading ? 
              <ActivityIndicator color={Colors.backgroundcolor} size={'small'} />
             : 
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: Colors.backgroundcolor }}
              >
                Continue
              </Text>

            }
          </TouchableOpacity>


        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    rowGap: 16,
    padding: 16,
  },
  social: {
    borderRadius: 20,
    size: 30,
    padding: 5,
    margin: 8,
    alignSelf: "center",
  },
  inputContainer: {
    backgroundColor: Colors.sec,
    borderRadius: 8,
    borderWidth: 1.5,
    height: 50,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20
  },
  inputIcon: {
    marginRight: 20,
  },
  inputfild: {
    paddingLeft: 16,
    height: 50,
    borderColor: "#ccc",
    width: "80%",
    color: '#333',

  },
  inputfildLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
