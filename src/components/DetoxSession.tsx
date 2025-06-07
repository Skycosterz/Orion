import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Clock,
  Waves,
  Brain,
  Moon,
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
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

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

interface DetoxSessionProps {
  duration?: number; // in minutes
  soundscape?: string;
  module?: ModuleType;
  onComplete?: () => void;
  isActive?: boolean;
}

const DetoxSession = ({
  duration = 15,
  soundscape = "forest",
  module = "focus",
  onComplete = () => {},
  isActive = true,
}: DetoxSessionProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState((duration || 15) * 60); // in seconds
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ensure duration is always a valid number
  const sessionDuration = duration || 15;

  // Calculate progress percentage
  const progressPercentage =
    100 - (timeRemaining / (sessionDuration * 60)) * 100;

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer countdown
  useEffect(() => {
    if (isPaused || !isActive) return;

    if (timeRemaining <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, isPaused, isActive, onComplete]);

  // Audio control - using Web Audio API for frequency generation
  useEffect(() => {
    if (!isActive || isPaused) return;

    let audioContext: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    const startAudio = async () => {
      try {
        audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Resume audio context if suspended
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        // Set frequency to 777Hz
        oscillator.frequency.setValueAtTime(777, audioContext.currentTime);
        oscillator.type = "sine";

        // Set volume
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Start oscillator
        oscillator.start();
      } catch (error) {
        console.log("Audio initialization failed:", error);
      }
    };

    startAudio();

    return () => {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      if (gainNode) {
        gainNode.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive, isPaused]);

  // Audio initialization and cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Module configurations
  const moduleConfigs = {
    focus: {
      title: "Focus Session",
      centerText: "Deep Concentration",
      description: "AI-generated neural patterns enhance your cognitive flow",
      gradient: "from-blue-500 via-purple-500 to-indigo-600",
      icon: Brain,
      aiText: "Analyzing brainwave patterns...",
    },
    sleep: {
      title: "Sleep Preparation",
      centerText: "Drift Into Dreams",
      description: "Adaptive soundscapes guide you to restorative sleep",
      gradient: "from-purple-600 via-indigo-500 to-blue-600",
      icon: Moon,
      aiText: "Optimizing sleep frequencies...",
    },
    relax: {
      title: "Relaxation Session",
      centerText: "Find Your Flow",
      description: "Personalized ambient environments for deep relaxation",
      gradient: "from-green-500 via-teal-500 to-cyan-600",
      icon: Waves,
      aiText: "Generating calming patterns...",
    },
    wake: {
      title: "Wake / Energize Session",
      centerText: "Rise & Energize",
      description: "Gradual awakening sounds with growing energy patterns",
      gradient: "from-orange-400 via-yellow-500 to-amber-600",
      icon: Sun,
      aiText: "Building morning energy...",
    },
    workout: {
      title: "Workout / Move Session",
      centerText: "Move Your Body",
      description: "Rhythmic beats synchronized with your movement",
      gradient: "from-red-500 via-orange-500 to-pink-600",
      icon: Dumbbell,
      aiText: "Matching your rhythm...",
    },
    meditate: {
      title: "Meditate / Breathe Session",
      centerText: "Breathe & Center",
      description: "Spatial soundscapes guide your breathing and meditation",
      gradient: "from-emerald-500 via-green-500 to-teal-600",
      icon: Wind,
      aiText: "Synchronizing breath patterns...",
    },
    travel: {
      title: "Travel / Commute Session",
      centerText: "Journey in Peace",
      description: "Constant ambient sounds reduce travel stress",
      gradient: "from-sky-500 via-blue-500 to-indigo-600",
      icon: Plane,
      aiText: "Adapting to travel environment...",
    },
    unwind: {
      title: "Unwind / Evening Session",
      centerText: "Day's End Peace",
      description: "Gentle transition from work to rest",
      gradient: "from-violet-500 via-purple-500 to-pink-600",
      icon: Sunset,
      aiText: "Creating evening calm...",
    },
    creativity: {
      title: "Creativity / Flow Session",
      centerText: "Creative Flow State",
      description: "Active yet non-distracting sounds for creative work",
      gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
      icon: Palette,
      aiText: "Inspiring creative patterns...",
    },
    baby: {
      title: "Baby / Calm Kids Session",
      centerText: "Gentle & Safe",
      description: "Comforting frequencies designed for children",
      gradient: "from-cyan-400 via-blue-400 to-indigo-500",
      icon: Baby,
      aiText: "Creating safe soundscape...",
    },
    study: {
      title: "Study / Learn Session",
      centerText: "Learning Focus",
      description: "Neutral sounds with optional concentration cycles",
      gradient: "from-slate-500 via-gray-500 to-zinc-600",
      icon: BookOpen,
      aiText: "Optimizing learning environment...",
    },
    daydream: {
      title: "Mind Wandering / Daydream Session",
      centerText: "Let Your Mind Drift",
      description: "Free-flowing spatial sounds for mental exploration",
      gradient: "from-indigo-400 via-purple-400 to-pink-500",
      icon: Cloud,
      aiText: "Creating dreamlike patterns...",
    },
  };

  const currentModule = moduleConfigs[module];
  const IconComponent = currentModule.icon;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] bg-background relative px-4 sm:px-6 lg:px-8">
      {/* Ambient Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentModule.gradient}`}
        />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl endel-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl endel-float" />
      </div>

      <Card className="w-full max-w-6xl relative z-10">
        <CardContent className="space-y-6 sm:space-y-8 lg:space-y-12 p-4 sm:p-6 lg:p-12">
          {/* Session Header */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide endel-text-gradient">
                {currentModule.title}
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>{currentModule.aiText}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 endel-card rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-2 sm:py-4">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-mono endel-text-gradient font-light">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Session Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full h-3" />
          </div>

          {/* Visual Center - Full Card Animation */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center my-8 sm:my-12 lg:my-16">
            <div className="relative w-full max-w-3xl h-full rounded-2xl sm:rounded-3xl overflow-hidden endel-card bg-gradient-to-br from-black/20 via-gray-900/30 to-black/40">
              {/* Full Card Animation Container */}
              <div className="absolute inset-0">
                <div className="relative w-full h-full">
                  {module === "focus" && (
                    <>
                      {/* Focus: Concentric squares with neural network pattern */}
                      <motion.div
                        className="absolute inset-0 border border-blue-400/30 rounded-lg"
                        animate={{ rotate: [0, 90, 180, 270, 360] }}
                        transition={{
                          duration: 16,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className="absolute inset-8 border border-purple-400/40 rounded-lg"
                        animate={{ rotate: [360, 270, 180, 90, 0] }}
                        transition={{
                          duration: 12,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className="absolute inset-16 border border-indigo-400/50 rounded-lg"
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Neural connection lines */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-px h-12 bg-blue-400/40 origin-bottom"
                          style={{
                            transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                          }}
                          animate={{
                            opacity: [0.2, 1, 0.2],
                            scaleY: [0.5, 1.5, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {module === "sleep" && (
                    <>
                      {/* Sleep: Gentle waves and moon phases */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-purple-400/20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-8 rounded-full border border-indigo-400/30"
                        animate={{
                          scale: [1.2, 1, 1.2],
                          opacity: [0.6, 0.3, 0.6],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-16 rounded-full border border-blue-400/40"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Floating sleep particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-purple-300/60 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${60 + i * 10}px)`,
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.5, 1.2, 0.5],
                          }}
                          transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {module === "relax" && (
                    <>
                      {/* Relax: Organic flowing shapes */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-green-400/25"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 25,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className="absolute inset-6 rounded-full border border-teal-400/35"
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className="absolute inset-12 rounded-full border border-cyan-400/45"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Flowing wave lines */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-24 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent origin-left"
                          style={{
                            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
                          }}
                          animate={{
                            scaleX: [0.5, 1.5, 0.5],
                            opacity: [0.3, 0.8, 0.3],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 1.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}

                      {/* Organic floating elements */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 bg-teal-400/40 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateY(-${80 + i * 8}px)`,
                          }}
                          animate={{
                            scale: [0.8, 1.4, 0.8],
                            opacity: [0.4, 0.9, 0.4],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 6 + i * 0.8,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {module === "wake" && (
                    <>
                      {/* Wake: Rising sun rays */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-t from-transparent via-orange-400/60 to-transparent origin-bottom"
                          style={{
                            transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                          }}
                          animate={{
                            scaleY: [0.3, 1.2, 0.3],
                            opacity: [0.4, 0.9, 0.4],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-12 rounded-full border border-yellow-400/40"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </>
                  )}

                  {module === "workout" && (
                    <>
                      {/* Workout: Pulsing energy bars */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-2 bg-gradient-to-t from-red-500 to-orange-400 origin-bottom"
                          style={{
                            height: `${40 + i * 8}px`,
                            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-${30 + i * 5}px)`,
                          }}
                          animate={{
                            scaleY: [0.5, 1.5, 0.5],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {module === "meditate" && (
                    <>
                      {/* Meditate: Breathing circles */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-emerald-400/30"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-12 rounded-full border border-green-400/40"
                        animate={{
                          scale: [1.2, 0.8, 1.2],
                          opacity: [0.5, 0.9, 0.5],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-teal-400/70 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-60px)`,
                          }}
                          animate={{
                            scale: [0.5, 1.5, 0.5],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {module === "travel" && (
                    <>
                      {/* Travel: Moving horizon lines */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
                          style={{
                            transform: `translateY(${(i - 2) * 20}px)`,
                          }}
                          animate={{
                            x: [-100, 100, -100],
                            opacity: [0.2, 0.8, 0.2],
                          }}
                          transition={{
                            duration: 6 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "linear",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-16 rounded-full border border-blue-400/30"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.2, 0.6, 0.2],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </>
                  )}

                  {module === "unwind" && (
                    <>
                      {/* Unwind: Gentle sunset gradient */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-violet-400/25"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
                          style={{
                            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
                          }}
                          animate={{
                            scaleX: [0.5, 1.2, 0.5],
                            opacity: [0.3, 0.8, 0.3],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {module === "creativity" && (
                    <>
                      {/* Creativity: Dynamic paint splashes */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-${50 + i * 10}px)`,
                          }}
                          animate={{
                            scale: [0.3, 1.2, 0.3],
                            opacity: [0.4, 0.9, 0.4],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-12 rounded-lg border border-pink-400/40"
                        animate={{ rotate: [0, 90, 180, 270, 360] }}
                        transition={{
                          duration: 12,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </>
                  )}

                  {module === "baby" && (
                    <>
                      {/* Baby: Gentle floating bubbles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 bg-cyan-300/50 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${40 + i * 8}px)`,
                          }}
                          animate={{
                            y: [-8, 8, -8],
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.3, 0.8, 0.3],
                          }}
                          transition={{
                            duration: 4 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-8 rounded-full border border-blue-300/30"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </>
                  )}

                  {module === "study" && (
                    <>
                      {/* Study: Organized grid pattern */}
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-gray-400/60 rounded-sm"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) translate(${((i % 3) - 1) * 40}px, ${(Math.floor(i / 3) - 1) * 40}px)`,
                          }}
                          animate={{
                            opacity: [0.3, 0.9, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-16 rounded-lg border border-slate-400/40"
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </>
                  )}

                  {module === "daydream" && (
                    <>
                      {/* Daydream: Floating dream clouds */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-8 h-4 bg-gradient-to-r from-indigo-300/40 via-purple-300/60 to-pink-300/40 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateY(-${60 + i * 15}px)`,
                          }}
                          animate={{
                            x: [-10, 10, -10],
                            y: [-5, 5, -5],
                            scale: [0.8, 1.3, 0.8],
                            opacity: [0.3, 0.8, 0.3],
                          }}
                          transition={{
                            duration: 8 + i * 1.5,
                            repeat: Infinity,
                            delay: i * 1.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-purple-300/20"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.2, 0.6, 0.2],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Text content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center space-y-2 sm:space-y-4 mx-auto px-4 z-10"
                >
                  <div className="text-white font-light text-xl sm:text-2xl lg:text-3xl tracking-wide drop-shadow-lg">
                    {currentModule.centerText}
                  </div>
                  <div className="text-white/80 text-sm sm:text-base max-w-md mx-auto drop-shadow-md">
                    {currentModule.description}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full flex flex-col space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Playback Controls */}
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="endel"
                  size="xl"
                  className="h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 rounded-full"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? (
                    <Play className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                  ) : (
                    <Pause className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetoxSession;
