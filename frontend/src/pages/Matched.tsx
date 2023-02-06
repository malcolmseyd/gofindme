import { Box, Icon, IconButton, Stack } from "@react-native-material/core";
import React from "react";
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

const MOCK_DEV_SERVER = "wss://xo2pf2wtkpukb6iwn3t3cz6t4m.srv.us/mock/socket";
const LAPTOP_DEV_SERVER =
  "https://ujdjcdriw6p46igejapojk5bqa.srv.us/mock/socket";

interface BaseUpdate {
  type: string;
}

interface LocationUpdate extends BaseUpdate {
  lat: number;
  long: number;
}

interface ChatUpdate extends BaseUpdate {
  msg: string;
  timestamp: string;
}

interface ChatMessage {
  sender: string;
  message: string;
}

type Message = LocationUpdate | ChatUpdate | any;

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
  } = useWebSocket(MOCK_DEV_SERVER, {
    onOpen: () => console.log("opened"),
    shouldReconnect: (closeEvent) => true,
    onMessage: (e) => {
      // message received
      let data: Message = JSON.parse(e.data);
      console.log(data);
      if (data.type === "location_update") {
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
            sender: "Friend",
            message: data.msg,
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
        sender: "You",
        message: chatbox,
      },
    ]);
    setChatbox("");
    console.log("chatbox: " + chatbox);
  };

  const renderChatItem = (e: any) => (
    <Text>
      <Text
        style={e.item.sender === "You" ? { color: "blue" } : { color: "red" }}
      >
        {e.item.sender}
      </Text>
      : {e.item.message}
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
    borderWidth: 10,
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
