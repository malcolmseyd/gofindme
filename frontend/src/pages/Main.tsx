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
} from "react-native";
import Map from "../components/Map";
import { BasicLocation } from "../common/BasicLocation";
import useWebSocket from "react-use-websocket";
import BasePageProps from "../common/BasePageProps";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";

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
    <Text>
      <Text
        style={e.item.sender === name ? { color: "blue" } : { color: "red" }}
      >
        {e.item.sender}
      </Text>
      : {e.item.message}
    </Text>
  );

  const updateMapRef = (mapView: MapView | null) => {
    if (mapView) {
      setMapRef(mapView);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Box style={styles.mapContainer}>
          <Map
            updateLocation={updateLoc}
            loc={loc}
            otherLoc={otherLoc}
            otherName={otherName}
            setMapRef={updateMapRef}
          />
        </Box>
      </View>
      {otherName ? (
        <>
          <FlatList
            style={styles.messageHistory}
            data={chatMessages}
            renderItem={renderChatItem}
            inverted
            contentContainerStyle={{
              flexDirection: "column-reverse",
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              alignItems: "center",
            }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <Stack direction="row" style={styles.chatSendContainer}>
              <TextInput
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
                    maxHeight: "100%",
                    aspectRatio: 1,
                    paddingRight: 0,
                    backgroundColor: "purple",
                    borderRadius: 50,
                  }}
                  icon={(props) => <Icon name="arrow-up" {...props} />}
                  onPress={sendChatMessage}
                ></IconButton>
              )}
            </Stack>
          </KeyboardAvoidingView>
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  contentContainer: {
    width: "100%",
    flexGrow: 1,
  },
  mapContainer: {
    height: "50%",
    backgroundColor: "#9bbff4",
    justifyContent: "space-around",
  },
  mapView: {
    width: "100%",
    height: "100%",
  },
  activity: {},
  messageHistory: {
    marginHorizontal: 5,
  },
  chatSendContainer: {
    alignItems: "center",
    height: 48,
    backgroundColor: "lightgrey",
    borderRadius: 50,
    paddingLeft: 10,
    marginTop: 5,
    marginHorizontal: 10,
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
});
