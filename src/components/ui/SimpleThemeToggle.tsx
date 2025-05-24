"use client";
import React from "react";
import { useTheme } from "next-themes";

const SimpleThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
};

export default SimpleThemeToggle; 