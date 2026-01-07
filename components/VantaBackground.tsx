import React, { useEffect, useRef, useState } from 'react';
import { THREE_JS_URL, VANTA_SCRIPTS, P5_JS_URL } from '../constants';
import { loadScript } from '../utils/scriptLoader';
import { VantaConfig, VantaEffectType } from '../types';

interface VantaBackgroundProps {
  config: VantaConfig;
}

const SAFE_UPDATE_KEYS = new Set([
  'color', 'color2', 'backgroundColor', 'speed', 
  'mouseControls', 'touchControls', 'gyroControls', 
  'minHeight', 'minWidth', 'scale', 'scaleMobile',
  'zoom' // Some effects support zoom via setOptions
]);

const VantaBackground: React.FC<VantaBackgroundProps> = ({ config }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track the last config successfully applied to the effect
  const lastAppliedConfig = useRef<VantaConfig | null>(null);
  // Timer for debouncing structural updates
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initVanta = async (cfg: VantaConfig) => {
    try {
      setLoading(true);
      setError(null);
      
      // We must check if there is an existing effect to destroy, 
      // but we should access the LATEST vantaEffect from state/ref or ensure sequentiality.
      // Since initVanta is async, we rely on the clean-up of the effect hook or explicit destroy here.
      // Ideally, we'd pass the current effect instance to destroy, but React state setter is easier.
      
      const effectType = cfg.effect;
      const isP5Effect = [VantaEffectType.TRUNK, VantaEffectType.TOPOLOGY].includes(effectType);

      if (isP5Effect) {
        await loadScript(P5_JS_URL, 'p5-js');
      } else {
        await loadScript(THREE_JS_URL, 'three-js');
      }

      const scriptUrl = VANTA_SCRIPTS[effectType];
      if (!scriptUrl) {
        throw new Error(`Unknown effect type: ${effectType}`);
      }
      await loadScript(scriptUrl, `vanta-${effectType.toLowerCase()}`);

      if (mountRef.current) {
        // @ts-ignore
        const VANTA = window.VANTA;
        if (!VANTA) throw new Error("VANTA global not found");

        let effectFactory;
        switch (effectType) {
          case VantaEffectType.WAVES: effectFactory = VANTA.WAVES; break;
          case VantaEffectType.BIRDS: effectFactory = VANTA.BIRDS; break;
          case VantaEffectType.FOG: effectFactory = VANTA.FOG; break;
          case VantaEffectType.CLOUDS: effectFactory = VANTA.CLOUDS; break;
          case VantaEffectType.CLOUDS2: effectFactory = VANTA.CLOUDS2; break;
          case VantaEffectType.GLOBE: effectFactory = VANTA.GLOBE; break;
          case VantaEffectType.NET: effectFactory = VANTA.NET; break;
          case VantaEffectType.CELLS: effectFactory = VANTA.CELLS; break;
          case VantaEffectType.TRUNK: effectFactory = VANTA.TRUNK; break;
          case VantaEffectType.TOPOLOGY: effectFactory = VANTA.TOPOLOGY; break;
          case VantaEffectType.DOTS: effectFactory = VANTA.DOTS; break;
          case VantaEffectType.RINGS: effectFactory = VANTA.RINGS; break;
          case VantaEffectType.HALO: effectFactory = VANTA.HALO; break;
          default: throw new Error(`Effect factory not found for ${effectType}`);
        }

        if (!effectFactory) throw new Error("Effect factory is undefined");

        // Destroy old effect if it exists right before creating new one to minimize flicker
        // We use the functional update to access the absolute latest state if needed, 
        // but since this is async, we just use a callback reference or the standard flow.
        // Better: use the effect instance returned from the previous promise? 
        // For simplicity: we use the state setter callback to ensure we destroy the *current* one.
        setVantaEffect((prevEffect: any) => {
            if (prevEffect) prevEffect.destroy();
            
            const newEffect = effectFactory({
                el: mountRef.current,
                ...cfg
            });
            return newEffect;
        });
        
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Vanta initialization failed:", err);
      setError(err.message || "Failed to load effect");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine the type of update
    const prev = lastAppliedConfig.current;
    
    // First run or effect type change always requires init
    if (!prev || prev.effect !== config.effect) {
        initVanta(config);
        lastAppliedConfig.current = config;
        return;
    }

    // Check for structural changes
    let structuralChange = false;
    const allKeys = new Set([...Object.keys(prev), ...Object.keys(config)]);
    for (const key of allKeys) {
        if (!SAFE_UPDATE_KEYS.has(key)) {
            if (prev[key] !== config[key]) {
                structuralChange = true;
                break;
            }
        }
    }

    if (structuralChange) {
        // Debounce structural changes (e.g. dragging a slider for "points" or "waveHeight")
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        debounceTimer.current = setTimeout(() => {
            initVanta(config);
            lastAppliedConfig.current = config;
        }, 400); // 400ms delay to wait for slider to settle
    } else {
        // Safe update (color, speed) - apply immediately
        if (vantaEffect) {
            vantaEffect.setOptions(config);
            lastAppliedConfig.current = config;
        }
    }

    // Cleanup timer on unmount or next run
    return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [config, vantaEffect]); // Dependency on vantaEffect ensures we don't miss setting options if it just loaded

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setVantaEffect((current: any) => {
          if (current) current.destroy();
          return null;
      });
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full absolute top-0 left-0 bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-white/50 pointer-events-none">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-red-400 p-4 text-center pointer-events-none">
            <p className="bg-black/50 p-2 rounded">Failed to load effect: {error}</p>
        </div>
      )}
    </div>
  );
};

export default VantaBackground;