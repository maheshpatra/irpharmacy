import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import useFonts from "../hooks/useFonts";
import { useEffect, useState } from "react";
import AppLoading from 'expo-app-loading';

export default function Layout() {

  const [IsReady, SetIsReady] = useState(false);

  const LoadFonts = async () => {
    await useFonts();
  };
  useEffect(()=>{
    LoadFonts()
  },[])
  // console.log("sdfsdf");
  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => SetIsReady(true)}
        onError={() => {}}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={'light-content'} />
      <SafeAreaProvider>
      
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
