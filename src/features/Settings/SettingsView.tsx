import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon } from '@/components/ui/icons';
import type { AppConfig } from '@/types/electron';

export function SettingsView() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configPath, setConfigPath] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfig();
    loadConfigPath();
  }, []);

  async function loadConfig() {
    try {
      const cfg = await window.electron.config.get();
      setConfig(cfg);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  }

  async function loadConfigPath() {
    try {
      const path = await window.electron.config.getPath();
      setConfigPath(path);
    } catch (error) {
      console.error('Failed to load config path:', error);
    }
  }

  async function cycleTheme() {
    if (!config) return;

    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(config.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setIsSaving(true);
    try {
      const updated = await window.electron.config.update({
        theme: nextTheme,
      });
      setConfig(updated);
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setIsSaving(false);
    }
  }

  if (!config) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">Loading settings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <CardTitle>Application Settings</CardTitle>
          </div>
          <CardDescription>Customize your timer app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <Button variant="outline" size="sm" onClick={cycleTheme} disabled={isSaving}>
                <Badge variant="secondary" className="capitalize">
                  {config.theme}
                </Badge>
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Global Shortcut</p>
              <p className="text-xs text-muted-foreground">Toggle timer with keyboard shortcut</p>
              <code className="block text-xs bg-muted px-2 py-1 rounded">
                {config.globalShortcut}
              </code>
              <p className="text-xs text-muted-foreground italic">
                To change the shortcut, edit the config file and restart the app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuration File</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            Advanced settings can be edited directly in the config file:
          </p>
          <code className="block text-xs bg-muted px-2 py-1 rounded break-all">{configPath}</code>
        </CardContent>
      </Card>
    </div>
  );
}
