import { Pressable } from "react-native";

export interface ButtonProps {
  children: any;
  onPress(): void;
  buttonStyling: any;
}

const Button = (props: ButtonProps) => {
  return (
    <Pressable style={props.buttonStyling} onPress={props.onPress}>
      {props.children}
    </Pressable>
  );
};

export default Button;
