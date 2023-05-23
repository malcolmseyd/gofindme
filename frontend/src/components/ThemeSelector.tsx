import { Switch } from "@react-native-material/core";

export type Selection = "light" | "dark";

export interface ThemeSelectorProps {
  selection: Selection;
  updateSelectionCallback: (newSelection: Selection) => void;
}

const ThemeSelector = (props: ThemeSelectorProps) => {
  const toggle = () => {
    props.updateSelectionCallback(
      props.selection === "light" ? "dark" : "light"
    );
  };

  return (
    <Switch
      trackColor={{ false: "#121212", true: "#ffffff" }}
      ios_backgroundColor={"#121212"}
      thumbColor={props.selection === "light" ? "#ffffff" : "#000000"}
      onValueChange={toggle}
      value={props.selection === "dark"}
      style={{
        marginLeft: "auto",
        marginRight: 50,
      }}
    />
  );
};

export default ThemeSelector;
