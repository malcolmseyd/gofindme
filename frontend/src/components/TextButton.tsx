import { Pressable, StyleSheet } from "react-native";
import Button, { ButtonProps } from "./Button";
import { Text } from "react-native";
import Theme from "../../themes/Theme";

interface TextButtonStyles {
  defaultButtonBackground: any;
  defaultButtonText: any;
}

type TextButtonProps = Pick<ButtonProps, "children" | "onPress"> & {
  styles: TextButtonStyles;
};

const TextButton = (props: TextButtonProps) => {
  return (
    <Button
      onPress={props.onPress}
      buttonStyling={props.styles.defaultButtonBackground}
    >
      <Text style={props.styles.defaultButtonText}>{props.children}</Text>
    </Button>
  );
};

export default TextButton;
