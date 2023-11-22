import { Pressable } from "react-native";

export interface ButtonProps {
  children: any;
  onPress(): void;
  buttonStyling: any;
  disabed?: boolean;
}

const Button = (props: ButtonProps) => {
  return (
    <Pressable
      style={props.buttonStyling}
      onPress={props.onPress}
      disabled={props.disabed}
    >
      {props.children}
    </Pressable>
  );
};

export default Button;
