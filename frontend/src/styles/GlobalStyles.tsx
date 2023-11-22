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
    },
    alignItemsCenter: {
      alignItems: "center",
    },
    shortInputBox: {
      color: props.theme.textInputTextColor,
      borderColor: props.theme.textInputBorderColor,
      backgroundColor: props.theme.textInputBackgroundColor,
      borderWidth: 1,
      borderRadius: 50,
      textAlign: "center",
      margin: 10,
      width: 200,
      height: 30,
    },
    text: {
      color: props.theme.textColor,
    },
    message: {
      color: props.theme.textColor,
    },
    title: {
      color: props.theme.textColor,
      fontSize: 48,
    },
    buttonStyling: {
      color: props.theme.textColor,
      backgroundColor: props.theme.buttonBackgroundColor,
      width: 50,
      height: 30,
    },
    defaultButtonBackground: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: props.theme.buttonBackgroundColor,
      borderRadius: 20,
      width: 200,
      height: 50,
    },
    defaultButtonText: {
      color: props.theme.buttonTextColor,
      fontSize: 30,
    },
  });
};

export default style;
