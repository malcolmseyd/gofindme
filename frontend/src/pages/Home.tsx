import { Button } from "@react-native-material/core";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import BasePageProps from "../common/BasePageProps";
import { PageType } from "../common/PageType";

const MESSAGE = "Welcome to GoFindMe!";

export default function Home(props: BasePageProps) {
  return (
    <View style={styles.container}>
      <Text>{MESSAGE}</Text>
      <Button
        title="Search"
        variant="contained"
        onTouchEnd={(e) => {
          props.navigation.navigate("Searching");
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
