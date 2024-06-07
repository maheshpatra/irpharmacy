import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';

export default function TabLayout() {
  
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#000' ,
      headerShown:false,
      tabBarStyle:{
        height:65,
        paddingBottom:8,
        paddingTop:8
      },
      tabBarLabelStyle:{
        fontSize:responsiveScreenFontSize(1.6),
        fontFamily:'novaregular'
      }
    
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign size={28} name="home" color={color} />,
        }}
        
      />
       <Tabs.Screen
        name="prescription"
        options={{
          title: 'Prescriptions',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="file-prescription" color={color} />,
        }}
        
      />
       <Tabs.Screen
        name="orders"
        options={{
          title: 'Your Order',
          tabBarIcon: ({ color }) => <Entypo size={28} name="lab-flask" color={color} />,
        }}
        
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
