import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconComponentProvider } from "@react-native-material/core";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import Config from "react-native-config";
import { ThemeContext } from "./src/Contexts";
import Footer from "./src/components/Footer";
import ThemeSelector, { Selection } from "./src/components/ThemeSelector";
import Home from "./src/pages/Home";
import Main from "./src/pages/Main";
import dark from "./themes/Dark";
import light from "./themes/Light";

interface State {
  err: string | undefined;
}

export default function App() {
  const getStoredTheme = (): Selection => {
    AsyncStorage.getItem("@theme").then(
      (value) => {
        return value === "dark" ? "dark" : "light";
      },
      (error) => {
        return "light";
      }
    );

    return "light";
  };

  console.log(`queue server: ${process.env.EXPO_PUBLIC_QUEUE_SERVER}`);
  console.log(`socket server: ${process.env.EXPO_PUBLIC_SOCKET_SERVER}`);
  console.log(process.env);

  const [state, setState] = useState<State>({ err: undefined });
  const [themeSelection, setThemeSelection] = useState<Selection>(
    getStoredTheme()
  );

  const updateThemeSelection = (newThemeSelection: Selection) => {
    AsyncStorage.setItem("@theme", newThemeSelection.toString()).then(
      (value) => {},
      (error) => {}
    );

    setThemeSelection(newThemeSelection);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setState({
          err: "Could not get location permissions :(",
        });
        return;
      }
    })();
  }, []);

  const Stack = createNativeStackNavigator();

  function globalHeaderOptions() {
    return {
      headerStyle: {
        backgroundColor:
          themeSelection === "light" ? light.background : dark.background,
      },
      headerTitle: (props: any) => (
        <Image
          style={{ width: 50, height: 50 }}
          source={require("./assets/stinky.png")}
        />
      ),
      headerRight: () => (
        <ThemeSelector
          selection={themeSelection}
          updateSelectionCallback={(newSelection: Selection) => {
            updateThemeSelection(newSelection);
          }}
        />
      ),
    };
  }

  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <ThemeContext.Provider value={themeSelection}>
        <StatusBar style="auto" />
        {state.err && (
          <Text>
            You must give the app permissions to use your location before you
            can use it
          </Text>
        )}
        {!state.err && (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={globalHeaderOptions()}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={globalHeaderOptions()}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
        <Footer />
      </ThemeContext.Provider>
    </IconComponentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
