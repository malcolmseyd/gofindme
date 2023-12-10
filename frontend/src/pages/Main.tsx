import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import useWebSocket from "react-use-websocket";
import { ThemeContext } from "../utils/Contexts";
import BasePageProps from "../common/BasePageProps";
import { BasicLocation } from "../common/BasicLocation";
import Map from "../components/Map";
import style from "../styles/GlobalStyles";
import SmallTextButton from "../components/SmallTextButton";
import { getConnectionDetails, getMapType } from "../utils/SettingsProvider";

const SOCKET_SERVER = process.env.EXPO_PUBLIC_SOCKET_SERVER ?? "";

interface BaseMessage {
  type: string;
}

interface PairedMessage extends BaseMessage {
  name: string;
}

interface ChatMessage extends BaseMessage {
  msg: string;
  sent: string;
}

interface LocationMessage extends BaseMessage {
  lat: number;
  long: number;
}

interface Chat {
  type: "message" | "spacer";
  sender: string;
  message: string;
}

type Message = LocationMessage | ChatMessage | PairedMessage | any;

export default function Main(props: BasePageProps) {
  const theme = useContext(ThemeContext);
  const styles = style({ theme });

  const name = props.route.params.name;

  const [loc, setLoc] = useState<BasicLocation | undefined>(
    props.route.params.loc
  );

  const [otherName, setOtherName] = useState<string>("");
  const [otherLoc, setOtherLocation] = useState<BasicLocation | undefined>(
    undefined
  );
  const [chatMessages, setChatMessages] = useState<Array<Chat>>([
    {
      type: "spacer",
      message: "",
      sender: "",
    },
  ]);
  const [chatbox, setChatbox] = useState<string>("");

  const [mapRef, setMapRef] = useState<MapView | undefined>();

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(props.route.params.socketServer, {
    onOpen: () => console.log("opened"),
    shouldReconnect: (closeEvent) => true,
    onMessage: (e) => {
      // message received
      let data: Message = JSON.parse(e.data);
      console.log(data);
      if (data.type == "paired") {
        setOtherName(data.name);
      } else if (data.type === "location_update") {
        if (loc && !otherLoc) {
          let region: Region = {
            latitude: (loc.latitude + data.lat) / 2,
            longitude: (loc.longitude + data.long) / 2,
            latitudeDelta: Math.max(loc.latitude - data.lat, 0.0922),
            longitudeDelta: Math.max(loc.longitude - data.long, 0.0421),
          };
          mapRef?.animateToRegion(region, 0);
        }
        setOtherLocation({
          latitude: data.lat,
          longitude: data.long,
        });
      } else if (data.type === "chat") {
        setChatMessages([
          ...chatMessages,
          {
            type: "message",
            sender: otherName,
            message: data.msg,
          },
        ]);
      } else if (data.type === "unpaired") {
        setOtherName("");
        setOtherLocation(undefined);
        setChatMessages([
          {
            type: "spacer",
            message: "",
            sender: "",
          },
        ]);
      }
      // setChat(location?.coords.latitude + " " + otherLocation);
      sendMessage(
        JSON.stringify({
          type: "keep_alive",
        })
      );
    },
    onError: (e) => {
      console.log(`problem connecting to websocket ${e}`);
    },
  });

  const updateLoc = (loc: BasicLocation) => {
    console.log("sending location update " + loc);
    sendMessage(
      JSON.stringify({
        type: "location_update",
        lat: loc.latitude,
        long: loc.longitude,
      })
    );

    setLoc(loc);
  };

  const sendChatMessage = () => {
    console.log("sending message: " + chatbox);
    sendMessage(
      JSON.stringify({
        type: "chat",
        msg: chatbox,
      })
    );
    setChatMessages([
      ...chatMessages,
      {
        type: "message",
        sender: name,
        message: chatbox,
      },
    ]);
    setChatbox("");
  };

  const renderChatItem = (e: any) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {e.item.type === "spacer" ? (
        <View
          style={{ height: 10, backgroundColor: theme.backgroundPrimary }}
        ></View>
      ) : (
        <View
          style={{
            ...styles.chatMessageContainerBase,
            alignSelf: e.item.sender === name ? "flex-end" : "flex-start",
            backgroundColor:
              e.item.sender === name ? theme.foregroundColorVibrant : "#858585",
          }}
        >
          <Text style={styles.chatMessageText}>
            {e.item.sender}: {e.item.message}
          </Text>
        </View>
      )}
    </TouchableWithoutFeedback>
  );

  const updateMapRef = (mapView: MapView | null) => {
    if (mapView) {
      setMapRef(mapView);
    }
  };

  return (
    <View style={styles.safeAreaView}>
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.backgroundPrimary}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.mainPageMapContainer}>
            <Map
              updateLocation={updateLoc}
              loc={loc}
              otherLoc={otherLoc}
              otherName={otherName}
              setMapRef={updateMapRef}
              mapStyle={theme.mapStyle}
            />
          </View>
        </TouchableWithoutFeedback>
        {otherName ? (
          <View style={styles.mainPageChatContainer}>
            <Text style={{ ...styles.message }}>
              You're connected to {otherName}
            </Text>
            <FlatList
              style={styles.mainPageMessageHistory}
              data={chatMessages}
              renderItem={renderChatItem}
              inverted
              contentContainerStyle={{
                flexDirection: "column-reverse",
              }}
            />
            <View style={styles.mainPageFooter}>
              <TextInput
                placeholder="Enter a message..."
                placeholderTextColor={theme.textInputPlaceholderColor}
                style={styles.fullWidthInputBox}
                onChangeText={(value) => {
                  setChatbox(value);
                }}
                onSubmitEditing={sendChatMessage}
                value={chatbox}
                blurOnSubmit={false}
                keyboardAppearance={theme.keyboardAppearance}
                multiline
              />
              <SmallTextButton
                onPress={sendChatMessage}
                disabled={chatbox === ""}
              >
                Send
              </SmallTextButton>
            </View>
          </View>
        ) : (
          <View style={styles.mainPageSpinnerContainer}>
            <ActivityIndicator />
            <Text style={styles.message}>
              You're in the queue. You'll be paired with someone shortly!
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
