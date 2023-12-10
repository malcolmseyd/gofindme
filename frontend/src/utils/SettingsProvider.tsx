import AsyncStorage from "@react-native-async-storage/async-storage";
import { MapType } from "react-native-maps";

export interface ConnectionInfo {
  queueServer: string;
  socketServer: string;
}

export const getConnectionDetails = async (): Promise<ConnectionInfo> => {
  const queueServer = await AsyncStorage.getItem("@queue-server");
  const socketServer = await AsyncStorage.getItem("@socket-server");

  if (queueServer && socketServer) {
    return {
      queueServer,
      socketServer,
    };
  }

  return {
    queueServer: process.env.EXPO_PUBLIC_QUEUE_SERVER ?? "",
    socketServer: process.env.EXPO_PUBLIC_SOCKET_SERVER ?? "",
  };
};

export const setConnectionInfo = async (
  props: ConnectionInfo
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem("@queue-server", props.queueServer);
    await AsyncStorage.setItem("@socket-server", props.socketServer);
  } catch (e) {
    return false;
  }
  return true;
};

export const resetConnectionInfo = async () => {
  setConnectionInfo({
    queueServer: process.env.EXPO_PUBLIC_QUEUE_SERVER ?? "",
    socketServer: process.env.EXPO_PUBLIC_SOCKET_SERVER ?? "",
  });
};

export const getMapType = async (): Promise<MapType> => {
  return ((await AsyncStorage.getItem("@map-type")) as MapType) ?? "standard";
};

export const setMapType = async (newType: MapType): Promise<boolean> => {
  try {
    await AsyncStorage.setItem("@map-type", newType);
  } catch (e) {
    return false;
  }
  return true;
};
