import { useContext } from "react";
import Button, { ButtonProps } from "./Button";
import { Text } from "react-native";
import { ThemeContext } from "../Contexts";
import style from "../styles/GlobalStyles";

type SmallTextButtonProps = Pick<ButtonProps, "children" | "onPress"> & {
  disabled?: boolean;
};

const SmallTextButton = (props: SmallTextButtonProps) => {
  const theme = useContext(ThemeContext);
  const styles = style({ theme });
  return (
    <Button
      onPress={props.onPress}
      buttonStyling={styles.smallButtonBackground}
    >
      <Text style={styles.smallButtonText}>{props.children}</Text>
    </Button>
  );
};

export default SmallTextButton;
