import { Appearance } from "react-native";

export function useColorScheme(): "light" | "dark" {
  const scheme = Appearance.getColorScheme();
  return scheme === "dark" ? "dark" : "light";
}
