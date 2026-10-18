"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
      title={isLight ? "Tema escuro" : "Tema claro"}
    >
      {isLight ? (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 14.1A7.4 7.4 0 0 1 9.9 3.8 8.2 8.2 0 1 0 20.2 14.1Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7"></path>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7"></circle>
          <path d="M12 2.8v2M12 19.2v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.8 12h2M19.2 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7"></path>
        </svg>
      )}
    </button>
  );
}
