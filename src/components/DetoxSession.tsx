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

  // Audio control - using Web Audio API for better soundscape generation
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let filterNode: BiquadFilterNode | null = null;
    let noiseBuffer: AudioBuffer | null = null;
    let noiseSource: AudioBufferSourceNode | null = null;

    const initAudio = async () => {
      try {
        // Create audio context
        audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Resume audio context if suspended (required for user interaction)
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        // Create gain node for volume control
        gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.connect(audioContext.destination);

        // Create filter for shaping the sound
        filterNode = audioContext.createBiquadFilter();
        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, audioContext.currentTime);
        filterNode.connect(gainNode);

        // Generate different soundscapes based on module
        if (module === "focus" || module === "study") {
          // Focus: Enhanced binaural beats with layered frequencies and brown noise
          oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);

          const oscillator2 = audioContext.createOscillator();
          oscillator2.type = "sine";
          oscillator2.frequency.setValueAtTime(240, audioContext.currentTime); // 40Hz difference

          // Add alpha wave frequency (10Hz binaural beat)
          const alphaOsc1 = audioContext.createOscillator();
          const alphaOsc2 = audioContext.createOscillator();
          alphaOsc1.type = "triangle";
          alphaOsc2.type = "triangle";
          alphaOsc1.frequency.setValueAtTime(100, audioContext.currentTime);
          alphaOsc2.frequency.setValueAtTime(110, audioContext.currentTime);

          // Brown noise for deeper focus
          const brownNoiseBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 2,
            audioContext.sampleRate,
          );
          const brownOutput = brownNoiseBuffer.getChannelData(0);
          let lastOut = 0;
          for (let i = 0; i < brownOutput.length; i++) {
            const white = Math.random() * 2 - 1;
            brownOutput[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = brownOutput[i];
            brownOutput[i] *= 3.5;
          }

          const brownNoise = audioContext.createBufferSource();
          brownNoise.buffer = brownNoiseBuffer;
          brownNoise.loop = true;

          const gainOsc1 = audioContext.createGain();
          const gainOsc2 = audioContext.createGain();
          const gainAlpha1 = audioContext.createGain();
          const gainAlpha2 = audioContext.createGain();
          const gainBrown = audioContext.createGain();

          gainOsc1.gain.setValueAtTime(0.58, audioContext.currentTime);
          gainOsc2.gain.setValueAtTime(0.58, audioContext.currentTime);
          gainAlpha1.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainAlpha2.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainBrown.gain.setValueAtTime(0.53, audioContext.currentTime);

          oscillator.connect(gainOsc1);
          oscillator2.connect(gainOsc2);
          alphaOsc1.connect(gainAlpha1);
          alphaOsc2.connect(gainAlpha2);
          brownNoise.connect(gainBrown);

          gainOsc1.connect(filterNode);
          gainOsc2.connect(filterNode);
          gainAlpha1.connect(filterNode);
          gainAlpha2.connect(filterNode);
          gainBrown.connect(filterNode);

          oscillator.start();
          oscillator2.start();
          alphaOsc1.start();
          alphaOsc2.start();
          brownNoise.start();
        } else if (module === "sleep" || module === "relax") {
          // Sleep/Relax: Delta waves with ocean-like sounds and gentle rain
          oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(60, audioContext.currentTime); // Lower for sleep

          // Delta wave binaural beat (2Hz)
          const deltaOsc1 = audioContext.createOscillator();
          const deltaOsc2 = audioContext.createOscillator();
          deltaOsc1.type = "sine";
          deltaOsc2.type = "sine";
          deltaOsc1.frequency.setValueAtTime(80, audioContext.currentTime);
          deltaOsc2.frequency.setValueAtTime(82, audioContext.currentTime);

          // Ocean wave simulation
          const waveOsc = audioContext.createOscillator();
          waveOsc.type = "sawtooth";
          waveOsc.frequency.setValueAtTime(0.1, audioContext.currentTime);

          const waveLfo = audioContext.createOscillator();
          waveLfo.type = "sine";
          waveLfo.frequency.setValueAtTime(0.05, audioContext.currentTime);

          const waveLfoGain = audioContext.createGain();
          waveLfoGain.gain.setValueAtTime(30, audioContext.currentTime);

          // Rain-like white noise
          const rainBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 2,
            audioContext.sampleRate,
          );
          const rainOutput = rainBuffer.getChannelData(0);
          for (let i = 0; i < rainOutput.length; i++) {
            rainOutput[i] = (Math.random() * 2 - 1) * 0.1;
          }

          const rainNoise = audioContext.createBufferSource();
          rainNoise.buffer = rainBuffer;
          rainNoise.loop = true;

          const gainMain = audioContext.createGain();
          const gainDelta1 = audioContext.createGain();
          const gainDelta2 = audioContext.createGain();
          const gainWave = audioContext.createGain();
          const gainRain = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.56, audioContext.currentTime);
          gainDelta1.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainDelta2.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainWave.gain.setValueAtTime(0.58, audioContext.currentTime);
          gainRain.gain.setValueAtTime(0.55, audioContext.currentTime);

          waveLfo.connect(waveLfoGain);
          waveLfoGain.connect(waveOsc.frequency);

          oscillator.connect(gainMain);
          deltaOsc1.connect(gainDelta1);
          deltaOsc2.connect(gainDelta2);
          waveOsc.connect(gainWave);
          rainNoise.connect(gainRain);

          gainMain.connect(filterNode);
          gainDelta1.connect(filterNode);
          gainDelta2.connect(filterNode);
          gainWave.connect(filterNode);
          gainRain.connect(filterNode);

          oscillator.start();
          deltaOsc1.start();
          deltaOsc2.start();
          waveOsc.start();
          waveLfo.start();
          rainNoise.start();
        } else if (module === "meditate") {
          // Meditate: Tibetan singing bowl harmonics with breath-synchronized tones
          oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(136.1, audioContext.currentTime); // OM frequency

          // Harmonic series for singing bowl effect
          const harmonic2 = audioContext.createOscillator();
          const harmonic3 = audioContext.createOscillator();
          const harmonic4 = audioContext.createOscillator();

          harmonic2.type = "sine";
          harmonic3.type = "sine";
          harmonic4.type = "triangle";

          harmonic2.frequency.setValueAtTime(272.2, audioContext.currentTime); // 2nd harmonic
          harmonic3.frequency.setValueAtTime(408.3, audioContext.currentTime); // 3rd harmonic
          harmonic4.frequency.setValueAtTime(544.4, audioContext.currentTime); // 4th harmonic

          // Breath-synchronized modulation (4 seconds in, 4 seconds out)
          const breathLfo = audioContext.createOscillator();
          breathLfo.type = "sine";
          breathLfo.frequency.setValueAtTime(0.125, audioContext.currentTime); // 8-second cycle

          const breathGain = audioContext.createGain();
          breathGain.gain.setValueAtTime(0.02, audioContext.currentTime);

          // Theta wave binaural beat (6Hz)
          const thetaOsc1 = audioContext.createOscillator();
          const thetaOsc2 = audioContext.createOscillator();
          thetaOsc1.type = "sine";
          thetaOsc2.type = "sine";
          thetaOsc1.frequency.setValueAtTime(200, audioContext.currentTime);
          thetaOsc2.frequency.setValueAtTime(206, audioContext.currentTime);

          const gainMain = audioContext.createGain();
          const gainHarm2 = audioContext.createGain();
          const gainHarm3 = audioContext.createGain();
          const gainHarm4 = audioContext.createGain();
          const gainTheta1 = audioContext.createGain();
          const gainTheta2 = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.51, audioContext.currentTime);
          gainHarm2.gain.setValueAtTime(0.56, audioContext.currentTime);
          gainHarm3.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainHarm4.gain.setValueAtTime(0.52, audioContext.currentTime);
          gainTheta1.gain.setValueAtTime(0.53, audioContext.currentTime);
          gainTheta2.gain.setValueAtTime(0.53, audioContext.currentTime);

          breathLfo.connect(breathGain);
          breathGain.connect(gainMain.gain);

          oscillator.connect(gainMain);
          harmonic2.connect(gainHarm2);
          harmonic3.connect(gainHarm3);
          harmonic4.connect(gainHarm4);
          thetaOsc1.connect(gainTheta1);
          thetaOsc2.connect(gainTheta2);

          gainMain.connect(filterNode);
          gainHarm2.connect(filterNode);
          gainHarm3.connect(filterNode);
          gainHarm4.connect(filterNode);
          gainTheta1.connect(filterNode);
          gainTheta2.connect(filterNode);

          oscillator.start();
          harmonic2.start();
          harmonic3.start();
          harmonic4.start();
          thetaOsc1.start();
          thetaOsc2.start();
          breathLfo.start();
        } else if (module === "wake") {
          // Wake: Energizing frequencies with bird-like chirps and gentle crescendo
          oscillator = audioContext.createOscillator();
          oscillator.type = "sawtooth";
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime);

          // Beta wave binaural beat (15Hz) for alertness
          const betaOsc1 = audioContext.createOscillator();
          const betaOsc2 = audioContext.createOscillator();
          betaOsc1.type = "sine";
          betaOsc2.type = "sine";
          betaOsc1.frequency.setValueAtTime(300, audioContext.currentTime);
          betaOsc2.frequency.setValueAtTime(315, audioContext.currentTime);

          // Bird-like chirping sounds
          const chirpOsc = audioContext.createOscillator();
          chirpOsc.type = "square";
          chirpOsc.frequency.setValueAtTime(800, audioContext.currentTime);

          const chirpLfo = audioContext.createOscillator();
          chirpLfo.type = "sine";
          chirpLfo.frequency.setValueAtTime(0.3, audioContext.currentTime);

          const chirpLfoGain = audioContext.createGain();
          chirpLfoGain.gain.setValueAtTime(200, audioContext.currentTime);

          // Gentle wind-like noise
          const windBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 2,
            audioContext.sampleRate,
          );
          const windOutput = windBuffer.getChannelData(0);
          for (let i = 0; i < windOutput.length; i++) {
            windOutput[i] = (Math.random() * 2 - 1) * 0.05;
          }

          const windNoise = audioContext.createBufferSource();
          windNoise.buffer = windBuffer;
          windNoise.loop = true;

          const gainMain = audioContext.createGain();
          const gainBeta1 = audioContext.createGain();
          const gainBeta2 = audioContext.createGain();
          const gainChirp = audioContext.createGain();
          const gainWind = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.58, audioContext.currentTime);
          gainBeta1.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainBeta2.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainChirp.gain.setValueAtTime(0.53, audioContext.currentTime);
          gainWind.gain.setValueAtTime(0.56, audioContext.currentTime);

          chirpLfo.connect(chirpLfoGain);
          chirpLfoGain.connect(chirpOsc.frequency);

          oscillator.connect(gainMain);
          betaOsc1.connect(gainBeta1);
          betaOsc2.connect(gainBeta2);
          chirpOsc.connect(gainChirp);
          windNoise.connect(gainWind);

          gainMain.connect(filterNode);
          gainBeta1.connect(filterNode);
          gainBeta2.connect(filterNode);
          gainChirp.connect(filterNode);
          gainWind.connect(filterNode);

          oscillator.start();
          betaOsc1.start();
          betaOsc2.start();
          chirpOsc.start();
          chirpLfo.start();
          windNoise.start();
        } else if (module === "workout") {
          // Workout: Rhythmic beats with energizing bass and percussion-like elements
          oscillator = audioContext.createOscillator();
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(80, audioContext.currentTime); // Bass frequency

          // Rhythmic pulse (120 BPM)
          const pulseOsc = audioContext.createOscillator();
          pulseOsc.type = "square";
          pulseOsc.frequency.setValueAtTime(2, audioContext.currentTime); // 2Hz = 120 BPM

          const pulseGain = audioContext.createGain();
          pulseGain.gain.setValueAtTime(0, audioContext.currentTime);

          // High-energy frequencies
          const energyOsc1 = audioContext.createOscillator();
          const energyOsc2 = audioContext.createOscillator();
          energyOsc1.type = "sawtooth";
          energyOsc2.type = "triangle";
          energyOsc1.frequency.setValueAtTime(440, audioContext.currentTime);
          energyOsc2.frequency.setValueAtTime(660, audioContext.currentTime);

          // Percussion-like noise bursts
          const percBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 0.1,
            audioContext.sampleRate,
          );
          const percOutput = percBuffer.getChannelData(0);
          for (let i = 0; i < percOutput.length; i++) {
            percOutput[i] =
              (Math.random() * 2 - 1) *
              Math.exp(-i / (percOutput.length * 0.3));
          }

          const percNoise = audioContext.createBufferSource();
          percNoise.buffer = percBuffer;
          percNoise.loop = true;

          const gainBass = audioContext.createGain();
          const gainEnergy1 = audioContext.createGain();
          const gainEnergy2 = audioContext.createGain();
          const gainPerc = audioContext.createGain();

          gainBass.gain.setValueAtTime(0.52, audioContext.currentTime);
          gainEnergy1.gain.setValueAtTime(0.56, audioContext.currentTime);
          gainEnergy2.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainPerc.gain.setValueAtTime(0.58, audioContext.currentTime);

          // Connect pulse to modulate bass
          pulseOsc.connect(pulseGain);
          pulseGain.connect(gainBass.gain);

          oscillator.connect(gainBass);
          energyOsc1.connect(gainEnergy1);
          energyOsc2.connect(gainEnergy2);
          percNoise.connect(gainPerc);

          gainBass.connect(filterNode);
          gainEnergy1.connect(filterNode);
          gainEnergy2.connect(filterNode);
          gainPerc.connect(filterNode);

          oscillator.start();
          pulseOsc.start();
          energyOsc1.start();
          energyOsc2.start();
          percNoise.start();
        } else if (module === "travel") {
          // Travel: Constant ambient drone with subtle movement and engine-like hum
          oscillator = audioContext.createOscillator();
          oscillator.type = "sawtooth";
          oscillator.frequency.setValueAtTime(120, audioContext.currentTime);

          // Engine-like hum
          const engineOsc = audioContext.createOscillator();
          engineOsc.type = "square";
          engineOsc.frequency.setValueAtTime(60, audioContext.currentTime);

          const engineLfo = audioContext.createOscillator();
          engineLfo.type = "sine";
          engineLfo.frequency.setValueAtTime(0.2, audioContext.currentTime);

          const engineLfoGain = audioContext.createGain();
          engineLfoGain.gain.setValueAtTime(5, audioContext.currentTime);

          // Movement simulation (Doppler-like effect)
          const movementOsc = audioContext.createOscillator();
          movementOsc.type = "triangle";
          movementOsc.frequency.setValueAtTime(200, audioContext.currentTime);

          const movementLfo = audioContext.createOscillator();
          movementLfo.type = "sine";
          movementLfo.frequency.setValueAtTime(0.1, audioContext.currentTime);

          const movementLfoGain = audioContext.createGain();
          movementLfoGain.gain.setValueAtTime(20, audioContext.currentTime);

          // Air conditioning-like white noise
          const acBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 2,
            audioContext.sampleRate,
          );
          const acOutput = acBuffer.getChannelData(0);
          for (let i = 0; i < acOutput.length; i++) {
            acOutput[i] = (Math.random() * 2 - 1) * 0.08;
          }

          const acNoise = audioContext.createBufferSource();
          acNoise.buffer = acBuffer;
          acNoise.loop = true;

          const gainMain = audioContext.createGain();
          const gainEngine = audioContext.createGain();
          const gainMovement = audioContext.createGain();
          const gainAc = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.58, audioContext.currentTime);
          gainEngine.gain.setValueAtTime(0.51, audioContext.currentTime);
          gainMovement.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainAc.gain.setValueAtTime(0.56, audioContext.currentTime);

          engineLfo.connect(engineLfoGain);
          engineLfoGain.connect(engineOsc.frequency);
          movementLfo.connect(movementLfoGain);
          movementLfoGain.connect(movementOsc.frequency);

          oscillator.connect(gainMain);
          engineOsc.connect(gainEngine);
          movementOsc.connect(gainMovement);
          acNoise.connect(gainAc);

          gainMain.connect(filterNode);
          gainEngine.connect(filterNode);
          gainMovement.connect(filterNode);
          gainAc.connect(filterNode);

          oscillator.start();
          engineOsc.start();
          engineLfo.start();
          movementOsc.start();
          movementLfo.start();
          acNoise.start();
        } else if (module === "unwind") {
          // Unwind: Warm evening tones with cricket-like sounds and gentle wind
          oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime);

          // Cricket-like chirping
          const cricketOsc = audioContext.createOscillator();
          cricketOsc.type = "square";
          cricketOsc.frequency.setValueAtTime(1200, audioContext.currentTime);

          const cricketLfo = audioContext.createOscillator();
          cricketLfo.type = "sine";
          cricketLfo.frequency.setValueAtTime(3, audioContext.currentTime);

          const cricketLfoGain = audioContext.createGain();
          cricketLfoGain.gain.setValueAtTime(0.02, audioContext.currentTime);

          // Warm harmonic
          const warmOsc = audioContext.createOscillator();
          warmOsc.type = "triangle";
          warmOsc.frequency.setValueAtTime(165, audioContext.currentTime); // Perfect fifth

          // Evening breeze
          const breezeBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 3,
            audioContext.sampleRate,
          );
          const breezeOutput = breezeBuffer.getChannelData(0);
          for (let i = 0; i < breezeOutput.length; i++) {
            breezeOutput[i] =
              (Math.random() * 2 - 1) * 0.04 * Math.sin(i * 0.001);
          }

          const breezeNoise = audioContext.createBufferSource();
          breezeNoise.buffer = breezeBuffer;
          breezeNoise.loop = true;

          const gainMain = audioContext.createGain();
          const gainCricket = audioContext.createGain();
          const gainWarm = audioContext.createGain();
          const gainBreeze = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.58, audioContext.currentTime);
          gainCricket.gain.setValueAtTime(0.53, audioContext.currentTime);
          gainWarm.gain.setValueAtTime(0.56, audioContext.currentTime);
          gainBreeze.gain.setValueAtTime(0.55, audioContext.currentTime);

          cricketLfo.connect(cricketLfoGain);
          cricketLfoGain.connect(gainCricket.gain);

          oscillator.connect(gainMain);
          cricketOsc.connect(gainCricket);
          warmOsc.connect(gainWarm);
          breezeNoise.connect(gainBreeze);

          gainMain.connect(filterNode);
          gainCricket.connect(filterNode);
          gainWarm.connect(filterNode);
          gainBreeze.connect(filterNode);

          oscillator.start();
          cricketOsc.start();
          cricketLfo.start();
          warmOsc.start();
          breezeNoise.start();
        } else if (module === "creativity") {
          // Creativity: Dynamic frequencies with sparkle-like tones and flowing patterns
          oscillator = audioContext.createOscillator();
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // Middle C

          // Sparkle tones (random high frequencies)
          const sparkleOsc1 = audioContext.createOscillator();
          const sparkleOsc2 = audioContext.createOscillator();
          sparkleOsc1.type = "sine";
          sparkleOsc2.type = "sine";
          sparkleOsc1.frequency.setValueAtTime(800, audioContext.currentTime);
          sparkleOsc2.frequency.setValueAtTime(1200, audioContext.currentTime);

          // Creative flow modulation
          const flowLfo = audioContext.createOscillator();
          flowLfo.type = "sine";
          flowLfo.frequency.setValueAtTime(0.3, audioContext.currentTime);

          const flowGain = audioContext.createGain();
          flowGain.gain.setValueAtTime(50, audioContext.currentTime);

          // Inspiration bursts
          const burstBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 0.5,
            audioContext.sampleRate,
          );
          const burstOutput = burstBuffer.getChannelData(0);
          for (let i = 0; i < burstOutput.length; i++) {
            burstOutput[i] =
              Math.sin(i * 0.02) *
              Math.exp(-i / (burstOutput.length * 0.2)) *
              0.1;
          }

          const burstNoise = audioContext.createBufferSource();
          burstNoise.buffer = burstBuffer;
          burstNoise.loop = true;

          const gainMain = audioContext.createGain();
          const gainSparkle1 = audioContext.createGain();
          const gainSparkle2 = audioContext.createGain();
          const gainBurst = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.57, audioContext.currentTime);
          gainSparkle1.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainSparkle2.gain.setValueAtTime(0.53, audioContext.currentTime);
          gainBurst.gain.setValueAtTime(0.55, audioContext.currentTime);

          flowLfo.connect(flowGain);
          flowGain.connect(oscillator.frequency);

          oscillator.connect(gainMain);
          sparkleOsc1.connect(gainSparkle1);
          sparkleOsc2.connect(gainSparkle2);
          burstNoise.connect(gainBurst);

          gainMain.connect(filterNode);
          gainSparkle1.connect(filterNode);
          gainSparkle2.connect(filterNode);
          gainBurst.connect(filterNode);

          oscillator.start();
          sparkleOsc1.start();
          sparkleOsc2.start();
          flowLfo.start();
          burstNoise.start();
        } else if (module === "baby") {
          // Baby: Gentle lullaby tones with soft heartbeat and womb-like sounds
          oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Gentle A note

          // Heartbeat simulation
          const heartOsc = audioContext.createOscillator();
          heartOsc.type = "sine";
          heartOsc.frequency.setValueAtTime(60, audioContext.currentTime);

          const heartLfo = audioContext.createOscillator();
          heartLfo.type = "sine";
          heartLfo.frequency.setValueAtTime(1.2, audioContext.currentTime); // 72 BPM

          const heartLfoGain = audioContext.createGain();
          heartLfoGain.gain.setValueAtTime(0.05, audioContext.currentTime);

          // Womb-like whooshing
          const whooshBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 4,
            audioContext.sampleRate,
          );
          const whooshOutput = whooshBuffer.getChannelData(0);
          for (let i = 0; i < whooshOutput.length; i++) {
            whooshOutput[i] =
              (Math.random() * 2 - 1) * 0.03 * Math.sin(i * 0.0005);
          }

          const whooshNoise = audioContext.createBufferSource();
          whooshNoise.buffer = whooshBuffer;
          whooshNoise.loop = true;

          // Gentle melody notes
          const melodyOsc = audioContext.createOscillator();
          melodyOsc.type = "triangle";
          melodyOsc.frequency.setValueAtTime(330, audioContext.currentTime); // E note

          const gainMain = audioContext.createGain();
          const gainHeart = audioContext.createGain();
          const gainWhoosh = audioContext.createGain();
          const gainMelody = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.56, audioContext.currentTime);
          gainHeart.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainWhoosh.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainMelody.gain.setValueAtTime(0.53, audioContext.currentTime);

          heartLfo.connect(heartLfoGain);
          heartLfoGain.connect(gainHeart.gain);

          oscillator.connect(gainMain);
          heartOsc.connect(gainHeart);
          whooshNoise.connect(gainWhoosh);
          melodyOsc.connect(gainMelody);

          gainMain.connect(filterNode);
          gainHeart.connect(filterNode);
          gainWhoosh.connect(filterNode);
          gainMelody.connect(filterNode);

          oscillator.start();
          heartOsc.start();
          heartLfo.start();
          whooshNoise.start();
          melodyOsc.start();
        } else if (module === "daydream") {
          // Daydream: Ethereal floating tones with dreamy reverb-like effects
          oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(174.61, audioContext.currentTime); // F note

          // Floating harmonics
          const floatOsc1 = audioContext.createOscillator();
          const floatOsc2 = audioContext.createOscillator();
          const floatOsc3 = audioContext.createOscillator();

          floatOsc1.type = "triangle";
          floatOsc2.type = "sine";
          floatOsc3.type = "sine";

          floatOsc1.frequency.setValueAtTime(261.63, audioContext.currentTime); // C
          floatOsc2.frequency.setValueAtTime(329.63, audioContext.currentTime); // E
          floatOsc3.frequency.setValueAtTime(392, audioContext.currentTime); // G

          // Dream-like modulation
          const dreamLfo1 = audioContext.createOscillator();
          const dreamLfo2 = audioContext.createOscillator();
          dreamLfo1.type = "sine";
          dreamLfo2.type = "sine";
          dreamLfo1.frequency.setValueAtTime(0.1, audioContext.currentTime);
          dreamLfo2.frequency.setValueAtTime(0.07, audioContext.currentTime);

          const dreamGain1 = audioContext.createGain();
          const dreamGain2 = audioContext.createGain();
          dreamGain1.gain.setValueAtTime(10, audioContext.currentTime);
          dreamGain2.gain.setValueAtTime(15, audioContext.currentTime);

          // Ethereal pad
          const padBuffer = audioContext.createBuffer(
            1,
            audioContext.sampleRate * 5,
            audioContext.sampleRate,
          );
          const padOutput = padBuffer.getChannelData(0);
          for (let i = 0; i < padOutput.length; i++) {
            padOutput[i] = Math.sin(i * 0.001) * Math.sin(i * 0.0007) * 0.02;
          }

          const padNoise = audioContext.createBufferSource();
          padNoise.buffer = padBuffer;
          padNoise.loop = true;

          const gainMain = audioContext.createGain();
          const gainFloat1 = audioContext.createGain();
          const gainFloat2 = audioContext.createGain();
          const gainFloat3 = audioContext.createGain();
          const gainPad = audioContext.createGain();

          gainMain.gain.setValueAtTime(0.55, audioContext.currentTime);
          gainFloat1.gain.setValueAtTime(0.54, audioContext.currentTime);
          gainFloat2.gain.setValueAtTime(0.53, audioContext.currentTime);
          gainFloat3.gain.setValueAtTime(0.52, audioContext.currentTime);
          gainPad.gain.setValueAtTime(0.56, audioContext.currentTime);

          dreamLfo1.connect(dreamGain1);
          dreamLfo2.connect(dreamGain2);
          dreamGain1.connect(floatOsc1.frequency);
          dreamGain2.connect(floatOsc2.frequency);

          oscillator.connect(gainMain);
          floatOsc1.connect(gainFloat1);
          floatOsc2.connect(gainFloat2);
          floatOsc3.connect(gainFloat3);
          padNoise.connect(gainPad);

          gainMain.connect(filterNode);
          gainFloat1.connect(filterNode);
          gainFloat2.connect(filterNode);
          gainFloat3.connect(filterNode);
          gainPad.connect(filterNode);

          oscillator.start();
          floatOsc1.start();
          floatOsc2.start();
          floatOsc3.start();
          dreamLfo1.start();
          dreamLfo2.start();
          padNoise.start();
        } else {
          // Default: Enhanced pink noise with gentle filtering
          const bufferSize = audioContext.sampleRate * 2;
          noiseBuffer = audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate,
          );
          const output = noiseBuffer.getChannelData(0);

          // Generate pink noise
          let b0 = 0,
            b1 = 0,
            b2 = 0,
            b3 = 0,
            b4 = 0,
            b5 = 0,
            b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.969 * b2 + white * 0.153852;
            b3 = 0.8665 * b3 + white * 0.3104856;
            b4 = 0.55 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.016898;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
          }

          noiseSource = audioContext.createBufferSource();
          noiseSource.buffer = noiseBuffer;
          noiseSource.loop = true;
          noiseSource.connect(filterNode);
          noiseSource.start();
        }
      } catch (error) {
        console.log("Audio initialization failed:", error);
      }
    };

    if (isActive && !isPaused) {
      initAudio();
    }

    return () => {
      try {
        if (oscillator) {
          oscillator.stop();
          oscillator.disconnect();
        }
        if (noiseSource) {
          noiseSource.stop();
          noiseSource.disconnect();
        }
        if (audioContext && audioContext.state !== "closed") {
          audioContext.close();
        }
      } catch (error) {
        console.log("Audio cleanup error:", error);
      }
    };
  }, [isActive, isPaused, module]);

  // Audio element
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
          <div className="w-full flex flex-col items-center justify-center gap-6 sm:gap-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-gray-400">
              {currentModule.title}
            </h2>
            <div className="flex items-center space-x-3 px-6 py-3 rounded-full bg-black/20 backdrop-blur-sm">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-mono text-gray-300 font-light">
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
                  onClick={async () => {
                    // Handle user interaction requirement for audio
                    if (!isPaused) {
                      setIsPaused(true);
                    } else {
                      setIsPaused(false);
                      // Ensure audio context is resumed on user interaction
                      try {
                        const AudioContext =
                          window.AudioContext ||
                          (window as any).webkitAudioContext;
                        if (AudioContext) {
                          const ctx = new AudioContext();
                          if (ctx.state === "suspended") {
                            await ctx.resume();
                          }
                          ctx.close();
                        }
                      } catch (error) {
                        console.log("Audio context resume failed:", error);
                      }
                    }
                  }}
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
