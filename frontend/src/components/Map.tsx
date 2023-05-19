import React, { memo } from "react";
import MapView, {
  Marker,
  Region,
  UserLocationChangeEvent,
} from "react-native-maps";
import { StyleSheet, Image, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { BasicLocation } from "../common/BasicLocation";

export interface MapProps {
  updateLocation: (loc: BasicLocation) => void;
  loc?: BasicLocation;
  otherLoc?: BasicLocation;
  otherName: string;
  setMapRef: (mapRef: MapView | null) => void;
}

const Map = (props: MapProps) => {
  const [loc, setLoc] = React.useState<BasicLocation | undefined>(undefined);

  function region(): Region | undefined {
    if (props.loc) {
      return {
        latitude: props.loc.latitude,
        longitude: props.loc.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    return;
  }

  const locChanged = (e: UserLocationChangeEvent) => {
    const c = e.nativeEvent.coordinate;
    if (c) {
      let l: BasicLocation = {
        latitude: c.latitude,
        longitude: c.longitude,
      };
      props.updateLocation(l);
    }
  };

  return (
    <>
      {props.loc && (
        <MapView
          ref={(ref) => {
            props.setMapRef(ref);
          }}
          style={styles.mapView}
          initialRegion={region()}
          showsUserLocation
          onUserLocationChange={locChanged}
          provider="google"
        >
          {props.otherLoc && (
            <Marker key={0} coordinate={props.otherLoc} title={props.otherName}>
              <Image
                source={require("../../assets/stinky.png")}
                style={{ height: 20, width: 20 }}
              />
            </Marker>
          )}
        </MapView>
      )}
      {!props.loc && <ActivityIndicator style={styles.activity} />}
    </>
  );
};

export default memo(Map);

const styles = StyleSheet.create({
  mapView: {
    width: "100%",
    height: "100%",
  },
  activity: {},
});
