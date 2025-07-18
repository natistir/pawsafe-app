import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  useTheme,
} from 'react-native-paper';
import * as Location from 'expo-location';

import SmartTemperatureDial from '../components/SmartTemperatureDial';
import { WeatherService } from '../services/WeatherService';
import { 
  WeatherScreenNavigationProp, 
  WeatherScreenRouteProp,
  RiskLevel 
} from '../types';

interface Props {
  navigation: WeatherScreenNavigationProp;
  route: WeatherScreenRouteProp;
}

interface WeatherData {
  temperature: number;
  temperatureF: number;
  humidity: number;
  windSpeed: number;
  surfaceTemp: number;
  surfaceTempF: number;
  riskLevel: RiskLevel;
  recommendation: string;
  location: string;
}

const WeatherScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('fahrenheit');

  const weatherService = new WeatherService();

  useEffect(() => {
    // If route params contain location data, fetch weather immediately
    if (route.params?.latitude && route.params?.longitude) {
      handleLocationSelected(route.params.latitude, route.params.longitude, route.params.zipCode);
    }
  }, [route.params]);

  const handleLocationSelected = async (latitude: number, longitude: number, zipCode?: string) => {
    setLoading(true);
    
    try {
      let apiResponse;
      let locationName = '';

      if (zipCode) {
        apiResponse = await weatherService.getWeatherByZipCode(zipCode);
        locationName = zipCode;
      } else {
        apiResponse = await weatherService.getWeatherByCoords(latitude, longitude);
        locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }

      // Calculate surface temperature using your existing method
      const surfaceData = weatherService.calculateSurfaceTemperature(
        apiResponse.main.temp,
        apiResponse.main.humidity,
        apiResponse.wind.speed * 3.6, // Convert m/s to km/h
        apiResponse.clouds.all
      );

      // Combine all data
      const weatherData: WeatherData = {
        temperature: apiResponse.main.temp,
        temperatureF: (apiResponse.main.temp * 9/5) + 32,
        humidity: apiResponse.main.humidity,
        windSpeed: apiResponse.wind.speed * 2.237, // Convert m/s to mph
        surfaceTemp: surfaceData.surfaceTemp,
        surfaceTempF: surfaceData.surfaceTempF,
        riskLevel: surfaceData.riskLevel as RiskLevel,
        recommendation: surfaceData.recommendation,
        location: apiResponse.name || locationName,
      };

      setWeatherData(weatherData);
      setCurrentLocation(weatherData.location);
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      // You could add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
    setLoading(true);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      await handleLocationSelected(
        location.coords.latitude, 
        location.coords.longitude
      );
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (weatherData) {
      setRefreshing(true);
      await handleLocationUpdate();
      setRefreshing(false);
    }
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return '#4CAF50';
      case 'caution': return '#FF9800';
      case 'dangerous': return '#FF5722';
      case 'extreme': return '#D32F2F';
      default: return '#9E9E9E';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      {weatherData ? (
        <>
          {/* Smart Temperature Dial Widget */}
          <SmartTemperatureDial
            temperature={weatherData.surfaceTemp}
            temperatureF={weatherData.surfaceTempF}
            unit={temperatureUnit}
            riskLevel={weatherData.riskLevel}
            condition="Surface Temperature"
            humidity={weatherData.humidity}
            windSpeed={weatherData.windSpeed}
            feelsLike={weatherData.temperature + 3}
            feelsLikeF={weatherData.temperatureF + 5}
            onLocationUpdate={handleLocationUpdate}
            locationName={currentLocation}
          />

          {/* Temperature Unit Toggle */}
          <View style={styles.unitToggleContainer}>
            <Button
              mode="outlined"
              onPress={toggleTemperatureUnit}
              style={styles.unitToggle}
              compact
            >
              Switch to {temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}
            </Button>
          </View>

          {/* Air Temperature Comparison */}
          <Card style={styles.comparisonCard}>
            <Card.Content>
              <Title style={styles.comparisonTitle}>Temperature Comparison</Title>
              
              <View style={styles.tempComparisonRow}>
                <View style={styles.tempComparisonItem}>
                  <Paragraph style={styles.tempLabel}>Air Temperature</Paragraph>
                  <Paragraph style={styles.tempValue}>
                    {temperatureUnit === 'celsius' 
                      ? `${Math.round(weatherData.temperature)}°C`
                      : `${Math.round(weatherData.temperatureF)}°F`
                    }
                  </Paragraph>
                </View>
                
                <View style={styles.tempComparisonItem}>
                  <Paragraph style={styles.tempLabel}>Surface Temperature</Paragraph>
                  <Paragraph style={[styles.tempValue, { color: getRiskColor(weatherData.riskLevel) }]}>
                    {temperatureUnit === 'celsius' 
                      ? `${Math.round(weatherData.surfaceTemp)}°C`
                      : `${Math.round(weatherData.surfaceTempF)}°F`
                    }
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Safety Recommendation */}
          <Card style={[styles.recommendationCard, { borderLeftColor: getRiskColor(weatherData.riskLevel) }]}>
            <Card.Content>
              <Title style={styles.recommendationTitle}>🐾 Paw Safety Recommendation</Title>
              <Paragraph style={styles.recommendationText}>
                {weatherData.recommendation}
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Additional Weather Details */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Title style={styles.detailsTitle}>Weather Details</Title>
              
              <View style={styles.detailRow}>
                <Paragraph style={styles.detailLabel}>Location:</Paragraph>
                <Paragraph style={styles.detailValue}>{weatherData.location}</Paragraph>
              </View>
              
              <View style={styles.detailRow}>
                <Paragraph style={styles.detailLabel}>Wind Speed:</Paragraph>
                <Paragraph style={styles.detailValue}>{Math.round(weatherData.windSpeed)} mph</Paragraph>
              </View>
              
              <View style={styles.detailRow}>
                <Paragraph style={styles.detailLabel}>Risk Level:</Paragraph>
                <Paragraph style={[styles.detailValue, { color: getRiskColor(weatherData.riskLevel) }]}>
                  {weatherData.riskLevel.charAt(0).toUpperCase() + weatherData.riskLevel.slice(1)}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Location')}
              style={styles.actionButton}
              icon="map-marker"
            >
              Check Another Location
            </Button>
            
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Settings')}
              style={styles.actionButton}
              icon="cog"
            >
              Settings
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Card style={styles.loadingCard}>
            <Card.Content style={styles.loadingContent}>
              <Title style={styles.loadingTitle}>Welcome to PawSafe Weather</Title>
              <Paragraph style={styles.loadingText}>
                Get real-time surface temperature readings to keep your dog's paws safe.
              </Paragraph>
              
              <Button
                mode="contained"
                onPress={handleLocationUpdate}
                style={styles.getLocationButton}
                loading={loading}
                icon="crosshairs-gps"
              >
                {loading ? 'Getting Location...' : 'Get Current Weather'}
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Location')}
                style={styles.manualLocationButton}
                icon="map-marker"
              >
                Enter Location Manually
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  unitToggleContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  unitToggle: {
    alignSelf: 'center',
  },
  comparisonCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  comparisonTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 12,
  },
  tempComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tempComparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  tempLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  tempValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 8,
  },
  recommendationText: {
    color: '#555',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loadingCard: {
    elevation: 4,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 24,
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  getLocationButton: {
    marginBottom: 16,
    width: '100%',
  },
  manualLocationButton: {
    width: '100%',
  },
});

export default WeatherScreen;