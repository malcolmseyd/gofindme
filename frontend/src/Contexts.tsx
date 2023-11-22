import { createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import light from "../themes/Light";

export const ThemeContext = createContext(light);
