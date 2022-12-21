import { Box, Button, Stack, TextInput } from "@react-native-material/core";
import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Map from "../components/Map";
import { BasicLocation } from "../common/BasicLocation";
import useWebSocket from "react-use-websocket";

const MOCK_DEV_SERVER = "wss://xo2pf2wtkpukb6iwn3t3cz6t4m.srv.us/mock/socket";
const LAPTOP_DEV_SERVER = "https://ujdjcdriw6p46igejapojk5bqa.srv.us/";

interface LocationUpdate {
  type: string;
  lat: number;
  long: number;
}

interface ChatMessage {
  sender: string;
  message: string;
}

type Message = LocationUpdate | any;

const locationUpdate = true;

export default function Matched() {
  const [otherLoc, setOtherLocation] = React.useState<
    BasicLocation | undefined
  >(undefined);
  const [chatMessages, setChatMessages] = React.useState<Array<ChatMessage>>(
    []
  );
  const [chatbox, setChatbox] = React.useState<string>("");

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket("wss://ujdjcdriw6p46igejapojk5bqa.srv.us/mock/socket", {
    onOpen: () => console.log("opened"),
    shouldReconnect: (closeEvent) => true,
    onMessage: (e) => {
      // message received
      let data: Message = JSON.parse(e.data);
      if (data.type === "location_update") {
        setOtherLocation({
          latitude: data.lat,
          longitude: data.long,
        });
        setChatMessages([
          ...chatMessages,
          {
            sender: "system",
            message: data.lat + ", " + data.long,
          },
        ]);
      } else {
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
    sendMessage(
      JSON.stringify({
        type: "location_update",
        lat: loc.latitude,
        long: loc.longitude,
      })
    );
  };

  const renderChatItem = (e: any) => (
    <Text style={styles.message}>
      {e.item.sender}: {e.item.message}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Box style={styles.mapContainer}>
          <Map updateLocation={updateLoc} otherLoc={otherLoc} />
        </Box>
        <FlatList
          style={styles.messageHistory}
          data={chatMessages}
          renderItem={renderChatItem}
          inverted
          contentContainerStyle={{
            flexDirection: "column-reverse",
          }}
        />
      </View>
      <Stack direction="row" style={styles.chatSendContainer}>
        <TextInput
          style={styles.textInput}
          label="Send a message"
          variant="outlined"
          onChangeText={(value) => {
            setChatbox(value);
          }}
          onSubmitEditing={(e) => {
            // same as submit button pressed
          }}
        >
          {chatbox}
        </TextInput>
        <Button
          style={styles.textSend}
          title="Send"
          variant="contained"
          onTouchEnd={(e) => {}}
        ></Button>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borerWidth: 10,
    borderColor: "green",
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
    height: "40%",
  },
  message: {},
  chatSendContainer: {
    alignItems: "center",
  },
  textInput: {
    flexGrow: 1,
  },
  textSend: {},
});
