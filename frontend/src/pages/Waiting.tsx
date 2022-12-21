import { ActivityIndicator, Button } from "@react-native-material/core";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import BasePageProps from "../common/BasePageProps";
import { PageType } from "../common/PageType";

export interface WaitingProps extends BasePageProps {}

const MESSAGE = "Waiting for match...";

export default function Waiting(props: WaitingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Button
        title="Go to Matched"
        variant="contained"
        onTouchEnd={(e) => {
          props.navigation.navigate("Matched");
        }}
      />
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
