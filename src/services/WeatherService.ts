import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/env';
import { WeatherApiResponse } from '../types';

export class WeatherService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.WEATHER_API_BASE_URL,
      timeout: API_CONFIG.DEFAULTS.TIMEOUT,
      params: {
        key: API_CONFIG.WEATHER_API_KEY,
      },
    });
  }

  /**
   * Get current weather data for a location
   * @param query - Location query (lat,lon or zip code or city name)
   * @returns Weather data from the API
   */
  async getWeatherData(query: string): Promise<WeatherApiResponse> {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.CURRENT_WEATHER, {
        params: {
          q: query,
          aqi: 'no', // We don't need air quality data
        },
      });

      return response.data;
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Failed to fetch weather data. Please check your internet connection and try again.');
    }
  }

  /**
   * Search for locations
   * @param query - Search query
   * @returns Array of matching locations
   */
  async searchLocations(query: string) {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.SEARCH, {
        params: {
          q: query,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Location Search Error:', error);
      throw new Error('Failed to search locations.');
    }
  }

  /**
   * Get weather forecast
   * @param query - Location query
   * @param days - Number of days (1-10)
   * @returns Forecast data
   */
  async getForecast(query: string, days: number = 1) {
    try {
      const response = await this.api.get(API_CONFIG.ENDPOINTS.FORECAST, {
        params: {
          q: query,
          days: Math.min(Math.max(days, 1), 10), // Ensure days is between 1-10
          aqi: 'no',
          alerts: 'yes',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Forecast API Error:', error);
      throw new Error('Failed to fetch weather forecast.');
    }
  }
}