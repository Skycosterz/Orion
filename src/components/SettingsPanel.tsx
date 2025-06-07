import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Moon, Sun, Save } from "lucide-react";

type ModuleType = "focus" | "sleep" | "relax";

interface SettingsPanelProps {
  activeModule?: ModuleType;
  onClose?: () => void;
  onSave?: (settings: SettingsData) => void;
  moduleSoundscapes?: Record<ModuleType, string>;
  onSoundscapeChange?: (soundscapes: Record<ModuleType, string>) => void;
}

interface SettingsData {
  soundscape: string;
  volume: number;
  sessionDuration: number;
  notificationsEnabled: boolean;
  notificationFrequency: string;
  darkMode: boolean;
  moduleSettings: {
    focus: { soundscape: string; duration: number };
    sleep: { soundscape: string; duration: number };
    relax: { soundscape: string; duration: number };
    wake: { soundscape: string; duration: number };
    workout: { soundscape: string; duration: number };
    meditate: { soundscape: string; duration: number };
    travel: { soundscape: string; duration: number };
    unwind: { soundscape: string; duration: number };
    creativity: { soundscape: string; duration: number };
    baby: { soundscape: string; duration: number };
    study: { soundscape: string; duration: number };
    daydream: { soundscape: string; duration: number };
  };
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  activeModule = "focus",
  onClose = () => {},
  onSave = () => {},
  moduleSoundscapes = {
    focus: "Neural Patterns",
    sleep: "Dream Waves",
    relax: "Ocean Mind",
    wake: "Morning Nature",
    workout: "Stretch Flow",
    meditate: "Breath Guide",
    travel: "Highway Calm",
    unwind: "Day's End",
    creativity: "Creative Spark",
    baby: "Gentle Lullaby",
    study: "Study Focus",
    daydream: "Free Space",
  },
  onSoundscapeChange = () => {},
}) => {
  const [settings, setSettings] = useState<SettingsData>({
    soundscape: "forest",
    volume: 70,
    sessionDuration: 15,
    notificationsEnabled: true,
    notificationFrequency: "daily",
    darkMode: false,
    moduleSettings: {
      focus: { soundscape: "whitenoise", duration: 25 },
      sleep: { soundscape: "ocean", duration: 45 },
      relax: { soundscape: "forest", duration: 15 },
      wake: { soundscape: "Morning Nature", duration: 20 },
      workout: { soundscape: "Stretch Flow", duration: 30 },
      meditate: { soundscape: "Breath Guide", duration: 20 },
      travel: { soundscape: "Highway Calm", duration: 60 },
      unwind: { soundscape: "Day's End", duration: 25 },
      creativity: { soundscape: "Creative Spark", duration: 45 },
      baby: { soundscape: "Gentle Lullaby", duration: 30 },
      study: { soundscape: "Study Focus", duration: 25 },
      daydream: { soundscape: "Free Space", duration: 20 },
    },
  });

  const moduleOptions = {
    focus: {
      title: "Focus Settings",
      soundscapes: [
        { value: "Neural Patterns", label: "Neural Patterns" },
        { value: "Cognitive Flow", label: "Cognitive Flow" },
        { value: "Deep Work", label: "Deep Work" },
        { value: "Brain Waves", label: "Brain Waves" },
      ],
      defaultDuration: 25,
    },
    sleep: {
      title: "Sleep Settings",
      soundscapes: [
        { value: "Dream Waves", label: "Dream Waves" },
        { value: "Night Embrace", label: "Night Embrace" },
        { value: "Lunar Drift", label: "Lunar Drift" },
        { value: "Sleep Frequencies", label: "Sleep Frequencies" },
      ],
      defaultDuration: 45,
    },
    relax: {
      title: "Relax Settings",
      soundscapes: [
        { value: "Ocean Mind", label: "Ocean Mind" },
        { value: "Forest Calm", label: "Forest Calm" },
        { value: "Zen Garden", label: "Zen Garden" },
        { value: "Peaceful Flow", label: "Peaceful Flow" },
      ],
      defaultDuration: 15,
    },
    wake: {
      title: "Wake Settings",
      soundscapes: [
        { value: "Morning Nature", label: "Morning Nature" },
        { value: "Soft Synths", label: "Soft Synths" },
        { value: "Rising Rhythm", label: "Rising Rhythm" },
        { value: "Energy Boost", label: "Energy Boost" },
      ],
      defaultDuration: 20,
    },
    workout: {
      title: "Workout Settings",
      soundscapes: [
        { value: "Stretch Flow", label: "Stretch Flow" },
        { value: "Yoga Beats", label: "Yoga Beats" },
        { value: "Cardio Pulse", label: "Cardio Pulse" },
        { value: "Movement Energy", label: "Movement Energy" },
      ],
      defaultDuration: 30,
    },
    meditate: {
      title: "Meditate Settings",
      soundscapes: [
        { value: "Breath Guide", label: "Breath Guide" },
        { value: "Spatial Loops", label: "Spatial Loops" },
        { value: "Mindful Space", label: "Mindful Space" },
        { value: "Inner Peace", label: "Inner Peace" },
      ],
      defaultDuration: 20,
    },
    travel: {
      title: "Travel Settings",
      soundscapes: [
        { value: "Highway Calm", label: "Highway Calm" },
        { value: "Metro Rhythm", label: "Metro Rhythm" },
        { value: "Flight Ambient", label: "Flight Ambient" },
        { value: "Journey Peace", label: "Journey Peace" },
      ],
      defaultDuration: 60,
    },
    unwind: {
      title: "Unwind Settings",
      soundscapes: [
        { value: "Day's End", label: "Day's End" },
        { value: "Soft Disconnect", label: "Soft Disconnect" },
        { value: "Evening Peace", label: "Evening Peace" },
        { value: "Gentle Transition", label: "Gentle Transition" },
      ],
      defaultDuration: 25,
    },
    creativity: {
      title: "Creativity Settings",
      soundscapes: [
        { value: "Creative Spark", label: "Creative Spark" },
        { value: "Artistic Flow", label: "Artistic Flow" },
        { value: "Innovation", label: "Innovation" },
        { value: "Inspiration", label: "Inspiration" },
      ],
      defaultDuration: 45,
    },
    baby: {
      title: "Baby Settings",
      soundscapes: [
        { value: "Gentle Lullaby", label: "Gentle Lullaby" },
        { value: "Safe Frequencies", label: "Safe Frequencies" },
        { value: "Comfort Zone", label: "Comfort Zone" },
        { value: "Soothing Tones", label: "Soothing Tones" },
      ],
      defaultDuration: 30,
    },
    study: {
      title: "Study Settings",
      soundscapes: [
        { value: "Study Focus", label: "Study Focus" },
        { value: "Learning Flow", label: "Learning Flow" },
        { value: "Pomodoro Cycles", label: "Pomodoro Cycles" },
        { value: "Concentration", label: "Concentration" },
      ],
      defaultDuration: 25,
    },
    daydream: {
      title: "Daydream Settings",
      soundscapes: [
        { value: "Free Space", label: "Free Space" },
        { value: "Surreal Drift", label: "Surreal Drift" },
        { value: "Mental Journey", label: "Mental Journey" },
        { value: "Wandering Mind", label: "Wandering Mind" },
      ],
      defaultDuration: 20,
    },
  };

  const handleSoundscapeChange = (value: string) => {
    setSettings({ ...settings, soundscape: value });
  };

  const handleVolumeChange = (value: number[]) => {
    setSettings({ ...settings, volume: value[0] });
  };

  const handleSessionDurationChange = (value: number[]) => {
    setSettings({ ...settings, sessionDuration: value[0] });
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setSettings({ ...settings, notificationsEnabled: checked });
  };

  const handleNotificationFrequencyChange = (value: string) => {
    setSettings({ ...settings, notificationFrequency: value });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setSettings({ ...settings, darkMode: checked });
  };

  const handleSaveSettings = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-light tracking-wide">
            Settings
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-muted-foreground mt-2">
            Customize your digital detox experience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 sm:mb-8 p-1 h-10 sm:h-12">
              <TabsTrigger value="modules" className="text-xs sm:text-sm">
                Modules
              </TabsTrigger>
              <TabsTrigger value="sessions" className="text-xs sm:text-sm">
                Sessions
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm">
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="modules"
              className="space-y-4 sm:space-y-6 lg:space-y-8"
            >
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {Object.entries(moduleOptions).map(
                  ([moduleKey, moduleConfig]) => (
                    <Card
                      key={moduleKey}
                      className={`${activeModule === moduleKey ? "neu-raised border-primary/30" : "neu-flat"}`}
                    >
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg">
                          {moduleConfig.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm sm:text-base font-medium">
                              Soundscape
                            </Label>
                            <Select
                              value={moduleSoundscapes[moduleKey as ModuleType]}
                              onValueChange={(value) => {
                                const newSoundscapes = {
                                  ...moduleSoundscapes,
                                  [moduleKey]: value,
                                };
                                onSoundscapeChange(newSoundscapes);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {moduleConfig.soundscapes.map((soundscape) => (
                                  <SelectItem
                                    key={soundscape.value}
                                    value={soundscape.value}
                                  >
                                    {soundscape.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <Label className="text-sm sm:text-base font-medium">
                              Default Duration
                            </Label>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {settings.moduleSettings[moduleKey as ModuleType]
                                ?.duration || moduleConfig.defaultDuration}{" "}
                              minutes
                            </span>
                          </div>
                          <Slider
                            min={5}
                            max={60}
                            step={5}
                            value={[
                              settings.moduleSettings[moduleKey as ModuleType]
                                ?.duration || moduleConfig.defaultDuration,
                            ]}
                            onValueChange={(value) => {
                              setSettings({
                                ...settings,
                                moduleSettings: {
                                  ...settings.moduleSettings,
                                  [moduleKey]: {
                                    ...settings.moduleSettings[
                                      moduleKey as ModuleType
                                    ],
                                    duration: value[0],
                                  },
                                },
                              });
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </TabsContent>

            <TabsContent value="soundscapes" className="space-y-8">
              <div className="space-y-8">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Audio Disabled</h3>
                  <p className="text-muted-foreground">
                    Sound features have been removed for a distraction-free
                    experience
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <Label
                      htmlFor="duration"
                      className="text-sm sm:text-base font-medium"
                    >
                      Default Session Duration
                    </Label>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {settings.sessionDuration} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Slider
                      id="duration"
                      min={5}
                      max={60}
                      step={5}
                      value={[settings.sessionDuration]}
                      onValueChange={handleSessionDurationChange}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label
                      htmlFor="darkMode"
                      className="text-sm sm:text-base font-medium"
                    >
                      Dark Mode
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Use dark theme for your sessions
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={handleDarkModeToggle}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="notifications"
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label
                      htmlFor="notifications"
                      className="text-sm sm:text-base font-medium"
                    >
                      Enable Notifications
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Receive reminders for digital detox
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                    className="flex-shrink-0"
                  />
                </div>

                {settings.notificationsEnabled && (
                  <div className="pt-2">
                    <Label
                      htmlFor="frequency"
                      className="text-sm sm:text-base font-medium block mb-2"
                    >
                      Reminder Frequency
                    </Label>
                    <Select
                      value={settings.notificationFrequency}
                      onValueChange={handleNotificationFrequencyChange}
                      disabled={!settings.notificationsEnabled}
                    >
                      <SelectTrigger id="frequency" className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 sm:px-8 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="px-6 sm:px-8 w-full sm:w-auto"
            >
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
