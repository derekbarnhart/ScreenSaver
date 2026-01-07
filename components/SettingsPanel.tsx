
import React, { useState } from 'react';
import { AppConfig, SaverMode, VantaEffectType, IframePreset, VantaPreset, VantaControlDef } from '../types';
import { IFRAME_PRESETS, VANTA_EFFECT_PARAMS } from '../constants';
import { Settings, X, Palette, MousePointer2, Save, Trash2, Plus, ZoomIn, Monitor, Globe, Image as ImageIcon, RefreshCw, Clock, EyeOff } from 'lucide-react';

interface SettingsPanelProps {
  config: AppConfig;
  onConfigChange: (newConfig: AppConfig) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleModeChange = (mode: SaverMode) => {
    onConfigChange({ ...config, mode });
  };

  const handleUrlChange = (url: string) => {
    onConfigChange({ ...config, iframeUrl: url });
  };

  const handleVantaChange = (key: string, value: any) => {
    onConfigChange({
      ...config,
      vantaConfig: {
        ...config.vantaConfig,
        [key]: value,
      },
    });
  };

  // Unsplash Handlers
  const handleUnsplashKeywordsChange = (keywords: string) => {
      onConfigChange({
          ...config,
          unsplashConfig: {
              ...config.unsplashConfig,
              keywords
          }
      });
  };

  const handleRefreshUnsplashImage = () => {
      // Generate a random cache buster
      const cacheBuster = Date.now();
      const keywords = config.unsplashConfig.keywords || 'nature,abstract';
      
      const newUrl = `https://source.unsplash.com/random/1920x1080/?${encodeURIComponent(keywords)}&sig=${cacheBuster}`;
      
      onConfigChange({
          ...config,
          unsplashConfig: {
              ...config.unsplashConfig,
              imageUrl: newUrl
          }
      });
  };

  const handleEffectChange = (effect: VantaEffectType) => {
    const newConfig = { ...config.vantaConfig, effect };
    
    // Optional: Reset values to defaults defined in VANTA_EFFECT_PARAMS
    const defaults = VANTA_EFFECT_PARAMS[effect] || [];
    defaults.forEach(def => {
        if (newConfig[def.id] === undefined && def.defaultValue !== undefined) {
            newConfig[def.id] = def.defaultValue;
        }
    });

    onConfigChange({
        ...config,
        vantaConfig: newConfig
    });
  };

  const handlePresetSelect = (preset: IframePreset) => {
      onConfigChange({ ...config, iframeUrl: preset.url });
  };

  // Vanta Preset Logic
  const handleLoadVantaPreset = (preset: VantaPreset) => {
      onConfigChange({
          ...config,
          vantaConfig: { ...preset.config }
      });
  };

  const handleSaveVantaPreset = () => {
      if (!newPresetName.trim()) return;

      const newPreset: VantaPreset = {
          id: Date.now().toString(),
          name: newPresetName.trim(),
          config: { ...config.vantaConfig },
          isDefault: false
      };

      onConfigChange({
          ...config,
          savedVantaPresets: [...config.savedVantaPresets, newPreset]
      });
      setNewPresetName('');
      setIsSaving(false);
  };

  const handleDeleteVantaPreset = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onConfigChange({
          ...config,
          savedVantaPresets: config.savedVantaPresets.filter(p => p.id !== id)
      });
  };

  // Helper to render dynamic controls
  const renderControl = (def: VantaControlDef) => {
      const value = config.vantaConfig[def.id] ?? def.defaultValue;

      switch (def.type) {
          case 'color':
              return (
                <div key={def.id} className="flex items-center justify-between">
                    <label className="text-sm text-gray-300 flex items-center gap-2">
                    <Palette size={16} /> {def.label}
                    </label>
                    <input 
                        type="color"
                        value={'#' + (value || 0x000000).toString(16).padStart(6, '0')}
                        onChange={(e) => handleVantaChange(def.id, parseInt(e.target.value.replace('#', ''), 16))}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                    />
                </div>
              );
          case 'number':
              return (
                <div key={def.id} className="space-y-2">
                    <div className="flex justify-between">
                            <label className="text-sm text-gray-300">{def.label}</label>
                            <span className="text-xs text-gray-500">{typeof value === 'number' ? value.toFixed(1) : value}</span>
                    </div>
                    <input 
                        type="range"
                        min={def.min}
                        max={def.max}
                        step={def.step}
                        value={value || 0}
                        onChange={(e) => handleVantaChange(def.id, parseFloat(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
              );
          case 'boolean':
              return (
                <div key={def.id} className="space-y-2 pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => handleVantaChange(def.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {def.label}
                    </span>
                    </label>
                </div>
              );
          case 'select':
              return (
                  <div key={def.id} className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">{def.label}</label>
                      <select
                          value={value}
                          onChange={(e) => handleVantaChange(def.id, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                      >
                          {def.options?.map(opt => (
                              <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                          ))}
                      </select>
                  </div>
              );
          default:
              return null;
      }
  };

  // Group presets by category
  const groupedPresets = IFRAME_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.category]) acc[preset.category] = [];
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, IframePreset[]>);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all shadow-lg z-50 group border border-white/10"
        title="Settings"
      >
        <Settings size={24} className="group-hover:rotate-45 transition-transform duration-500" />
      </button>
    );
  }

  const currentEffectParams = VANTA_EFFECT_PARAMS[config.vantaConfig.effect] || [];

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-black/80 backdrop-blur-xl border-l border-white/10 text-white z-50 shadow-2xl flex flex-col transition-transform duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
        <h2 className="text-xl font-semibold tracking-tight">Configuration</h2>
        <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Mode Selection Dropdown */}
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Application Mode</label>
            <div className="relative">
                <select
                    value={config.mode}
                    onChange={(e) => handleModeChange(e.target.value as SaverMode)}
                    className="w-full bg-blue-600/20 border border-blue-500/50 rounded-xl px-4 py-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-white"
                >
                    <option value={SaverMode.IFRAME} className="bg-gray-900">Web Page (Iframe)</option>
                    <option value={SaverMode.VANTA} className="bg-gray-900">3D Effects (Vanta.js)</option>
                    <option value={SaverMode.UNSPLASH} className="bg-gray-900">Random Image (Unsplash)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-300">
                    {config.mode === SaverMode.IFRAME && <Globe size={20} />}
                    {config.mode === SaverMode.VANTA && <Monitor size={20} />}
                    {config.mode === SaverMode.UNSPLASH && <ImageIcon size={20} />}
                </div>
            </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        {/* IFRAME MODE CONTENT */}
        {config.mode === SaverMode.IFRAME && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">Custom URL</label>
                    <input 
                        type="url" 
                        value={config.iframeUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Web Presets</label>
                        <div className="space-y-4">
                        {Object.entries(groupedPresets).map(([category, presets]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{category}</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {presets.map(preset => (
                                        <button
                                            key={preset.name}
                                            onClick={() => handlePresetSelect(preset)}
                                            className={`text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between group ${config.iframeUrl === preset.url ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                                        >
                                            <span>{preset.name}</span>
                                            {config.iframeUrl === preset.url && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        </div>
                </div>
            </div>
        )}

        {/* UNSPLASH MODE CONTENT */}
        {config.mode === SaverMode.UNSPLASH && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        Displays random high-quality images from Unsplash based on keywords.
                    </p>
                    
                    <button 
                        onClick={handleRefreshUnsplashImage}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors mb-4"
                    >
                        <RefreshCw size={18} /> Load New Image
                    </button>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Keywords (comma separated)</label>
                        <input 
                            type="text" 
                            value={config.unsplashConfig.keywords}
                            onChange={(e) => handleUnsplashKeywordsChange(e.target.value)}
                            placeholder="nature, space, architecture..."
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                         <p className="text-xs text-gray-500">
                            Updates on next refresh.
                        </p>
                    </div>
                 </div>
             </div>
        )}

        {/* VANTA MODE CONTENT */}
        {config.mode === SaverMode.VANTA && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Saved Presets Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                         <label className="text-sm font-medium text-gray-300">Saved Presets</label>
                         {!isSaving && (
                            <button 
                                onClick={() => setIsSaving(true)} 
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                <Save size={14} /> Save Current
                            </button>
                         )}
                    </div>

                    {isSaving && (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                            <input 
                                type="text" 
                                value={newPresetName}
                                onChange={(e) => setNewPresetName(e.target.value)}
                                placeholder="Preset Name..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button 
                                onClick={handleSaveVantaPreset}
                                disabled={!newPresetName.trim()}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg px-3 py-2"
                            >
                                <Plus size={16} />
                            </button>
                            <button 
                                onClick={() => setIsSaving(false)}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {config.savedVantaPresets.map(preset => (
                            <div 
                                key={preset.id}
                                onClick={() => handleLoadVantaPreset(preset)}
                                className={`relative group cursor-pointer p-3 rounded-lg border transition-all ${
                                    config.vantaConfig.effect === preset.config.effect && 
                                    // Heuristic check for visual feedback. Ideally track 'selectedPresetId'
                                    config.vantaConfig.effect === preset.config.effect
                                    ? 'bg-purple-600/20 border-purple-500' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <div className="text-xs font-medium truncate pr-4">{preset.name}</div>
                                <div className="text-[10px] text-gray-500 uppercase mt-1">{preset.config.effect}</div>
                                
                                {!preset.isDefault && (
                                    <button 
                                        onClick={(e) => handleDeleteVantaPreset(preset.id, e)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-white/10 my-4" />

                {/* Effect Selector */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">Visual Effect</label>
                    <select 
                        value={config.vantaConfig.effect}
                        onChange={(e) => handleEffectChange(e.target.value as VantaEffectType)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                    >
                        {Object.keys(VantaEffectType).map(type => (
                            <option key={type} value={type} className="bg-gray-900">{type}</option>
                        ))}
                    </select>
                </div>

                {/* Dynamic Effect Parameters */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Effect Parameters</h3>
                    {currentEffectParams.map(renderControl)}
                </div>

                {/* System / Common Controls */}
                 <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                             <label className="text-sm text-gray-300 flex items-center gap-2">
                                <ZoomIn size={16} /> Resolution Scale
                             </label>
                             <span className="text-xs text-gray-500">{config.vantaConfig.scale?.toFixed(1)}x</span>
                        </div>
                        <input 
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={config.vantaConfig.scale || 1}
                            onChange={(e) => handleVantaChange('scale', parseFloat(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                     <div className="space-y-2 pt-2">
                         <label className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                                type="checkbox"
                                checked={config.vantaConfig.mouseControls}
                                onChange={(e) => handleVantaChange('mouseControls', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                            />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                                <MousePointer2 size={16} /> Mouse Interaction
                            </span>
                         </label>
                     </div>
                 </div>
            </div>
        )}
        
        {/* GLOBAL SETTINGS (Applied to all modes) */}
        <div className="h-px bg-white/10 my-4" />
        <div className="space-y-6">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Global Settings</h3>
             
             <div className="space-y-4">
                 {/* Clock Settings */}
                 <div className="flex flex-col space-y-3">
                     <label className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                            type="checkbox"
                            checked={config.showClock}
                            onChange={(e) => onConfigChange({ ...config, showClock: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                            <Clock size={16} /> Show Digital Clock
                        </span>
                     </label>

                    {config.showClock && (
                        <div className="pl-7 space-y-2 animate-in fade-in slide-in-from-top-1">
                            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 w-fit">
                                <button
                                    onClick={() => onConfigChange({ ...config, clockFormat: '12h' })}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${config.clockFormat === '12h' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                >
                                    12H
                                </button>
                                <button
                                    onClick={() => onConfigChange({ ...config, clockFormat: '24h' })}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${config.clockFormat === '24h' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                >
                                    24H
                                </button>
                            </div>
                        </div>
                    )}
                 </div>

                 {/* Hide UI Idle */}
                 <div className="flex flex-col space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                            type="checkbox"
                            checked={config.hideUiIdle}
                            onChange={(e) => onConfigChange({ ...config, hideUiIdle: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                            <EyeOff size={16} /> Auto-hide UI when idle
                        </span>
                    </label>
                 </div>
             </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 text-center text-xs text-gray-500 bg-black/20">
         ScreenSaver Pro v1.5
      </div>
    </div>
  );
};

export default SettingsPanel;
