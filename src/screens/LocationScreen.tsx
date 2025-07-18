import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { LocationScreenNavigationProp, LocationScreenRouteProp } from '../types';
import { WeatherService } from '../services/WeatherService';

interface Props {
  navigation: LocationScreenNavigationProp;
  route: LocationScreenRouteProp;
}

const LocationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { latitude, longitude, zipCode } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [surfaceData, setSurfaceData] = useState<any>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude, zipCode]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const weatherService = new WeatherService();
      let weather;

      if (latitude && longitude) {
        weather = await weatherService.getWeatherByCoords(latitude, longitude);
      } else if (zipCode) {
        weather = await weatherService.getWeatherByZipCode(zipCode);
      } else {
        throw new Error('No location provided');
      }

      const surface = weatherService.calculateSurfaceTemperature(
        weather.main.temp,
        weather.main.humidity,
        weather.wind.speed * 3.6, // Convert m/s to km/h
        weather.clouds.all
      );

      setWeatherData(weather);
      setSurfaceData(surface);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return '#4CAF50';
      case 'caution': return '#FF9800';
      case 'dangerous': return '#F44336';
      case 'extreme': return '#D32F2F';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Paragraph style={styles.loadingText}>Getting weather data...</Paragraph>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Title style={styles.errorTitle}>Error</Title>
            <Paragraph>{error}</Paragraph>
            <Button mode="contained" onPress={fetchWeatherData} style={styles.retryButton}>
              Try Again
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.locationCard}>
        <Card.Content>
          <Title>📍 {weatherData?.name}</Title>
          <Paragraph>Current Weather Conditions</Paragraph>
        </Card.Content>
      </Card>

      {surfaceData && (
        <Card style={[styles.tempCard, { borderLeftColor: getRiskColor(surfaceData.riskLevel) }]}>
          <Card.Content>
            <View style={styles.tempHeader}>
              <Title>🌡️ Surface Temperature</Title>
              <Chip 
                style={[styles.riskChip, { backgroundColor: getRiskColor(surfaceData.riskLevel) }]}
                textStyle={styles.riskChipText}
              >
                {surfaceData.riskLevel.toUpperCase()}
              </Chip>
            </View>
            
            <Paragraph style={[styles.mainTemp, { color: getRiskColor(surfaceData.riskLevel) }]}>
              {surfaceData.surfaceTempF}°F ({surfaceData.surfaceTemp}°C)
            </Paragraph>
            
            <Paragraph style={styles.recommendation}>
              {surfaceData.recommendation}
            </Paragraph>
          </Card.Content>
        </Card>
      )}

      {weatherData && (
        <Card style={styles.weatherCard}>
          <Card.Content>
            <Title>☁️ Weather Details</Title>
            <Paragraph>Air Temperature: {Math.round(weatherData.main.temp)}°C ({Math.round(weatherData.main.temp * 9/5 + 32)}°F)</Paragraph>
            <Paragraph>Feels Like: {Math.round(weatherData.main.feels_like)}°C</Paragraph>
            <Paragraph>Humidity: {weatherData.main.humidity}%</Paragraph>
            <Paragraph>Wind Speed: {Math.round(weatherData.wind.speed * 3.6)} km/h</Paragraph>
            <Paragraph>Conditions: {weatherData.weather[0].description}</Paragraph>
          </Card.Content>
        </Card>
      )}

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
        Check Another Location
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 16, fontSize: 16, textAlign: 'center' },
  locationCard: { margin: 16, elevation: 2 },
  tempCard: { margin: 16, elevation: 4, borderLeftWidth: 6 },
  tempHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  mainTemp: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  recommendation: { fontSize: 16, textAlign: 'center', fontStyle: 'italic' },
  riskChip: { elevation: 2 },
  riskChipText: { color: 'white', fontWeight: 'bold' },
  weatherCard: { margin: 16, elevation: 2 },
  backButton: { margin: 16 },
  errorCard: { elevation: 4, margin: 16 },
  errorTitle: { color: '#F44336', textAlign: 'center', marginBottom: 8 },
  retryButton: { marginTop: 16 },
});

export default LocationScreen;
