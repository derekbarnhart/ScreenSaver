import React from 'react';

interface IframeBackgroundProps {
  url: string;
}

const IframeBackground: React.FC<IframeBackgroundProps> = ({ url }) => {
  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden bg-black">
      <iframe
        title="Background"
        src={url}
        className="w-full h-full border-0 block"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Overlay to prevent interactions if desired, but for screensaver interactive is often nice */}
    </div>
  );
};

export default IframeBackground;