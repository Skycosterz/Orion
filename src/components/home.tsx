import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Settings,
  Clock,
  Calendar,
  Volume2,
  Focus,
  Moon,
  Heart,
  Waves,
  Brain,
  Sparkles,
  Sun,
  Dumbbell,
  Wind,
  Plane,
  Sunset,
  Palette,
  Baby,
  BookOpen,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetoxSession from "./DetoxSession";
import SessionHistory from "./SessionHistory";
import SettingsPanel from "./SettingsPanel";

type ModuleType =
  | "focus"
  | "sleep"
  | "relax"
  | "wake"
  | "workout"
  | "meditate"
  | "travel"
  | "unwind"
  | "creativity"
  | "baby"
  | "study"
  | "daydream";

const Home = () => {
  const [activeSession, setActiveSession] = useState(false);
  const [activeTab, setActiveTab] = useState("session");
  const [activeModule, setActiveModule] = useState<ModuleType>("focus");
  const [volume, setVolume] = useState(70);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const [moduleSoundscapes, setModuleSoundscapes] = useState<
    Record<ModuleType, string>
  >({
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
  });

  const handleDisconnect = () => {
    setActiveSession(!activeSession);
    setActiveTab("session");
  };

  const modules = {
    focus: {
      title: "Focus",
      icon: Brain,
      description: "AI-generated soundscapes for deep concentration",
      gradient: "from-blue-500 via-purple-500 to-indigo-600",
      buttonText: "Begin Focus",
      soundscapes: ["Neural Patterns", "Cognitive Flow", "Deep Work"],
    },
    sleep: {
      title: "Sleep",
      icon: Moon,
      description: "Adaptive audio for restorative sleep",
      gradient: "from-purple-600 via-indigo-500 to-blue-600",
      buttonText: "Enter Sleep",
      soundscapes: ["Dream Waves", "Night Embrace", "Lunar Drift"],
    },
    relax: {
      title: "Relax",
      icon: Waves,
      description: "Personalized ambient environments",
      gradient: "from-green-500 via-teal-500 to-cyan-600",
      buttonText: "Start Relaxing",
      soundscapes: ["Ocean Mind", "Forest Calm", "Zen Garden"],
    },
    wake: {
      title: "Wake / Energize",
      icon: Sun,
      description: "Gradual awakening and energy boost",
      gradient: "from-orange-400 via-yellow-500 to-amber-600",
      buttonText: "Wake Up",
      soundscapes: ["Morning Nature", "Soft Synths", "Rising Rhythm"],
    },
    workout: {
      title: "Workout / Move",
      icon: Dumbbell,
      description: "Rhythmic beats for physical activity",
      gradient: "from-red-500 via-orange-500 to-pink-600",
      buttonText: "Start Moving",
      soundscapes: ["Stretch Flow", "Yoga Beats", "Cardio Pulse"],
    },
    meditate: {
      title: "Meditate / Breathe",
      icon: Wind,
      description: "Spatial sounds for meditation and breathing",
      gradient: "from-emerald-500 via-green-500 to-teal-600",
      buttonText: "Begin Meditation",
      soundscapes: ["Breath Guide", "Spatial Loops", "Mindful Space"],
    },
    travel: {
      title: "Travel / Commute",
      icon: Plane,
      description: "Constant sounds to reduce travel stress",
      gradient: "from-sky-500 via-blue-500 to-indigo-600",
      buttonText: "Start Journey",
      soundscapes: ["Highway Calm", "Metro Rhythm", "Flight Ambient"],
    },
    unwind: {
      title: "Unwind / Evening",
      icon: Sunset,
      description: "Transition from work to rest",
      gradient: "from-violet-500 via-purple-500 to-pink-600",
      buttonText: "Unwind Now",
      soundscapes: ["Day's End", "Soft Disconnect", "Evening Peace"],
    },
    creativity: {
      title: "Creativity / Flow",
      icon: Palette,
      description: "Active but non-distracting sounds for creative work",
      gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
      buttonText: "Enter Flow",
      soundscapes: ["Creative Spark", "Artistic Flow", "Innovation"],
    },
    baby: {
      title: "Baby / Calm Kids",
      icon: Baby,
      description: "Safe and comforting frequencies for children",
      gradient: "from-cyan-400 via-blue-400 to-indigo-500",
      buttonText: "Calm & Soothe",
      soundscapes: ["Gentle Lullaby", "Safe Frequencies", "Comfort Zone"],
    },
    study: {
      title: "Study / Learn",
      icon: BookOpen,
      description: "Neutral sounds with concentration cycles",
      gradient: "from-slate-500 via-gray-500 to-zinc-600",
      buttonText: "Start Learning",
      soundscapes: ["Study Focus", "Learning Flow", "Pomodoro Cycles"],
    },
    daydream: {
      title: "Mind Wandering / Daydream",
      icon: Cloud,
      description: "Free and spatial sounds for mental wandering",
      gradient: "from-indigo-400 via-purple-400 to-pink-500",
      buttonText: "Let Mind Wander",
      soundscapes: ["Free Space", "Surreal Drift", "Mental Journey"],
    },
  };

  const currentModule = modules[activeModule] || modules.focus;

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-start">
      {/* Ambient Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-teal-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl endel-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl endel-float" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl flex justify-between items-center p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl endel-gradient flex items-center justify-center">
            <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wide endel-text-gradient">
            Orion
          </h1>
        </div>
        <Button
          variant="endel"
          size="icon"
          onClick={() => setActiveTab("settings")}
          className="rounded-2xl h-8 w-8 sm:h-10 sm:w-10"
        >
          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Module Selection */}
        {!activeSession && activeTab === "session" && (
          <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8 sm:space-y-12 lg:space-y-16">
            {/* AI Status */}
            <div className="text-center space-y-4 mb-4 sm:mb-6 lg:mb-8 px-4">
              <div className="inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full endel-card">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  AI Engine Active
                </span>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl px-4">
                Personalized soundscapes generated in real-time based on your
                activity and environment
              </p>
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
              {Object.entries(modules).map(([key, module]) => {
                const IconComponent = module.icon;
                const isActive = activeModule === key;
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-500 h-48 sm:h-56 lg:h-64 relative overflow-hidden ${
                        isActive
                          ? "border-primary/30 bg-white/[0.03] endel-glow"
                          : "hover:bg-white/[0.02] hover:border-white/[0.12]"
                      }`}
                      onClick={() => setActiveModule(key as ModuleType)}
                    >
                      {/* Background Gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-5`}
                      />

                      <CardHeader className="relative z-10 text-center h-full flex flex-col justify-center p-3 sm:p-4 lg:p-6">
                        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 transition-all duration-300 hover:bg-white/10">
                          <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-foreground" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-light mb-2 sm:mb-3">
                          {module.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed px-2">
                          {module.description}
                        </p>
                        <div className="mt-2 sm:mt-3 lg:mt-4 flex flex-wrap justify-center gap-1 sm:gap-2">
                          {module.soundscapes.slice(0, 2).map((soundscape) => (
                            <span
                              key={soundscape}
                              className="text-xs px-2 sm:px-3 py-1 rounded-full bg-white/5 text-muted-foreground"
                            >
                              {soundscape}
                            </span>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Main Action Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative mb-8 sm:mb-12 lg:mb-16"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentModule.gradient} rounded-full blur-3xl opacity-30 animate-pulse`}
              />
              <Button
                onClick={handleDisconnect}
                size="xl"
                className={`h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 text-sm sm:text-base lg:text-lg font-light tracking-wider relative z-10 bg-gradient-to-br ${currentModule.gradient} hover:shadow-2xl transition-all duration-500 border-0`}
              >
                <span className="text-center leading-tight">
                  {currentModule.buttonText}
                </span>
              </Button>
            </motion.div>

            {/* Quick Settings */}
            <Card className="w-full max-w-2xl mx-4 sm:mx-0">
              <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-light mb-2">
                    Session Settings
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground px-2">
                    Customize your {currentModule.title.toLowerCase()}{" "}
                    experience
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <span className="text-sm sm:text-base text-foreground font-medium">
                        Duration
                      </span>
                    </div>
                    <span className="font-semibold endel-text-gradient text-base sm:text-lg">
                      {sessionDuration} min
                    </span>
                  </div>
                  <Slider
                    value={[sessionDuration]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setSessionDuration(value[0])}
                  />
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <span className="text-sm sm:text-base text-foreground font-medium">
                        Ambient Level
                      </span>
                    </div>
                    <span className="font-semibold endel-text-gradient text-base sm:text-lg">
                      {volume}%
                    </span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Session */}
        {activeSession && activeTab === "session" && (
          <DetoxSession
            duration={sessionDuration}
            module={activeModule}
            soundscape={moduleSoundscapes[activeModule]}
            onComplete={() => setActiveSession(false)}
            isActive={activeSession}
          />
        )}

        {/* Session History */}
        {activeTab === "history" && <SessionHistory />}

        {/* Settings Panel */}
        {activeTab === "settings" && (
          <SettingsPanel
            onClose={() => setActiveTab("session")}
            moduleSoundscapes={moduleSoundscapes}
            onSoundscapeChange={(newSoundscapes) =>
              setModuleSoundscapes(newSoundscapes)
            }
          />
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-10 w-full max-w-7xl mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 h-12 sm:h-14 lg:h-16">
            <TabsTrigger
              value="session"
              className="flex-col gap-1 text-xs sm:text-sm"
            >
              {activeSession ? (
                <>
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">Active</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">Session</span>
                </>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-col gap-1 text-xs sm:text-sm"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs">History</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-col gap-1 text-xs sm:text-sm"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};

export default Home;
