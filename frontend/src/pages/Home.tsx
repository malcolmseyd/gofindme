import { ActivityIndicator, Button, Stack } from "@react-native-material/core";
import * as Location from "expo-location";
import React, { useContext, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dark from "../../themes/Dark";
import light from "../../themes/Light";
import { ThemeContext } from "../Contexts";
import BasePageProps from "../common/BasePageProps";
import { BasicLocation } from "../common/BasicLocation";

const QUEUE_SERVER = process.env.EXPO_PUBLIC_QUEUE_SERVER;

const MESSAGE = "";

export default function Home(props: BasePageProps) {
  const theme = useContext(ThemeContext) === "light" ? light : dark;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background1,
      alignItems: "center",
      justifyContent: "center",
    },
    nameInput: {
      width: "50%",
      borderColor: theme.chatBoxBorder,
      borderWidth: 1,
      borderRadius: 50,
      textAlign: "center",
      height: 30,
      margin: 10,
      color: theme.textInputColor,
    },
    logo: {
      maxWidth: "50%",
      maxHeight: "50%",
      aspectRatio: 1,
    },
    message: {
      color: theme.textInputColor,
    },
  });

  const [msg, setMsg] = useState(MESSAGE);
  const [name, setName] = useState("");
  const [spinner, setSpinner] = useState(false);

  const getCookie = async () => {
    setSpinner(true);
    let loc: BasicLocation = await Location.getCurrentPositionAsync().then(
      (data) => {
        return {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        };
      }
    );
    console.log(`queue server: ${QUEUE_SERVER}`);

    let res = await fetch(QUEUE_SERVER ?? "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    // console.log(res);
    if (res.status == 200) {
      let cookie = await res.headers.get("set-cookie");
      props.navigation.navigate("Main", {
        cookie,
        name,
        loc,
      });
    } else {
      setMsg(await res.text());
    }

    setSpinner(false);
    console.log(res.status);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.statusBar}
          backgroundColor={theme.background}
        />
        {spinner ? (
          <ActivityIndicator />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              alignItems: "center",
            }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <Image
              style={styles.logo}
              source={require("../../assets/stinky.png")}
            />
            <Text style={styles.message}>{msg}</Text>
            <Stack direction="row">
              <TextInput
                placeholder="Enter your name"
                onChangeText={(value) => {
                  if (value.length < 20) {
                    setName(value);
                  }
                }}
                onSubmitEditing={getCookie}
                value={name}
                blurOnSubmit={false}
                style={styles.nameInput}
                placeholderTextColor={theme.textInputColorPlaceholder}
                keyboardAppearance={theme.keyboardAppearance}
              />
            </Stack>
            <Button
              title="Search"
              variant="contained"
              onTouchEnd={(e) => {
                getCookie();
              }}
            />
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
