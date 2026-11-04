import { DARK_THEME, LIGHT_THEME } from "../constants/theme";

const THEME_KEY = "car-rental-theme";
const DARK_SYSTEM_QUERY = "(prefers-color-scheme: dark)";

export function loadTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia(DARK_SYSTEM_QUERY).matches ? DARK_THEME : LIGHT_THEME;
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
