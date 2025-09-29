import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings, AppSettings } from '../hooks/useSettings';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings: storedSettings, saveSettings, isLoaded } = useSettings();
  const [formState, setFormState] = useState<AppSettings>({
    supabaseUrl: '',
    supabaseAnonKey: '',
    openRouterKey: '',
  });

  useEffect(() => {
    if (isLoaded) {
      setFormState({
        supabaseUrl: storedSettings.supabaseUrl || '',
        supabaseAnonKey: storedSettings.supabaseAnonKey || '',
        openRouterKey: storedSettings.openRouterKey || '',
      });
    }
  }, [isLoaded, storedSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(formState);
    alert('Settings saved successfully!');
  };

  const isSupabaseConnected = !!formState.supabaseUrl && !!formState.supabaseAnonKey;
  const isOpenRouterConfigured = !!formState.openRouterKey;

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <Link to="/builder" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={16} />
          Back to Builder
        </Link>

        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Supabase Settings */}
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Supabase Connection</h2>
              {isSupabaseConnected ? (
                <span className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle size={16} /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-yellow-400">
                  <XCircle size={16} /> Not Connected
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Supabase URL</label>
                <Input
                  type="text"
                  name="supabaseUrl"
                  value={formState.supabaseUrl}
                  onChange={handleChange}
                  placeholder="https://<your-project-ref>.supabase.co"
                  className="bg-gray-900 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Supabase Anon Key</label>
                <Input
                  type="password"
                  name="supabaseAnonKey"
                  value={formState.supabaseAnonKey}
                  onChange={handleChange}
                  placeholder="Enter your Supabase anon (public) key"
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* OpenRouter Settings */}
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">OpenRouter AI</h2>
               {isOpenRouterConfigured ? (
                <span className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle size={16} /> Configured
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-yellow-400">
                  <XCircle size={16} /> Not Configured
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">OpenRouter API Key</label>
                <Input
                  type="password"
                  name="openRouterKey"
                  value={formState.openRouterKey}
                  onChange={handleChange}
                  placeholder="Enter your OpenRouter API key"
                  className="bg-gray-900 border-gray-600"
                />
              </div>
              <p className="text-xs text-gray-400">
                This key must be set as an environment variable named <code className="bg-gray-900 px-1 py-0.5 rounded">OPENROUTER_API_KEY</code> in your Supabase Edge Function secrets. 
                <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1 ml-1">
                  Get your key here <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
