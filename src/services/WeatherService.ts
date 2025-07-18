import axios, { AxiosInstance } from 'axios';

export interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: [
    {
      main: string;
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  name: string;
}

export class WeatherService {
  private api: AxiosInstance;
  private apiKey: string;

  constructor() {
    // Replace with your OpenWeather API key
    this.apiKey = '92c7312cf5954f1e7e3252bf3e62fa0b';
    
    this.api = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5',
      timeout: 10000,
    });
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<OpenWeatherResponse> {
    try {
      const response = await this.api.get('/weather', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric', // Use Celsius
        },
      });
      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByZipCode(zipCode: string): Promise<OpenWeatherResponse> {
    try {
      const response = await this.api.get('/weather', {
        params: {
          zip: `${zipCode},US`,
          appid: this.apiKey,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  calculateSurfaceTemperature(airTemp: number, humidity: number, windSpeed: number, cloudCover: number): {
    surfaceTemp: number;
    surfaceTempF: number;
    riskLevel: string;
    recommendation: string;
  } {
    // Surface temperature calculation for asphalt
    let surfaceTemp = airTemp;
    
    // Add heat based on conditions
    surfaceTemp += 15; // Base asphalt heating
    surfaceTemp += (100 - humidity) * 0.1; // Lower humidity = hotter
    surfaceTemp -= windSpeed * 0.5; // Wind cooling effect
    surfaceTemp -= cloudCover * 0.15; // Cloud cooling effect
    
    const surfaceTempF = (surfaceTemp * 9/5) + 32;
    
    let riskLevel = 'safe';
    let recommendation = 'Safe for walking!';
    
    if (surfaceTemp > 43) {
      riskLevel = 'caution';
      recommendation = 'Use caution - consider dog booties';
    }
    if (surfaceTemp > 49) {
      riskLevel = 'dangerous';
      recommendation = 'Dangerous! Avoid hot surfaces';
    }
    if (surfaceTemp > 60) {
      riskLevel = 'extreme';
      recommendation = 'EXTREME DANGER - Stay indoors!';
    }
    
    return {
      surfaceTemp: Math.round(surfaceTemp * 10) / 10,
      surfaceTempF: Math.round(surfaceTempF * 10) / 10,
      riskLevel,
      recommendation,
    };
  }
}
