export const loadGoogleMapsScript = (): Promise<void> => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return;
  
      // If script already exists, resolve
      if (document.querySelector('#google-maps')) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.id = 'google-maps';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
  
      document.body.appendChild(script);
    });
  };
  