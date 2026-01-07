
import React, { useState } from 'react';
import { UnsplashConfig } from '../types';

interface UnsplashBackgroundProps {
  config: UnsplashConfig;
}

const UnsplashBackground: React.FC<UnsplashBackgroundProps> = ({ config }) => {
  const [loaded, setLoaded] = useState(false);

  // When url changes, reset loaded state
  React.useEffect(() => {
    setLoaded(false);
  }, [config.imageUrl]);

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden bg-black flex items-center justify-center">
      
      {/* Loading Indicator */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-white/30">
             <div className="animate-spin h-10 w-10 border-4 border-white/20 border-t-white rounded-full"></div>
        </div>
      )}

      {/* Image Layer */}
      <img
        src={config.imageUrl}
        alt="Unsplash Background"
        className={`w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
      
      {/* Optional vignette overlay for better text readability if we had text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default UnsplashBackground;
