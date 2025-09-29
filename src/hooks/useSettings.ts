import { useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openRouterKey: string;
}

const getStoredSettings = (): Partial<AppSettings> => {
  try {
    const item = window.localStorage.getItem('tansan-ai-settings');
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error('Failed to parse settings from localStorage', error);
    return {};
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Partial<AppSettings>>(getStoredSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
    setIsLoaded(true);
  }, []);

  const saveSettings = useCallback((newSettings: AppSettings) => {
    try {
      window.localStorage.setItem('tansan-ai-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings to localStorage', error);
    }
  }, []);

  const clearSettings = useCallback(() => {
    try {
      window.localStorage.removeItem('tansan-ai-settings');
      setSettings({});
    } catch (error) {
      console.error('Failed to clear settings from localStorage', error);
    }
  }, []);

  const settingsComplete = isLoaded && !!settings.supabaseUrl && !!settings.supabaseAnonKey;

  return { settings, saveSettings, clearSettings, isLoaded, settingsComplete };
};
