import {
  ActivityIndicator,
  Button,
  Stack,
  TextInput,
} from "@react-native-material/core";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import BasePageProps from "../common/BasePageProps";
import * as Location from "expo-location";
import { BasicLocation } from "../common/BasicLocation";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MESSAGE = "";

export default function Home(props: BasePageProps) {
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

    console.log(loc);

    let res = await fetch(
      "https://xo2pf2wtkpukb6iwn3t3cz6t4m.srv.us/mock/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      }
    );

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
    <SafeAreaView style={styles.container}>
      {spinner ? (
        <ActivityIndicator />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text>{msg}</Text>
            <Stack direction="row">
              <TextInput
                placeholder="Enter your name"
                onChangeText={(value) => {
                  setName(value);
                }}
                onSubmitEditing={getCookie}
                value={name}
                blurOnSubmit={false}
                style={styles.nameInput}
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
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  nameInput: {
    width: "80%",
  },
  logo: {
    maxWidth: "50%",
    maxHeight: "50%",
    aspectRatio: 1,
  },
});
