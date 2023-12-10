import { useContext } from "react";
import Button, { ButtonProps } from "./Button";
import { Text } from "react-native";
import style from "../styles/GlobalStyles";
import { ThemeContext } from "../utils/Contexts";

interface TextButtonStyles {
  largeButtonBackground: any;
  largeButtonText: any;
}

type LargeButtonProps = Pick<ButtonProps, "children" | "onPress"> & {
  disabled?: boolean;
};

const LargeTextButton = (props: LargeButtonProps) => {
  const theme = useContext(ThemeContext);
  const styles = style({ theme });
  return (
    <Button
      onPress={props.onPress}
      buttonStyling={styles.largeButtonBackground}
    >
      <Text style={styles.largeButtonText}>{props.children}</Text>
    </Button>
  );
};

export default LargeTextButton;
