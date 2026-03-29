"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  resolvedTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  resolvedTheme: "light",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("workoutnow-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t);

    if (t === "dark") {
      root.style.setProperty("--background", "0 0% 3.9%");
      root.style.setProperty("--foreground", "0 0% 98%");
      root.style.setProperty("--card", "0 0% 6%");
      root.style.setProperty("--card-foreground", "0 0% 98%");
      root.style.setProperty("--popover", "0 0% 6%");
      root.style.setProperty("--popover-foreground", "0 0% 98%");
      root.style.setProperty("--primary", "217.2 91.2% 59.8%");
      root.style.setProperty("--primary-foreground", "0 0% 98%");
      root.style.setProperty("--secondary", "240 3.7% 15.9%");
      root.style.setProperty("--secondary-foreground", "0 0% 98%");
      root.style.setProperty("--muted", "240 3.7% 15.9%");
      root.style.setProperty("--muted-foreground", "240 5% 64.9%");
      root.style.setProperty("--accent", "240 3.7% 15.9%");
      root.style.setProperty("--accent-foreground", "0 0% 98%");
      root.style.setProperty("--destructive", "0 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "0 0% 98%");
      root.style.setProperty("--border", "240 3.7% 15.9%");
      root.style.setProperty("--input", "240 3.7% 15.9%");
      root.style.setProperty("--ring", "217.2 91.2% 59.8%");
    } else {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "0 0% 3.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "0 0% 3.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "0 0% 3.9%");
      root.style.setProperty("--primary", "217.2 91.2% 59.8%");
      root.style.setProperty("--primary-foreground", "0 0% 98%");
      root.style.setProperty("--secondary", "240 4.8% 95.9%");
      root.style.setProperty("--secondary-foreground", "240 5.9% 10%");
      root.style.setProperty("--muted", "240 4.8% 95.9%");
      root.style.setProperty("--muted-foreground", "240 3.8% 46.1%");
      root.style.setProperty("--accent", "240 4.8% 95.9%");
      root.style.setProperty("--accent-foreground", "240 5.9% 10%");
      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "0 0% 98%");
      root.style.setProperty("--border", "240 5.9% 90%");
      root.style.setProperty("--input", "240 5.9% 90%");
      root.style.setProperty("--ring", "217.2 91.2% 59.8%");
    }
  };

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("workoutnow-theme", next);
    applyTheme(next);
  }, [theme]);

  const resolvedTheme = mounted ? theme : "light";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
