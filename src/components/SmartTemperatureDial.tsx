import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Location from 'expo-location';

interface SmartTemperatureDialProps {
  temperature: number;
  temperatureF: number;
  unit: 'celsius' | 'fahrenheit';
  riskLevel: 'safe' | 'caution' | 'dangerous' | 'extreme';
  condition: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
  feelsLikeF?: number;
  onLocationUpdate?: () => void;
  locationName?: string;
}

const { width } = Dimensions.get('window');
const DIAL_SIZE = Math.min(width * 0.75, 300);
const CENTER = DIAL_SIZE / 2;
const RADIUS = CENTER - 30;
const STROKE_WIDTH = 12;

const SmartTemperatureDial: React.FC<SmartTemperatureDialProps> = ({
  temperature,
  temperatureF,
  unit,
  riskLevel,
  condition,
  humidity = 65,
  windSpeed = 8,
  feelsLike,
  feelsLikeF,
  onLocationUpdate,
  locationName = "Current Location",
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Summer temperature range: 60°F - 105°F (15.5°C - 40.5°C)
  const minTemp = unit === 'celsius' ? 15.5 : 60;
  const maxTemp = unit === 'celsius' ? 40.5 : 105;
  
  const tempForCalculation = unit === 'celsius' ? temperature : temperatureF;
  const normalizedTemp = Math.max(0, Math.min(1, (tempForCalculation - minTemp) / (maxTemp - minTemp)));
  const angle = normalizedTemp * 270; // 270 degrees for 3/4 circle

  const displayTemp = unit === 'celsius' ? Math.round(temperature) : Math.round(temperatureF);
  const displayFeelsLike = unit === 'celsius' ? 
    (feelsLike ? Math.round(feelsLike) : displayTemp + 3) : 
    (feelsLikeF ? Math.round(feelsLikeF) : displayTemp + 5);

  // Get condition label based on temperature
  const getConditionLabel = (temp: number) => {
    const tempInF = unit === 'celsius' ? (temp * 9/5) + 32 : temp;
    if (tempInF < 68) return 'Pleasant';
    if (tempInF < 75) return 'Comfortable';
    if (tempInF < 82) return 'Warm';
    if (tempInF < 90) return 'Hot';
    if (tempInF < 95) return 'Very Hot';
    return 'Extreme Heat';
  };

  const conditionLabel = getConditionLabel(tempForCalculation);

  // Create the arc path for the temperature gauge
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Calculate indicator position
  const indicatorAngle = -135 + angle;
  const indicatorPos = polarToCartesian(CENTER, CENTER, RADIUS, indicatorAngle);

  const handleLocationPress = async () => {
    setIsLocationLoading(true);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      if (onLocationUpdate) {
        onLocationUpdate();
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setTimeout(() => setIsLocationLoading(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <Text style={styles.timeText}>{currentTime}</Text>
        <Text style={styles.headerIcon}>⚙</Text>
      </View>

      {/* Main Dial */}
      <View style={styles.dialContainer}>
        <View style={styles.dialBackground}>
          <Svg width={DIAL_SIZE} height={DIAL_SIZE} style={styles.svgContainer}>
            <Defs>
              {/* Summer gradient: Green → Yellow → Orange → Red */}
              <LinearGradient id="temperatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#7ED321" />
                <Stop offset="25%" stopColor="#A3E635" />
                <Stop offset="50%" stopColor="#F5A623" />
                <Stop offset="75%" stopColor="#FF6B35" />
                <Stop offset="100%" stopColor="#D0021B" />
              </LinearGradient>
            </Defs>
            
            {/* Background track */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke="#F2F2F7"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(270 / 360) * (2 * Math.PI * RADIUS)} ${2 * Math.PI * RADIUS}`}
              transform={`rotate(135 ${CENTER} ${CENTER})`}
            />
            
            {/* Temperature arc with gradient */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke="url(#temperatureGradient)"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(270 / 360) * (2 * Math.PI * RADIUS)} ${2 * Math.PI * RADIUS}`}
              transform={`rotate(135 ${CENTER} ${CENTER})`}
            />

            {/* White indicator dot */}
            <Circle
              cx={indicatorPos.x}
              cy={indicatorPos.y}
              r={8}
              fill="white"
              stroke="#E0E0E0"
              strokeWidth={2}
            />
          </Svg>

          {/* Temperature labels around the dial */}
          <View style={styles.tempLabels}>
            <Text style={[styles.tempLabel, { top: 10, left: '50%', marginLeft: -15 }]}>105°</Text>
            <Text style={[styles.tempLabel, { top: '50%', right: 10, marginTop: -10 }]}>95°</Text>
            <Text style={[styles.tempLabel, { bottom: 10, left: '50%', marginLeft: -15 }]}>85°</Text>
            <Text style={[styles.tempLabel, { top: '50%', left: 10, marginTop: -10 }]}>75°</Text>
            <Text style={[styles.tempLabel, { top: 25, right: 25 }]}>100°</Text>
            <Text style={[styles.tempLabel, { bottom: 25, right: 25 }]}>90°</Text>
            <Text style={[styles.tempLabel, { bottom: 25, left: 25 }]}>80°</Text>
            <Text style={[styles.tempLabel, { top: 25, left: 25 }]}>65°</Text>
          </View>

          {/* Center content */}
          <View style={styles.centerContent}>
            <Text style={styles.temperatureText}>{displayTemp}</Text>
            <Text style={styles.unitText}>Temperature</Text>
            <Text style={styles.conditionText}>{conditionLabel}</Text>
          </View>
        </View>
      </View>

      {/* Weather Details */}
      <View style={styles.weatherDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🌡️</Text>
          <Text style={styles.detailLabel}>Feels Like</Text>
          <Text style={styles.detailValue}>{displayFeelsLike}°</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>💧</Text>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>💨</Text>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{Math.round(windSpeed)} mph</Text>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.locationSection}>
        <TouchableOpacity 
          style={[styles.locationButton, isLocationLoading && styles.locationButtonDisabled]}
          onPress={handleLocationPress}
          disabled={isLocationLoading}
        >
          <Text style={styles.locationButtonIcon}>
            {isLocationLoading ? '🔄' : '📍'}
          </Text>
          <Text style={styles.locationButtonText}>
            {isLocationLoading ? 'Getting...' : 'Get Location'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.locationInfo}>{locationName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerIcon: {
    fontSize: 16,
    color: '#8E8E93',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  dialContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dialBackground: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: '#F2F2F7',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'absolute',
  },
  tempLabels: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tempLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  temperatureText: {
    fontSize: 64,
    fontWeight: '300',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  unitText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8E8E93',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  locationSection: {
    alignItems: 'center',
    width: '100%',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  locationButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  locationButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationInfo: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
});

export default SmartTemperatureDial;