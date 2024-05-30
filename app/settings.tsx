import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import Header from "../components/Header";
import HeaderAB from "../components/HeaderAB";

const settings = () => {
  const router = useRouter();
  const settings = [
    { id: 1, title: 'Account', icon: 'person-outline', click: "/accountsettings" },
    { id: 2, title: 'Notifications', icon: 'notifications-outline', click: "notificationsettings" },
    { id: 9, title: 'Sign Out', icon: 'log-out-outline' },
    // Add more settings as needed
  ];

  const renderSettings = () => {
    return settings.map((setting) => (
      <TouchableOpacity onPress={() => {
        if (setting.title === 'Sign Out') {

          Alert.alert(
            'Log out',
            'Are you sure you want to logout!',
            [
              {
              text: 'Cancel',
              onPress: () => console.log('cancel'),
             },
             {
              text: 'OK',
              onPress: () => {},
            },
            ],
            { cancelable: true }
          );


        } else {
          router.push(setting.click)
        }

      }
      }


        key={setting.id} style={styles.settingItem}>
        <Ionicons name={setting.icon} size={25} color="#333" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#aaa" />
      </TouchableOpacity>
    ));
  };
  return (
    <View style={{flex:1}}>
        <HeaderAB title={'Settings'} />
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      <View style={styles.profileContainer}>

        <Image
          source={{ uri: 'https://picsum.photos/300/200/?random' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.useremali}>johndoe@gmail.com</Text>
      </View>
      <View style={styles.container}>{renderSettings()}</View>
    </ScrollView>
    </View>

  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  }, profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    marginTop:20
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  useremali: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  search: {
    position: 'absolute', right: '18%'
    // Pushes the notification icon to the right
  },
  favicon: {
    position: 'absolute', right: '5%'
    // Pushes the notification icon to the right
  },
  header: {
    height: 59, alignItems: 'center', width: '100%', flexDirection: 'row', paddingHorizontal: 20,

  },
});
