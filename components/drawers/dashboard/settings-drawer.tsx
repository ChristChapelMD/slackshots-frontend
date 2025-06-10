"use client";
// This is just a concept for the setting drawer generate using Copilot
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@heroui/user";
import { Switch } from "@heroui/switch";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import {
  Moon,
  Sun,
  Bell,
  SignOut,
  Monitor,
  PaintBrush,
  Image,
  Sparkle,
  Lightning,
} from "@phosphor-icons/react";

import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";

interface SettingsDrawerProps {
  onClose?: () => void;
}

type Theme = "system" | "light" | "dark";

export function SettingsDrawer({ onClose }: SettingsDrawerProps) {
  // App state from UI store
  const gridDensity = useUIStore((state) => state.gridDensity);
  const setGridDensity = useUIStore((state) => state.setGridDensity);

  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  // Local state for settings
  const [settings, setSettings] = useState({
    theme: "system" as Theme,
    autoPlay: true,
    emailNotifications: true,
    slackNotifications: true,
    showPreviews: true,
    imageQuality: 80,
    performanceMode: false,
  });

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings");

      try {
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);

          setSettings((prev) => ({ ...prev, ...parsedSettings }));
        }
      } catch {
        // Silent fail if settings can't be parsed
      }

      // Load theme preference
      const savedTheme = localStorage.getItem("theme") as Theme | null;

      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setSettings((prev) => ({ ...prev, theme: savedTheme as Theme }));
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userSettings", JSON.stringify(settings));
    }
  }, [settings]);

  // Update individual setting
  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    updateSetting("theme", newTheme);

    // Apply theme to document
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);

      if (newTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";

        document.documentElement.classList.toggle(
          "dark",
          systemTheme === "dark",
        );
      } else {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {
      // Handle logout error silently
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header with User Profile */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <User
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                size: "lg",
                className:
                  "border-2 border-primary-300 dark:border-primary-600",
              }}
              classNames={{
                name: "text-lg font-medium",
                description: "text-sm text-zinc-500 dark:text-zinc-400",
              }}
              description="Product Designer"
              name="Jane Doe"
            />
          </div>
          <Button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            onPress={handleLogout}
          >
            <SignOut size={18} weight="bold" />
            Logout
          </Button>
        </div>

        <Divider className="my-6" />

        {/* Appearance Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <PaintBrush className="text-primary-500" size={20} />
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>

          <div className="space-y-4 pl-1">
            {/* Theme Selection */}
            <div className="space-y-3">
              <div
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                id="theme-group"
              >
                Theme
              </div>
              <div
                aria-labelledby="theme-group"
                className="flex gap-3"
                role="radiogroup"
              >
                <Button
                  isIconOnly
                  aria-checked={settings.theme === "light"}
                  className={`flex flex-1 flex-col items-center p-3 rounded-lg border ${
                    settings.theme === "light"
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                  role="radio"
                  onPress={() => handleThemeChange("light")}
                >
                  <Sun
                    className="mb-2 text-amber-500"
                    size={24}
                    weight="bold"
                  />
                  <span className="text-sm font-medium">Light</span>
                </Button>
                <Button
                  isIconOnly
                  aria-checked={settings.theme === "dark"}
                  className={`flex flex-1 flex-col items-center p-3 rounded-lg border ${
                    settings.theme === "dark"
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                  role="radio"
                  onPress={() => handleThemeChange("dark")}
                >
                  <Moon
                    className="mb-2 text-indigo-500"
                    size={24}
                    weight="bold"
                  />
                  <span className="text-sm font-medium">Dark</span>
                </Button>
                <Button
                  isIconOnly
                  aria-checked={settings.theme === "system"}
                  className={`flex flex-1 flex-col items-center p-3 rounded-lg border ${
                    settings.theme === "system"
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                  role="radio"
                  onPress={() => handleThemeChange("system")}
                >
                  <Monitor
                    className="mb-2 text-zinc-500"
                    size={24}
                    weight="bold"
                  />
                  <span className="text-sm font-medium">System</span>
                </Button>
              </div>
            </div>

            {/* Grid Density */}
            <div className="space-y-3">
              <div
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                id="grid-density-group"
              >
                Grid Density
              </div>
              <div
                aria-labelledby="grid-density-group"
                className="flex gap-3"
                role="radiogroup"
              >
                <Button
                  isIconOnly
                  aria-checked={gridDensity === "lo"}
                  className={`flex flex-1 items-center justify-center p-3 rounded-lg border ${
                    gridDensity === "lo"
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                  role="radio"
                  onPress={() => setGridDensity("lo")}
                >
                  <div className="grid grid-cols-2 gap-1 w-8 h-8">
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                  </div>
                  <span className="ml-2 text-sm font-medium">Low</span>
                </Button>
                <Button
                  isIconOnly
                  aria-checked={gridDensity === "md"}
                  className={`flex flex-1 items-center justify-center p-3 rounded-lg border ${
                    gridDensity === "md"
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                  role="radio"
                  onPress={() => setGridDensity("md")}
                >
                  <div className="grid grid-cols-3 gap-0.5 w-8 h-8">
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                  </div>
                  <span className="ml-2 text-sm font-medium">Medium</span>
                </Button>
                <Button
                  isIconOnly
                  aria-checked={gridDensity === "hi"}
                  className={`flex flex-1 items-center justify-center p-3 rounded-lg border ${
                    gridDensity === "hi"
                      ? "bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  }`}
                  role="radio"
                  onPress={() => setGridDensity("hi")}
                >
                  <div className="grid grid-cols-4 gap-0.5 w-8 h-8">
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                    <div className="bg-current rounded-sm opacity-70" />
                  </div>
                  <span className="ml-2 text-sm font-medium">High</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Divider className="my-6" />

        {/* Content Preferences */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Image className="text-primary-500" size={20} />
            <h3 className="text-lg font-semibold">Content Preferences</h3>
          </div>

          <div className="space-y-4 pl-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Show file previews</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Generate and display previews for all files
                </p>
              </div>
              <Switch
                color="primary"
                isSelected={settings.showPreviews}
                size="sm"
                onValueChange={(checked: boolean) =>
                  updateSetting("showPreviews", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Auto-play videos</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Automatically play video previews when visible
                </p>
              </div>
              <Switch
                color="primary"
                isSelected={settings.autoPlay}
                size="sm"
                onValueChange={(checked: boolean) =>
                  updateSetting("autoPlay", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Image quality</h4>
                <span className="text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                  {settings.imageQuality}%
                </span>
              </div>
              <Slider
                aria-label="Image quality"
                className="max-w-full"
                color="primary"
                defaultValue={80}
                step={5}
                value={settings.imageQuality}
                onChange={(value) =>
                  updateSetting(
                    "imageQuality",
                    Array.isArray(value) ? value[0] : value,
                  )
                }
              />
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>
          </div>
        </section>

        <Divider className="my-6" />

        {/* Notifications Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="text-primary-500" size={20} />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          <div className="space-y-4 pl-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email notifications</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Receive emails about file updates and comments
                </p>
              </div>
              <Switch
                color="primary"
                isSelected={settings.emailNotifications}
                size="sm"
                onValueChange={(checked: boolean) =>
                  updateSetting("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Slack notifications</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Receive Slack messages about file activities
                </p>
              </div>
              <Switch
                color="primary"
                isSelected={settings.slackNotifications}
                size="sm"
                onValueChange={(checked: boolean) =>
                  updateSetting("slackNotifications", checked)
                }
              />
            </div>
          </div>
        </section>

        <Divider className="my-6" />

        {/* Performance Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightning className="text-primary-500" size={20} />
            <h3 className="text-lg font-semibold">Performance</h3>
          </div>

          <div className="space-y-4 pl-1 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-start gap-3">
              <Sparkle className="text-amber-500 mt-0.5" size={18} />
              <div>
                <h4 className="text-sm font-medium">Performance mode</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Optimize app performance by reducing animations and effects.
                  Recommended for older devices.
                </p>
                <div className="mt-2">
                  <Switch
                    color="warning"
                    isSelected={settings.performanceMode}
                    size="sm"
                    onValueChange={(checked: boolean) =>
                      updateSetting("performanceMode", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
            onPress={onClose}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
