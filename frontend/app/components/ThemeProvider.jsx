"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const themeStorageKey = "insoniaTheme";
const defaultTheme = "dark";

function getStoredTheme() {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  try {
    return localStorage.getItem(themeStorageKey) || defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";

    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch {
      // The visual theme still works even if storage is blocked.
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isLight: theme === "light",
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return theme;
}
