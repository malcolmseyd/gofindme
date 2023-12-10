import { useContext } from "react";
import Button, { ButtonProps } from "./Button";
import { Text } from "react-native";
import { ThemeContext } from "../utils/Contexts";
import style from "../styles/GlobalStyles";

type SmallTextButtonProps = Pick<ButtonProps, "children" | "onPress"> & {
  disabled?: boolean;
  type?: "primary" | "secondary";
};

const SmallTextButton = (props: SmallTextButtonProps) => {
  const theme = useContext(ThemeContext);
  const styles = style({ theme });
  return (
    <Button
      onPress={props.onPress}
      buttonStyling={{
        ...styles.smallButtonBackground,
        backgroundColor: props.disabled || props.type === "secondary"
          ? theme.foregroundColorMuted
          : theme.foregroundColorVibrant,
      }}
      disabed={props.disabled}
    >
      <Text
        style={{
          ...styles.smallButtonText,
          color: props.disabled
            ? theme.foregroundTextColorMuted
            : theme.foregroundTextColorVibrant,
        }}
      >
        {props.children}
      </Text>
    </Button>
  );
};

export default SmallTextButton;
