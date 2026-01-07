
import { IframePreset, VantaEffectType, VantaPreset, VantaControlDef, UnsplashConfig } from './types';

export const THREE_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
export const P5_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js';

// Mapping Vanta effects to their CDN URLs
export const VANTA_SCRIPTS: Record<VantaEffectType, string> = {
  [VantaEffectType.WAVES]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.waves.min.js',
  [VantaEffectType.BIRDS]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.birds.min.js',
  [VantaEffectType.FOG]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.fog.min.js',
  [VantaEffectType.CLOUDS]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.clouds.min.js',
  [VantaEffectType.CLOUDS2]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.clouds2.min.js',
  [VantaEffectType.GLOBE]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.globe.min.js',
  [VantaEffectType.NET]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js',
  [VantaEffectType.CELLS]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.cells.min.js',
  [VantaEffectType.TRUNK]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.trunk.min.js',
  [VantaEffectType.TOPOLOGY]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.topology.min.js',
  [VantaEffectType.DOTS]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.dots.min.js',
  [VantaEffectType.RINGS]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.rings.min.js',
  [VantaEffectType.HALO]: 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.halo.min.js',
};

// Common control definitions re-used across effects
const COMMON_CONTROLS: VantaControlDef[] = [
    { id: 'color', label: 'Color', type: 'color', defaultValue: 0x000000 },
    { id: 'backgroundColor', label: 'Background', type: 'color', defaultValue: 0xffffff },
];

export const VANTA_EFFECT_PARAMS: Record<VantaEffectType, VantaControlDef[]> = {
    [VantaEffectType.WAVES]: [
        ...COMMON_CONTROLS,
        { id: 'shininess', label: 'Shininess', type: 'number', min: 0, max: 150, step: 1, defaultValue: 50 },
        { id: 'waveHeight', label: 'Wave Height', type: 'number', min: 0, max: 40, step: 0.5, defaultValue: 20 },
        { id: 'waveSpeed', label: 'Wave Speed', type: 'number', min: 0, max: 2, step: 0.05, defaultValue: 1 },
        { id: 'zoom', label: 'Zoom', type: 'number', min: 0.5, max: 2, step: 0.1, defaultValue: 1 },
    ],
    [VantaEffectType.BIRDS]: [
        { id: 'backgroundColor', label: 'Background', type: 'color', defaultValue: 0x0d1a26 },
        { id: 'color1', label: 'Bird Color 1', type: 'color', defaultValue: 0xff0000 },
        { id: 'color2', label: 'Bird Color 2', type: 'color', defaultValue: 0x00ff00 },
        { id: 'birdSize', label: 'Bird Size', type: 'number', min: 0.1, max: 4, step: 0.1, defaultValue: 1 },
        { id: 'wingSpan', label: 'Wing Span', type: 'number', min: 10, max: 60, step: 1, defaultValue: 30 },
        { id: 'speedLimit', label: 'Speed Limit', type: 'number', min: 1, max: 10, step: 1, defaultValue: 5 },
        { id: 'separation', label: 'Separation', type: 'number', min: 1, max: 100, step: 1, defaultValue: 20 },
        { id: 'alignment', label: 'Alignment', type: 'number', min: 1, max: 100, step: 1, defaultValue: 20 },
        { id: 'cohesion', label: 'Cohesion', type: 'number', min: 1, max: 100, step: 1, defaultValue: 20 },
        { id: 'quantity', label: 'Quantity', type: 'number', min: 1, max: 5, step: 1, defaultValue: 5 },
    ],
    [VantaEffectType.FOG]: [
        { id: 'baseColor', label: 'Base Color', type: 'color', defaultValue: 0x000000 },
        { id: 'highlightColor', label: 'Highlight', type: 'color', defaultValue: 0xffc300 },
        { id: 'midtoneColor', label: 'Midtone', type: 'color', defaultValue: 0xff1f00 },
        { id: 'lowlightColor', label: 'Lowlight', type: 'color', defaultValue: 0x2d00ff },
        { id: 'blurFactor', label: 'Blur', type: 'number', min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.6 },
        { id: 'speed', label: 'Speed', type: 'number', min: 0, max: 5, step: 0.1, defaultValue: 1 },
        { id: 'zoom', label: 'Zoom', type: 'number', min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
    ],
    [VantaEffectType.CLOUDS]: [
        { id: 'backgroundColor', label: 'Background', type: 'color', defaultValue: 0x000000 },
        { id: 'skyColor', label: 'Sky Color', type: 'color', defaultValue: 0x68b8d7 },
        { id: 'cloudColor', label: 'Cloud Color', type: 'color', defaultValue: 0xadc1de },
        { id: 'cloudShadowColor', label: 'Cloud Shadow', type: 'color', defaultValue: 0x183550 },
        { id: 'sunColor', label: 'Sun Color', type: 'color', defaultValue: 0xff9919 },
        { id: 'sunGlareColor', label: 'Sun Glare', type: 'color', defaultValue: 0xff6633 },
        { id: 'sunlightColor', label: 'Sunlight', type: 'color', defaultValue: 0xff9933 },
        { id: 'speed', label: 'Speed', type: 'number', min: 0, max: 3, step: 0.1, defaultValue: 1 },
    ],
    [VantaEffectType.CLOUDS2]: [
        { id: 'backgroundColor', label: 'Background', type: 'color', defaultValue: 0x000000 },
        { id: 'skyColor', label: 'Sky Color', type: 'color', defaultValue: 0x68b8d7 },
        { id: 'cloudColor', label: 'Cloud Color', type: 'color', defaultValue: 0xadc1de },
        { id: 'lightColor', label: 'Light Color', type: 'color', defaultValue: 0xffffff },
        { id: 'speed', label: 'Speed', type: 'number', min: 0, max: 3, step: 0.1, defaultValue: 1 },
        { id: 'texturePath', label: 'Noise Texture', type: 'select', options: ['default'], defaultValue: 'default' }, // Placeholder for advanced texture support
    ],
    [VantaEffectType.GLOBE]: [
        ...COMMON_CONTROLS,
        { id: 'color2', label: 'Accent Color', type: 'color', defaultValue: 0xffffff },
        { id: 'size', label: 'Size', type: 'number', min: 0.5, max: 2, step: 0.1, defaultValue: 1 },
    ],
    [VantaEffectType.NET]: [
        ...COMMON_CONTROLS,
        { id: 'points', label: 'Points', type: 'number', min: 1, max: 20, step: 1, defaultValue: 10 },
        { id: 'maxDistance', label: 'Max Distance', type: 'number', min: 10, max: 40, step: 1, defaultValue: 20 },
        { id: 'spacing', label: 'Spacing', type: 'number', min: 10, max: 20, step: 1, defaultValue: 15 },
        { id: 'showDots', label: 'Show Dots', type: 'boolean', defaultValue: true },
    ],
    [VantaEffectType.CELLS]: [
        ...COMMON_CONTROLS,
        { id: 'size', label: 'Size', type: 'number', min: 0.2, max: 5, step: 0.1, defaultValue: 1.0 },
        { id: 'speed', label: 'Speed', type: 'number', min: 0, max: 5, step: 0.1, defaultValue: 1.0 },
    ],
    [VantaEffectType.TRUNK]: [
        ...COMMON_CONTROLS,
        { id: 'spacing', label: 'Spacing', type: 'number', min: 0, max: 10, step: 0.5, defaultValue: 0 },
        { id: 'chaos', label: 'Chaos', type: 'number', min: 0, max: 10, step: 0.5, defaultValue: 1 },
    ],
    [VantaEffectType.TOPOLOGY]: [
        ...COMMON_CONTROLS,
    ],
    [VantaEffectType.DOTS]: [
        ...COMMON_CONTROLS,
        { id: 'color2', label: 'Color 2', type: 'color', defaultValue: 0xffffff },
        { id: 'size', label: 'Size', type: 'number', min: 1, max: 10, step: 0.5, defaultValue: 3 },
        { id: 'spacing', label: 'Spacing', type: 'number', min: 10, max: 100, step: 5, defaultValue: 20 },
        { id: 'showLines', label: 'Show Lines', type: 'boolean', defaultValue: true },
    ],
    [VantaEffectType.RINGS]: [
        ...COMMON_CONTROLS,
        { id: 'backgroundAlpha', label: 'BG Alpha', type: 'number', min: 0, max: 1, step: 0.05, defaultValue: 1 },
    ],
    [VantaEffectType.HALO]: [
        { id: 'baseColor', label: 'Base Color', type: 'color', defaultValue: 0x000000 },
        { id: 'backgroundColor', label: 'Background', type: 'color', defaultValue: 0x131a43 },
        { id: 'size', label: 'Size', type: 'number', min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
        { id: 'amplitude', label: 'Amplitude', type: 'number', min: 0, max: 5, step: 0.1, defaultValue: 1 },
    ],
};

export const IFRAME_PRESETS: IframePreset[] = [
  // After Dark CSS (Bryan Braun)
  {
    name: 'Flying Toasters',
    url: 'https://www.bryanbraun.com/after-dark-css/all/flying-toasters.html',
    category: 'After Dark'
  },
  {
    name: 'Starfield',
    url: 'https://www.bryanbraun.com/after-dark-css/all/warp.html',
    category: 'After Dark'
  },
  {
    name: 'Fish',
    url: 'https://www.bryanbraun.com/after-dark-css/all/fish.html',
    category: 'After Dark'
  },
  {
    name: 'Rain',
    url: 'https://www.bryanbraun.com/after-dark-css/all/rainstorm.html',
    category: 'After Dark'
  },
    {
    name: 'Hard Rain',
    url: 'https://www.bryanbraun.com/after-dark-css/all/hard-rain.html',
    category: 'After Dark'
  },
  // Miscellaneous
  {
    name: 'Hacker Typer',
    url: 'https://hackertyper.net/',
    category: 'Other'
  },
  {
    name: 'Flip Clock',
    url: 'https://flipclock.us/',
    category: 'Other'
  }
];

export const DEFAULT_VANTA_CONFIG = {
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  // Default values that might be overridden
  color: 0x000000,
  backgroundColor: 0xffffff,
};

export const DEFAULT_UNSPLASH_CONFIG: UnsplashConfig = {
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop',
    keywords: 'nature,landscape,mountain',
};

export const DEFAULT_VANTA_PRESETS: VantaPreset[] = [
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    isDefault: true,
    config: {
      ...DEFAULT_VANTA_CONFIG,
      effect: VantaEffectType.WAVES,
      color: 0x111111,
      backgroundColor: 0x011c3a,
      waveSpeed: 0.8,
      shininess: 35,
      waveHeight: 20,
    }
  },
  {
    id: 'cyber-net',
    name: 'Cyber Net',
    isDefault: true,
    config: {
      ...DEFAULT_VANTA_CONFIG,
      effect: VantaEffectType.NET,
      color: 0x3fe8ff,
      backgroundColor: 0x0f0e15,
      points: 12,
      maxDistance: 22,
      spacing: 16,
      scale: 1.2,
    }
  },
  {
    id: 'sunny-clouds',
    name: 'Sunny Clouds',
    isDefault: true,
    config: {
      ...DEFAULT_VANTA_CONFIG,
      effect: VantaEffectType.CLOUDS,
      skyColor: 0x68b8d7,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550,
      sunColor: 0xff9919,
      sunGlareColor: 0xff6633,
      sunlightColor: 0xff9933,
      speed: 1.0,
    }
  },
  {
    id: 'matrix-fog',
    name: 'Matrix Fog',
    isDefault: true,
    config: {
      ...DEFAULT_VANTA_CONFIG,
      effect: VantaEffectType.FOG,
      highlightColor: 0x00ff00,
      midtoneColor: 0x005500,
      lowlightColor: 0x001100,
      baseColor: 0x000000,
      blurFactor: 0.6,
      speed: 2.5,
      zoom: 1.5,
    }
  },
  {
    id: 'golden-rings',
    name: 'Golden Rings',
    isDefault: true,
    config: {
      ...DEFAULT_VANTA_CONFIG,
      effect: VantaEffectType.RINGS,
      color: 0xffd700,
      backgroundColor: 0x1a1a1a,
      backgroundAlpha: 1,
    }
  }
];
