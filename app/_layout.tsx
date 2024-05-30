import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";

export default function Layout() {
  // console.log("sdfsdf");

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
