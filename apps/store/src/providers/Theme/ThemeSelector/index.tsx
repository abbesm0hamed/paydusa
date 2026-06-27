"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ecommerce/ui/components/select";
import React, { useState } from "react";

import { useTheme } from "..";
import type { Theme } from "./types";
import { themeLocalStorageKey } from "./types";

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();
  const [value, setValue] = useState("");

  const onThemeChange = (themeToSet: Theme | "auto") => {
    if (themeToSet === "auto") {
      setTheme(null);
      setValue("auto");
    } else {
      setTheme(themeToSet);
      setValue(themeToSet);
    }
  };

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey);
    setValue(preference ?? "auto");
  }, []);

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-full bg-transparent gap-2 p-0 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} side="bottom" sideOffset={4}>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  );
};
