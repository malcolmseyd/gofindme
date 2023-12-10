import * as Location from "expo-location";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../utils/Contexts";
import BasePageProps from "../common/BasePageProps";
import { BasicLocation } from "../common/BasicLocation";
import style from "../styles/GlobalStyles";
import LargeTextButton from "../components/LargeTextButton";
import SmallTextButton from "../components/SmallTextButton";
import { getConnectionDetails } from "../utils/SettingsProvider";

export default function Home(props: BasePageProps) {
  const theme = useContext(ThemeContext);
  const styles = style({ theme });

  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [spinner, setSpinner] = useState(false);

  const getLocation = async () => {
    return Location.getLastKnownPositionAsync().then((data) => {
      if (data) {
        return {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        };
      } else {
        setMsg("Could not get location");
      }
    });
  };

  const getCookie = async () => {
    setSpinner(true);
    let loc: BasicLocation | undefined = await getLocation();
    if (loc) {
      console.log("location found, sending POST request");
      let connectionInfo = await getConnectionDetails();
      console.log(`queue server: ${connectionInfo.queueServer}`);
      console.log(`socket server: ${connectionInfo.socketServer}`);
      try {
        let res = await fetch(connectionInfo.queueServer, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        });

        console.log("got response");
        // console.log(res);
        if (res.status == 200) {
          let cookie = await res.headers.get("set-cookie");
          props.navigation.navigate("Main", {
            cookie,
            name,
            loc,
            socketServer: connectionInfo.socketServer,
          });
        } else {
          console.log("non-200 status code");
          setMsg(await res.text());
        }
        console.log(res.status);
      } catch (e) {
        setMsg("Could not find queue server");
      }

      setSpinner(false);
    } else {
      console.log("could not get location");
    }
  };

  const goSettings = async () => {
    const location = await Location.getLastKnownPositionAsync();
    console.log("got location");
    console.log(location);
    props.navigation.navigate("Settings", { location });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaView}>
        <StatusBar
          barStyle={theme.statusBar}
          backgroundColor={theme.backgroundPrimary}
        />
        {spinner ? (
          <ActivityIndicator color={theme.textColor} />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <Text style={styles.title}>GoFindMe</Text>
            <Text style={styles.message}>{msg}</Text>
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
              style={styles.shortInputBox}
              placeholderTextColor={theme.textInputPlaceholderColor}
              keyboardAppearance={theme.keyboardAppearance}
            />
            <LargeTextButton
              onPress={() => {
                getCookie();
              }}
            >
              Search
            </LargeTextButton>
            <SmallTextButton onPress={goSettings} type="secondary">
              Settings
            </SmallTextButton>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
