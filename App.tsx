
import React, { useState, useEffect, useRef } from 'react';
import { AppConfig, SaverMode, VantaEffectType } from './types';
import { DEFAULT_VANTA_CONFIG, IFRAME_PRESETS, DEFAULT_VANTA_PRESETS, DEFAULT_UNSPLASH_CONFIG } from './constants';
import VantaBackground from './components/VantaBackground';
import IframeBackground from './components/IframeBackground';
import UnsplashBackground from './components/UnsplashBackground';
import SettingsPanel from './components/SettingsPanel';
import ClockOverlay from './components/ClockOverlay';

const DEFAULT_CONFIG: AppConfig = {
  mode: SaverMode.IFRAME,
  iframeUrl: IFRAME_PRESETS[0].url,
  vantaConfig: {
    ...DEFAULT_VANTA_CONFIG,
    effect: VantaEffectType.WAVES,
    color: 0x1e3a8a, // Blueish
    backgroundColor: 0x000000,
  },
  unsplashConfig: DEFAULT_UNSPLASH_CONFIG,
  savedVantaPresets: DEFAULT_VANTA_PRESETS,
  showClock: false,
  clockFormat: '12h',
  hideUiIdle: false,
};

const STORAGE_KEY = 'screensaver_config_v1';
const IDLE_TIMEOUT_MS = 3000;

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load config from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        setConfig((prev) => {
            // Robust merging strategy
            const mergedConfig: AppConfig = {
                ...prev,
                ...parsed,
                // Deep merge nested configs to preserve defaults for new fields
                vantaConfig: { ...prev.vantaConfig, ...(parsed.vantaConfig || {}) },
                unsplashConfig: { ...prev.unsplashConfig, ...(parsed.unsplashConfig || {}) },
            };

            // Specific handling for arrays or complex objects
            // If savedVantaPresets exists in storage (even if empty), use it. 
            // Otherwise use defaults.
            if (Array.isArray(parsed.savedVantaPresets)) {
                mergedConfig.savedVantaPresets = parsed.savedVantaPresets;
            } else {
                mergedConfig.savedVantaPresets = DEFAULT_VANTA_PRESETS;
            }

            return mergedConfig;
        });
      }
    } catch (e) {
      console.error("Failed to load config", e);
    }
    setIsLoaded(true);
  }, []);

  // Save config to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config, isLoaded]);

  // Idle Detection
  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, IDLE_TIMEOUT_MS);
    };

    // Initial trigger
    resetIdle();

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('touchstart', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  if (!isLoaded) return null;

  return (
    <div className={`relative w-screen h-screen overflow-hidden bg-black text-white ${config.hideUiIdle && isIdle ? 'cursor-none' : ''}`}>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {config.mode === SaverMode.IFRAME && (
          <IframeBackground url={config.iframeUrl} />
        )}
        {config.mode === SaverMode.VANTA && (
          <VantaBackground config={config.vantaConfig} />
        )}
        {config.mode === SaverMode.UNSPLASH && (
          <UnsplashBackground config={config.unsplashConfig} />
        )}
      </div>

      {/* Overlays Layer */}
      {config.showClock && (
        <ClockOverlay format={config.clockFormat} />
      )}

      {/* UI Layer */}
      <div className={`relative z-50 transition-opacity duration-500 ${config.hideUiIdle && isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SettingsPanel config={config} onConfigChange={setConfig} />
      </div>
    </div>
  );
};

export default App;
