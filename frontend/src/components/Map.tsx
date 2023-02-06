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
  otherLoc?: BasicLocation;
}

const Map = (props: MapProps) => {
  const [loc, setLoc] = React.useState<BasicLocation | undefined>(undefined);

  React.useEffect(() => {
    Location.getCurrentPositionAsync().then((data) => {
      setLoc({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      });
    });
  });

  function region(): Region | undefined {
    if (loc && props.otherLoc) {
      return {
        latitude: (loc.latitude + props.otherLoc.latitude) / 2,
        longitude: (loc.longitude + props.otherLoc.longitude) / 2,
        latitudeDelta: Math.max(loc.latitude - props.otherLoc.latitude, 0.0922),
        longitudeDelta: Math.max(
          loc.longitude - props.otherLoc.longitude,
          0.0421
        ),
      };
    } else {
      return;
    }
  }

  const locChanged = (e: UserLocationChangeEvent) => {
    const c = e.nativeEvent.coordinate;
    if (c) {
      let l: BasicLocation = {
        latitude: c.latitude,
        longitude: c.longitude,
      };
      props.updateLocation(l);
      setLoc(l);
    }
  };

  return (
    <>
      {loc && props.otherLoc && (
        <MapView
          style={styles.mapView}
          initialRegion={region()}
          showsUserLocation
          onUserLocationChange={locChanged}
          provider="google"
        >
          <Marker key={0} coordinate={props.otherLoc} title={"Your friend :)"}>
            <Image
              source={require("../../assets/stinky.png")}
              style={{ height: 20, width: 20 }}
            />
          </Marker>
        </MapView>
      )}
      {(!loc || !props.otherLoc) && (
        <ActivityIndicator style={styles.activity} />
      )}
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
