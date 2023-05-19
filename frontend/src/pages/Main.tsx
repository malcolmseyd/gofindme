import {
  ActivityIndicator,
  Box,
  Icon,
  IconButton,
  Stack,
} from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Map from "../components/Map";
import { BasicLocation } from "../common/BasicLocation";
import useWebSocket from "react-use-websocket";
import BasePageProps from "../common/BasePageProps";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_SOCKET_SERVER =
  "wss://xo2pf2wtkpukb6iwn3t3cz6t4m.srv.us/mock/socket";

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
  sender: string;
  message: string;
}

type Message = LocationMessage | ChatMessage | PairedMessage | any;

export default function Main(props: BasePageProps) {
  const cookie = props.route.params.cookie;
  const name = props.route.params.name;

  const [loc, setLoc] = useState<BasicLocation | undefined>(
    props.route.params.loc
  );

  const [otherName, setOtherName] = useState<string>("");
  const [otherLoc, setOtherLocation] = useState<BasicLocation | undefined>(
    undefined
  );
  const [chatMessages, setChatMessages] = useState<Array<Chat>>([]);
  const [chatbox, setChatbox] = useState<string>("");

  const [mapRef, setMapRef] = useState<MapView | undefined>();

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(MOCK_SOCKET_SERVER, {
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
        // chatMessages.push({
        //   sender: "system",
        //   message: data.lat + ", " + data.long,
        // });
        // setChatMessages(chatMessages);
      } else if (data.type === "chat") {
        setChatMessages([
          ...chatMessages,
          {
            sender: otherName,
            message: data.msg,
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
        sender: name,
        message: chatbox,
      },
    ]);
    setChatbox("");
    console.log("chatbox: " + chatbox);
  };

  const renderChatItem = (e: any) => (
    <View
      style={{
        alignSelf: e.item.sender === name ? "flex-end" : "flex-start",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 50,
        backgroundColor: e.item.sender === name ? "blue" : "darkgrey",
        marginHorizontal: 5,
        marginBottom: 2,
      }}
    >
      <Text style={{ color: "white" }}>
        {e.item.sender}: {e.item.message}
      </Text>
    </View>
  );

  const updateMapRef = (mapView: MapView | null) => {
    if (mapView) {
      setMapRef(mapView);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={styles.flexOne}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.mapContainer}>
            <Map
              updateLocation={updateLoc}
              loc={loc}
              otherLoc={otherLoc}
              otherName={otherName}
              setMapRef={updateMapRef}
            />
          </View>
          {otherName ? (
            <View style={styles.chat}>
              <FlatList
                style={styles.messageHistory}
                data={chatMessages}
                renderItem={renderChatItem}
                inverted
                contentContainerStyle={{
                  flexDirection: "column-reverse",
                }}
              />
              <View style={styles.footer}>
                <Stack direction="row" style={styles.chatSendContainer}>
                  <TextInput
                    placeholder="Enter a message..."
                    style={styles.textInput}
                    onChangeText={(value) => {
                      setChatbox(value);
                    }}
                    onSubmitEditing={sendChatMessage}
                    value={chatbox}
                    blurOnSubmit={false}
                  />
                  {chatbox !== "" && (
                    <IconButton
                      style={{
                        width: 32,
                        aspectRatio: 1,
                        paddingRight: 0,
                        backgroundColor: "grey",
                        borderRadius: 50,
                      }}
                      icon={(props) => <Icon name="arrow-up" {...props} />}
                      onPress={sendChatMessage}
                    ></IconButton>
                  )}
                </Stack>
              </View>
            </View>
          ) : (
            <ActivityIndicator style={{ height: "50%" }} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  inner: {
    height: "100%",
    flex: 1,
  },
  mapContainer: {
    width: "100%",
    height: "50%",
    flexGrow: 1,
    backgroundColor: "#9bbff4",
  },
  chat: {
    height: "50%",
    alignItems: "center",
  },
  messageHistory: {
    marginHorizontal: 5,
    width: "100%",
    flexGrow: 2,
  },
  footer: {
    backgroundColor: "darkgrey",
  },
  chatSendContainer: {
    margin: 2,
    alignItems: "center",
    height: 32,
    backgroundColor: "lightgrey",
    width: "100%",
    borderRadius: 50,
    paddingLeft: 10,
    borderColor: "grey",
    borderWidth: 1,
  },
  textInput: {
    flexGrow: 1,
  },
  textSend: {
    backgroundColor: "aquamarine",
  },
  textSendIcon: {
    color: "white",
  },
  chatItem: {
    padding: 2,
    marginHorizontal: 5,
    marginVertical: 2,
  },
});
