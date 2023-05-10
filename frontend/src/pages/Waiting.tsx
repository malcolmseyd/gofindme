import { ActivityIndicator, Button } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import BasePageProps from "../common/BasePageProps";
import { PageType } from "../common/PageType";

export interface WaitingProps extends BasePageProps {}

const MESSAGE = "Waiting for match...";

export default function Waiting(props: WaitingProps) {
  console.log(props);
  const cookie = props.route.params.cookie;
  const [msg, setMsg] = useState(cookie);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text>{msg}</Text>
    </View>
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
