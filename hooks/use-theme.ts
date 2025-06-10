// Created by copilot to work with seetings drawer, replace with actual theme switch logic

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    // Load theme from localStorage on mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null;

      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }
    }
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.toggle("dark", systemTheme === "dark");

      // Set data attribute for potential CSS usage
      root.setAttribute("data-theme", systemTheme);
    } else {
      root.classList.toggle("dark", newTheme === "dark");
      root.setAttribute("data-theme", newTheme);
    }
  };

  // Update theme and save to localStorage
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Watch system preference changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  return {
    theme,
    setTheme: updateTheme,
    isDark:
      theme === "dark" ||
      (theme === "system" &&
        window?.matchMedia("(prefers-color-scheme: dark)").matches),
  };
};
