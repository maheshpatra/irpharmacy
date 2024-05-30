import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import HeaderAB from '../components/HeaderAB';

const NotificationSettings = () => {
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [allowEmailNotifications, setAllowEmailNotifications] = useState(false);
  const [allowPushNotifications, setAllowPushNotifications] = useState(false);

  const handleNotificationToggle = () => {
    setAllowNotifications((prevValue) => !prevValue);
    // You can implement logic here to handle enabling/disabling all notifications
  };

  const handleEmailNotificationToggle = () => {
    setAllowEmailNotifications((prevValue) => !prevValue);
    // Implement logic to handle email notifications
  };

  const handlePushNotificationToggle = () => {
    setAllowPushNotifications((prevValue) => !prevValue);
    // Implement logic to handle push notifications
  };

  return (
    <View style={styles.container}>
      <HeaderAB
      title={'Notification Settings'}
      />
      <View style={styles.notificationItem}>
        <Text style={styles.notificationText}>Allow Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: Colors.primary }}
          thumbColor={allowNotifications ? Colors.primary : '#f4f3f4'}
          onValueChange={handleNotificationToggle}
          value={allowNotifications}
        />
      </View>
      <View style={styles.notificationItem}>
        <Text style={styles.notificationText}>Email Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: Colors.primary }}
          thumbColor={allowEmailNotifications ? Colors.primary : '#f4f3f4'}
          onValueChange={handleEmailNotificationToggle}
          value={allowEmailNotifications}
         
        />
      </View>
      <View style={styles.notificationItem}>
        <Text style={styles.notificationText}>Push Notifications</Text>
        <Switch
         trackColor={{ false: '#767577', true: Colors.primary }}
         thumbColor={allowPushNotifications ? Colors.primary : '#f4f3f4'}
          value={allowPushNotifications}
          onValueChange={handlePushNotificationToggle}
        />
        {/* <Switch
          trackColor={{ false: '#767577', true: Colors.primary }}
          thumbColor={allowPushNotifications ? Colors.primary : '#f4f3f4'}
          onValueChange={handlePushNotificationToggle}
          value={allowPushNotifications}
          disabled={!allowNotifications}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fdfdfd'
   
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical:15
  },
  notificationText: {
    fontSize: 18,
  },
});

export default NotificationSettings;
