import { SurfaceCalculationFactors, RiskLevel, SurfaceType } from '../types';
import { PAW_SAFETY_THRESHOLDS, SURFACE_MULTIPLIERS } from '../config/env';

export class SurfaceTemperatureCalculator {
  /**
   * Calculate surface temperature based on weather conditions
   * @param factors - Weather and environmental factors
   * @returns Calculated surface data
   */
  calculateSurfaceTemperature(factors: SurfaceCalculationFactors) {
    const {
      airTemp,
      humidity,
      windSpeed,
      uvIndex,
      cloudCover,
      surfaceType,
      timeOfDay,
    } = factors;

    // Base calculation: start with air temperature
    let surfaceTemp = airTemp;

    // Apply surface type multiplier
    const surfaceMultiplier = SURFACE_MULTIPLIERS[surfaceType] || 1.0;
    surfaceTemp *= surfaceMultiplier;

    // UV Index effect (more UV = hotter surface)
    const uvEffect = (uvIndex / 10) * 8; // Up to 8°C increase for UV 10+
    surfaceTemp += uvEffect;

    // Cloud cover effect (more clouds = cooler surface)
    const cloudEffect = (cloudCover / 100) * -5; // Up to 5°C decrease for 100% clouds
    surfaceTemp += cloudEffect;

    // Wind effect (more wind = cooler surface)
    const windEffect = Math.min(windSpeed / 10, 1) * -3; // Up to 3°C decrease
    surfaceTemp += windEffect;

    // Humidity effect (higher humidity can increase perceived heat)
    const humidityEffect = humidity > 70 ? (humidity - 70) / 30 * 2 : 0; // Up to 2°C for high humidity
    surfaceTemp += humidityEffect;

    // Time of day effect (peak heat around 2-4 PM)
    const timeEffect = this.getTimeOfDayEffect(timeOfDay);
    surfaceTemp += timeEffect;

    // Ensure realistic bounds
    surfaceTemp = Math.max(airTemp - 5, surfaceTemp); // Can't be more than 5°C below air temp
    surfaceTemp = Math.min(airTemp + 30, surfaceTemp); // Cap at 30°C above air temp

    // Convert to Fahrenheit
    const surfaceTempF = this.celsiusToFahrenheit(surfaceTemp);

    // Determine safety level
    const riskLevel = this.getRiskLevel(surfaceTemp);
    const isSafeForPaws = riskLevel === 'safe';
    const recommendation = this.getRecommendation(riskLevel, surfaceType);

    return {
      surfaceTemp: Math.round(surfaceTemp * 10) / 10, // Round to 1 decimal
      surfaceTempF: Math.round(surfaceTempF * 10) / 10,
      isSafeForPaws,
      riskLevel,
      recommendation,
    };
  }

  /**
   * Get time of day temperature effect
   * @param hour - Hour of day (0-23)
   * @returns Temperature adjustment in Celsius
   */
  private getTimeOfDayEffect(hour: number): number {
    // Peak heat effect around 2-4 PM (14-16 hours)
    if (hour >= 12 && hour <= 16) {
      // Maximum effect at 3 PM (hour 15)
      const peakDistance = Math.abs(hour - 15);
      return Math.max(0, 5 - peakDistance * 1.25); // Up to 5°C increase at peak
    }
    
    // Early morning and late evening are cooler
    if (hour <= 7 || hour >= 20) {
      return -2; // 2°C cooler
    }
    
    // Morning and late afternoon
    if (hour <= 11 || hour >= 17) {
      return 0; // No significant effect
    }
    
    return 0;
  }

  /**
   * Determine risk level based on surface temperature
   * @param tempCelsius - Surface temperature in Celsius
   * @returns Risk level
   */
  private getRiskLevel(tempCelsius: number): RiskLevel {
    if (tempCelsius < PAW_SAFETY_THRESHOLDS.SAFE) {
      return 'safe';
    } else if (tempCelsius < PAW_SAFETY_THRESHOLDS.CAUTION) {
      return 'caution';
    } else if (tempCelsius < PAW_SAFETY_THRESHOLDS.DANGEROUS) {
      return 'dangerous';
    } else {
      return 'extreme';
    }
  }

  /**
   * Get safety recommendation based on risk level and surface type
   * @param risk - Risk level
   * @param surfaceType - Type of surface
   * @returns Human-readable recommendation
   */
  private getRecommendation(risk: RiskLevel, surfaceType: SurfaceType): string {
    const surfaceName = surfaceType === 'asphalt' ? 'asphalt' : surfaceType;
    
    switch (risk) {
      case 'safe':
        return `Safe for walking! The ${surfaceName} temperature is comfortable for your dog's paws.`;
      
      case 'caution':
        return `Use caution when walking on ${surfaceName}. Consider dog booties or limit time on hot surfaces.`;
      
      case 'dangerous':
        return `Dangerous! Avoid walking on ${surfaceName}. The surface can burn your dog's paws. Seek shaded areas or wait for cooler temperatures.`;
      
      case 'extreme':
        return `EXTREME DANGER! Do not walk on ${surfaceName}. The surface will burn paw pads in seconds. Stay indoors or find grassy areas only.`;
      
      default:
        return 'Unable to determine safety level. Use caution when walking.';
    }
  }

  /**
   * Convert Celsius to Fahrenheit
   * @param celsius - Temperature in Celsius
   * @returns Temperature in Fahrenheit
   */
  private celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  /**
   * Convert Fahrenheit to Celsius
   * @param fahrenheit - Temperature in Fahrenheit
   * @returns Temperature in Celsius
   */
  public fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
  }

  /**
   * Test surface temperature with the '5-second rule'
   * @param tempCelsius - Surface temperature in Celsius
   * @returns Whether you can hold your hand on the surface for 5 seconds
   */
  public canHoldHandFor5Seconds(tempCelsius: number): boolean {
    return tempCelsius < 50; // Approximately 122°F
  }
}