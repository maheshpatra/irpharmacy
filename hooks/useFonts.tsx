import * as Font from "expo-font";

export default useFonts = async () => {
   await Font.loadAsync({
      "novabold" : require("../assets/fonts/novabold.otf"),
      "novaregular" : require("../assets/fonts/nova.otf"),
      // All other fonts here
    });
};