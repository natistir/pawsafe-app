// Utility function exports
export { SurfaceTemperatureCalculator } from './SurfaceTemperatureCalculator';

// Helper functions
export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit' = 'fahrenheit'): string => {
  const rounded = Math.round(temp * 10) / 10;
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${rounded}${symbol}`;
};

export const validateZipCode = (zipCode: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zipCode.trim());
};

export const formatLocation = (lat: number, lon: number): string => {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
};

export const getCurrentTimeOfDay = (): number => {
  return new Date().getHours();
};

export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};