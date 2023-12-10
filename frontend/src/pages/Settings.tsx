import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import style from "../styles/GlobalStyles";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../utils/Contexts";
import {
  ConnectionInfo,
  getConnectionDetails,
  getMapType,
  resetConnectionInfo,
  setConnectionInfo,
  setMapType,
} from "../utils/SettingsProvider";
import SmallTextButton from "../components/SmallTextButton";
import { Dropdown } from "react-native-element-dropdown";
import MapView, { MapType, Region } from "react-native-maps";
import BasePageProps from "../common/BasePageProps";
import Toast from "react-native-toast-message";

const mapTypes = [
  { label: "Standard", type: "standard" },
  { label: "Satellite", type: "hybrid" },
  { label: "Terrain", type: "terrain" },
];

export default function Settings(props: BasePageProps) {
  const theme = useContext(ThemeContext);
  const styles = style({ theme });
  const [oldConnInfo, setOldConnInfo] = useState<ConnectionInfo>({
    queueServer: "",
    socketServer: "",
  });
  const [newConnInfo, setNewConnInfo] = useState<ConnectionInfo>({
    queueServer: "",
    socketServer: "",
  });
  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(false);

  const [mapSelection, setMapSelection] = useState({
    label: "Standard",
    type: "standard",
  });
  const [mapRegion, setMapRegion] = useState<Region>();

  const region = (): Region | undefined => {
    const location = props.route.params.location;
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  useEffect(() => {
    (async () => {
      // console.log("start of useEffect");
      let connectionInfo = await getConnectionDetails();
      setOldConnInfo(connectionInfo);
      // console.log("done setting connection info");
      let currentSelection = await getMapType();
      mapTypes
        .filter((t) => t.type === currentSelection)
        .forEach((s) => setMapSelection(s));

      // console.log("done setting selection");

      // console.log("done useEffect");
    })();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <Text style={styles.title}>Settings</Text>
          <TextInput
            placeholder={oldConnInfo.queueServer}
            onChangeText={(v) =>
              setNewConnInfo({ ...newConnInfo, queueServer: v })
            }
            value={newConnInfo.queueServer}
            style={styles.shortInputBox}
            placeholderTextColor={theme.textInputPlaceholderColor}
            keyboardAppearance={theme.keyboardAppearance}
          />
          <TextInput
            placeholder={oldConnInfo.socketServer}
            onChangeText={(v) =>
              setNewConnInfo({ ...newConnInfo, socketServer: v })
            }
            value={newConnInfo.socketServer}
            style={styles.shortInputBox}
            placeholderTextColor={theme.textInputPlaceholderColor}
            keyboardAppearance={theme.keyboardAppearance}
          />
          <Dropdown
            style={{
              margin: 16,
              height: 50,
              borderBottomColor: "gray",
              borderBottomWidth: 0.5,
              width: "50%",
            }}
            data={mapTypes}
            labelField="label"
            valueField="type"
            value={mapSelection}
            onChange={(value) => {
              setMapSelection(value);
            }}
            maxHeight={300}
          />
          <MapView
            style={{ width: "50%", height: "25%" }}
            showsUserLocation
            provider="google"
            customMapStyle={theme.mapStyle}
            initialRegion={region()}
            mapType={mapSelection.type as MapType}
            region={mapRegion}
            onRegionChange={(r) => setMapRegion(r)}
          />
          <SmallTextButton
            disabled={saveButtonDisabled}
            onPress={async () => {
              setSaveButtonDisabled(true);
              let nci: ConnectionInfo = {
                queueServer: oldConnInfo.queueServer,
                socketServer: oldConnInfo.socketServer,
              };
              if (newConnInfo.queueServer.length > 0) {
                nci.queueServer = newConnInfo.queueServer;
              }
              if (newConnInfo.socketServer.length > 0) {
                nci.socketServer = newConnInfo.socketServer;
              }

              let res = await setConnectionInfo(nci);
              console.log(`update connection info result: ${res}`);
              setOldConnInfo(await getConnectionDetails());

              setMapType(mapSelection.type as MapType);
              setSaveButtonDisabled(false);
              Toast.show({
                type: "success",
                text1: "Saved",
                position: "bottom",
              });
            }}
          >
            Save
          </SmallTextButton>
        </KeyboardAvoidingView>
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
