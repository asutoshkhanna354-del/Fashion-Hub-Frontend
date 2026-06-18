"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { settingsApi } from "../api";

interface Settings {
  store_name?: string;
  store_logo_url?: string;
  weaver_name?: string;
  weaver_about?: string;
  store_location_text?: string;
  store_location_address?: string;
  [key: string]: string | undefined;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await settingsApi.getPublic();
      if (data.status) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      if (settings.store_name) {
        document.title = "Solanki Vastra Bhandar";
      }
      if (settings.store_logo_url) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = settings.store_logo_url.startsWith("http") ? settings.store_logo_url : `https://Solanki-Vastra-backend.onrender.com${settings.store_logo_url}`;
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

