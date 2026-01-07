export const loadScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

export const checkThreeLoaded = (): boolean => {
  // @ts-ignore
  return typeof window.THREE !== 'undefined';
};

export const checkVantaLoaded = (effectName: string): boolean => {
   // @ts-ignore
   return typeof window.VANTA !== 'undefined' && typeof window.VANTA[effectName] !== 'undefined';
}