import { useEffect, useState } from "react";
import { DARK_THEME, LIGHT_THEME } from "../constants/theme";
import { loadTheme, saveTheme } from "../services/themeStorage";

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    saveTheme(newTheme);
    setTheme(newTheme);
  }

  return { isDark: theme === DARK_THEME, toggleTheme };
}
