// Location related types
export interface LocationData {
  latitude: number;
  longitude: number;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

// Weather and temperature data
export interface WeatherData {
  temperature: number; // Air temperature in Celsius
  temperatureF: number; // Air temperature in Fahrenheit
  humidity: number; // Humidity percentage
  windSpeed: number; // Wind speed in km/h
  uvIndex: number; // UV index
  surfaceTemp: number; // Calculated surface temperature in Celsius
  surfaceTempF: number; // Calculated surface temperature in Fahrenheit
  isSafeForPaws: boolean; // Whether it's safe for dog paws
  riskLevel: RiskLevel; // Risk assessment
  recommendation: string; // Human readable recommendation
}

// Risk levels for paw safety
export type RiskLevel = 'safe' | 'caution' | 'dangerous' | 'extreme';

// API response from weather service
export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
  };
}

// Surface temperature calculation factors
export interface SurfaceCalculationFactors {
  airTemp: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  cloudCover: number;
  surfaceType: SurfaceType;
  timeOfDay: number; // 0-23 hour
}

export type SurfaceType = 'asphalt' | 'concrete' | 'grass' | 'sand' | 'metal';

// Temperature thresholds for paw safety (in Celsius)
export interface PawSafetyThresholds {
  safe: number; // < 43°C (109°F)
  caution: number; // 43-49°C (109-120°F)
  dangerous: number; // 49-60°C (120-140°F)
  extreme: number; // > 60°C (140°F)
}

// User preferences
export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  defaultSurfaceType: SurfaceType;
  notificationsEnabled: boolean;
  locationServicesEnabled: boolean;
}

// Navigation props
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Location: { 
    latitude?: number; 
    longitude?: number; 
    zipCode?: string;
  };
  Weather: { 
    latitude?: number; 
    longitude?: number; 
    zipCode?: string;
  };
  Settings: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type LocationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Location'>;
export type LocationScreenRouteProp = RouteProp<RootStackParamList, 'Location'>;
export type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Weather'>;
export type WeatherScreenRouteProp = RouteProp<RootStackParamList, 'Weather'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;