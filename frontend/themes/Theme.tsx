export default interface Theme {
  keyboardAppearance: "default" | "light" | "dark";
  statusBar: "default" | "light-content" | "dark-content";

  background: string;
  background1: string;
  background2: string;
  background3: string;

  // main screen
  chatBarBackground: string;
  chatBoxBorder: string;
  textInputColor: string;
  textInputColorPlaceholder: string;

  waterColor: string;
  mapStyle: any;
}
