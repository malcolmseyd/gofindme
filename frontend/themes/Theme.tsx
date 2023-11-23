export default interface Theme {
  keyboardAppearance: "default" | "light" | "dark";
  statusBar: "default" | "light-content" | "dark-content";

  isDarkTheme: boolean;

  stringValue: string;

  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  foregroundColorVibrant: string;
  foregroundTextColorVibrant: string;
  foregroundColorMuted: string;
  foregroundTextColorMuted: string;
  buttonTextColor: string;

  // text input
  textInputContainerColor: string;
  textInputBackgroundColor: string;
  textInputBorderColor: string;
  textInputTextColor: string;
  textInputPlaceholderColor: string;

  // displayed text
  textContainerColor: string;
  textBackgroundColor: string;
  textBorderColor: string;
  textColor: string;

  waterColor: string;
  mapStyle: any;
}
