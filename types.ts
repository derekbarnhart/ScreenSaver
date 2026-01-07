
export enum SaverMode {
  IFRAME = 'IFRAME',
  VANTA = 'VANTA',
  UNSPLASH = 'UNSPLASH',
}

export enum VantaEffectType {
  WAVES = 'WAVES',
  BIRDS = 'BIRDS',
  FOG = 'FOG',
  CLOUDS = 'CLOUDS',
  CLOUDS2 = 'CLOUDS2',
  GLOBE = 'GLOBE',
  NET = 'NET',
  CELLS = 'CELLS',
  TRUNK = 'TRUNK',
  TOPOLOGY = 'TOPOLOGY',
  DOTS = 'DOTS',
  RINGS = 'RINGS',
  HALO = 'HALO',
}

export interface IframePreset {
  name: string;
  url: string;
  category: string;//'Geometric' | 'Retro' | 'Nature' | 'Abstract' | 'Other';
}

export interface VantaConfig {
  effect: VantaEffectType;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  scale: number;
  scaleMobile: number;
  // Allow dynamic properties for effect-specific configs
  [key: string]: any;
}

export interface VantaPreset {
  id: string;
  name: string;
  config: VantaConfig;
  isDefault?: boolean;
}

export interface UnsplashConfig {
  imageUrl: string;
  keywords: string;
}

export interface AppConfig {
  mode: SaverMode;
  iframeUrl: string;
  vantaConfig: VantaConfig;
  unsplashConfig: UnsplashConfig;
  savedVantaPresets: VantaPreset[];
  showClock: boolean;
  clockFormat: '12h' | '24h';
  hideUiIdle: boolean;
}

export type ControlType = 'color' | 'number' | 'boolean' | 'select';

export interface VantaControlDef {
  id: string;
  label: string;
  type: ControlType;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue?: any;
}
