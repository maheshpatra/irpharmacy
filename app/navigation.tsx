// import { View, Text } from "react-native";
// import React from "react";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import UpComingQuiz from "./upcomingquiz";
// import UnlockQuest from "./unlockquest";

// const Tab = createMaterialTopTabNavigator();

// const Navigation = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="upcomingquiz"
//       screenOptions={{
//         tabBarActiveTintColor: "#e91e63",
//         tabBarLabelStyle: { fontSize: 12 },
//         tabBarStyle: { backgroundColor: "powderblue" },
//       }}
//     >
//       <Tab.Screen
//         name="upcomingquiz"
//         component={UpComingQuiz}
//         options={{ tabBarLabel: "Home" }}
//       />
//       <Tab.Screen
//         name="unlockquest"
//         component={UnlockQuest}
//         options={{ tabBarLabel: "unlockquest" }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default Navigation;

import * as React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpComingQuiz from './upcomingquiz';
import UnlockQuest from './unlockquest';


export default function MyTabs() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="upcomingquiz"
      // screenOptions={{
      //   tabBarActiveTintColor: '#e91e63',
      //   tabBarLabelStyle: { fontSize: 12 },
      //   tabBarStyle: { backgroundColor: 'powderblue' },
      // }}
    >
      <Tab.Screen
        name='upcomingquiz' component={UpComingQuiz}
        // options={{ tabBarLabel: 'upcomingquiz' }}
      />
      <Tab.Screen
        name='unlockquest' component={UnlockQuest}
        // options={{ tabBarLabel: 'unlockquest' }}
      />
     
    </Tab.Navigator>
  );
}
