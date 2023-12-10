import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import Footer from "./src/components/Footer";
import ThemeSelector from "./src/components/ThemeSelector";
import Home from "./src/pages/Home";
import Main from "./src/pages/Main";
import Settings from "./src/pages/Settings";
import style from "./src/styles/GlobalStyles";
import { ThemeContext } from "./src/utils/Contexts";
import dark from "./themes/Dark";
import light from "./themes/Light";
import Theme from "./themes/Theme";
import { getConnectionDetails } from "./src/utils/SettingsProvider";

interface State {
  err: string | undefined;
}

export default function App() {
  // console.log(`queue server: ${process.env.EXPO_PUBLIC_QUEUE_SERVER}`);
  // console.log(`socket server: ${process.env.EXPO_PUBLIC_SOCKET_SERVER}`);
  // console.log(process.env);

  const [state, setState] = useState<State>({ err: undefined });
  const [themeSelection, setThemeSelection] = useState<Theme>(light);

  const styles = style({ theme: themeSelection });

  const updateThemeSelection = (newThemeSelection: Theme) => {
    AsyncStorage.setItem("@theme", newThemeSelection.stringValue);
    setThemeSelection(newThemeSelection);
  };

  const connectionInfo = getConnectionDetails();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setState({
          err: "Could not get location permissions :(",
        });
      }

      const themeString = await AsyncStorage.getItem("@theme");
      if (themeString) {
        setThemeSelection(themeString === "light" ? light : dark);
      }
    })();
  }, []);

  const Stack = createNativeStackNavigator();

  function globalHeaderOptions(): NativeStackNavigationOptions {
    return {
      headerStyle: {
        backgroundColor: themeSelection.backgroundSecondary,
      },
      headerTitle: (props: any) => <Text style={styles.message}>GoFindMe</Text>,
      headerRight: () => (
        <ThemeSelector
          selection={themeSelection.stringValue}
          updateSelectionCallback={updateThemeSelection}
        />
      ),
    };
  }

  return (
    <ThemeContext.Provider value={themeSelection}>
      <StatusBar style="auto" />
      {state.err && (
        <Text>
          You must give the app permissions to use your location before you can
          use it
        </Text>
      )}
      {!state.err && (
        <NavigationContainer
          theme={{
            dark: themeSelection.isDarkTheme,
            colors: {
              primary: themeSelection.foregroundColorVibrant,
              background: themeSelection.backgroundPrimary,
              card: "green",
              text: themeSelection.textColor,
              border: "green",
              notification: "green",
            },
          }}
        >
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
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={globalHeaderOptions()}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <Footer />
    </ThemeContext.Provider>
  );
}
