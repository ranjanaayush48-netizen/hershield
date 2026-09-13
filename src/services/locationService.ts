export interface RealLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  isRealGps: boolean;
  status: 'granted' | 'denied' | 'prompt' | 'unavailable' | 'loading';
  errorMessage?: string;
}

export const LocationService = {
  /**
   * Request live coordinates using W3C browser Geolocation API.
   * Enforces fresh GPS fix (maximumAge: 0), never fabricates fake coordinates,
   * and strictly rejects 0,0 or invalid coordinates.
   */
  async getCurrentPosition(options?: PositionOptions): Promise<RealLocationData> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser environment.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          // Strictly reject 0,0 or invalid coordinates
          if (
            typeof lat !== 'number' ||
            typeof lon !== 'number' ||
            isNaN(lat) ||
            isNaN(lon) ||
            (lat === 0 && lon === 0) ||
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
          ) {
            reject(new Error('Device GPS reported invalid coordinates (0.0000, 0.0000). A valid non-zero GPS fix is required.'));
            return;
          }

          // Reverse geocode via OpenStreetMap Nominatim with a fast timeout so SOS is never delayed
          let address = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
              { 
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
              }
            );
            clearTimeout(timeoutId);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData.display_name) {
                address = geoData.display_name;
              }
            }
          } catch (e) {
            // Keep default coordinate string if reverse geocoding is unavailable or times out
          }

          resolve({
            latitude: lat,
            longitude: lon,
            accuracy,
            timestamp: position.timestamp || Date.now(),
            address,
            isRealGps: true,
            status: 'granted',
          });
        },
        (error) => {
          let errorMsg = 'Unable to retrieve your current location.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location access was denied. Please allow location permissions in your browser settings to share your live coordinates during emergencies.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is currently unavailable from your device GPS sensors.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out. Please check your GPS signal.';
          }

          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Force fresh satellite/device GPS fix immediately before activation
          ...options
        }
      );
    });
  },

  /**
   * Watch live GPS movement during active sharing sessions
   */
  watchPosition(callback: (location: RealLocationData) => void): number | null {
    if (!navigator.geolocation) return null;

    return navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        if (lat !== 0 && lon !== 0) {
          callback({
            latitude: lat,
            longitude: lon,
            accuracy: Math.round(position.coords.accuracy),
            timestamp: position.timestamp || Date.now(),
            isRealGps: true,
            status: 'granted',
          });
        }
      },
      (error) => {
        console.warn('[LocationService] Watch position error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  },

  clearWatch(watchId: number) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
};
