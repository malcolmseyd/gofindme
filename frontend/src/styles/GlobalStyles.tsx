import { StyleSheet } from "react-native";
import Theme from "../../themes/Theme";

interface StyleProps {
  theme: Theme;
}

const style = (props: StyleProps) => {
  return StyleSheet.create({
    safeAreaView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: props.theme.backgroundPrimary,
    },
    keyboardAvoidingView: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      gap: 10,
    },
    shortInputBox: {
      color: props.theme.textInputTextColor,
      borderColor: props.theme.textInputBorderColor,
      backgroundColor: props.theme.textInputBackgroundColor,
      borderWidth: 1,
      borderRadius: 50,
      textAlign: "center",
      width: "70%",
      height: 30,
      paddingHorizontal: 10,
    },
    fullWidthInputBox: {
      color: props.theme.textInputTextColor,
      borderColor: props.theme.textInputBorderColor,
      backgroundColor: props.theme.textInputBackgroundColor,
      borderWidth: 1,
      borderRadius: 20,
      textAlign: "left",
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexGrow: 1,
      flex: 1,
    },
    message: {
      color: props.theme.textColor,
      maxWidth: "80%",
    },
    title: {
      color: props.theme.textColor,
      fontSize: 48,
    },
    largeButtonBackground: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: props.theme.foregroundColorVibrant,
      borderRadius: 20,
      width: 200,
      height: 50,
    },
    largeButtonText: {
      color: props.theme.buttonTextColor,
      fontSize: 30,
    },
    smallButtonBackground: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      width: "auto",
      paddingHorizontal: 10,
      height: 30,
    },
    smallButtonText: {
      fontSize: 16,
    },
    mainPageMapContainer: {
      width: "100%",
      height: "50%",
      flexGrow: 1,
      backgroundColor: props.theme.waterColor,
    },
    mainPageChatContainer: {
      height: "50%",
      width: "100%",
      alignItems: "center",
      flexDirection: "column",
    },
    mainPageSpinnerContainer: {
      height: "50%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    mainPageMessageHistory: {
      width: "100%",
      flexGrow: 2,
    },
    mainPageFooter: {
      backgroundColor: props.theme.textInputContainerColor,
      width: "100%",
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginVertical: 5,
      gap: 5,
    },
    chatMessageContainerBase: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      marginHorizontal: 5,
      marginBottom: 2,
    },
    chatMessageText: {
      color: "white",
    },
  });
};

export default style;
