// Environment configuration
// Replace with your actual WeatherAPI key from https://weatherapi.com

export const API_CONFIG = {
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || 'your-weather-api-key-here',
  WEATHER_API_BASE_URL: 'https://api.weatherapi.com/v1',
  
  // API endpoints
  ENDPOINTS: {
    CURRENT_WEATHER: '/current.json',
    FORECAST: '/forecast.json',
    SEARCH: '/search.json',
  },
  
  // Default settings
  DEFAULTS: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
  }
};

// Temperature thresholds for paw safety (in Celsius)
export const PAW_SAFETY_THRESHOLDS = {
  SAFE: 43,        // Below 43°C (109°F)
  CAUTION: 49,     // 43-49°C (109-120°F)
  DANGEROUS: 60,   // 49-60°C (120-140°F)
  EXTREME: 60,     // Above 60°C (140°F)
};

// Surface type multipliers for temperature calculation
export const SURFACE_MULTIPLIERS = {
  asphalt: 1.4,    // Hottest surface
  concrete: 1.2,   // Second hottest
  metal: 1.5,      // Can get extremely hot
  sand: 1.1,       // Moderately hot
  grass: 0.8,      // Coolest surface
};