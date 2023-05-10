import { IconComponentProvider } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import * as Location from "expo-location";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/pages/Home";
import Main from "./src/pages/Main";
import Footer from "./src/components/Footer";

interface State {
  err: string | undefined;
}

export default function App() {
  const [state, setState] = useState<State>({ err: undefined });

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

  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <StatusBar style="auto" />
      {state.err && (
        <Text>
          You must give the app permissions to use your location before you can
          use it
        </Text>
      )}
      {!state.err && (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ title: "GoFindMe" }}
            />
            <Stack.Screen
              name="Main"
              component={Main}
              options={{ title: "GoFindMe" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <Footer />
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
