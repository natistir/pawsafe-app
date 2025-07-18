import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  IconButton,
  useTheme,
} from 'react-native-paper';
import * as Location from 'expo-location';
import { HomeScreenNavigationProp } from '../types';

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationPermission(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocationForWeather();
      } else {
        Alert.alert(
          'Location Permission Required',
          'PawSafe needs location access to check surface temperature for safe dog walking.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const getCurrentLocationForWeather = async () => {
    if (!locationPermission) {
      await requestLocationPermission();
      return;
    }

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      navigation.navigate('Weather', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>🐕 Welcome to PawSafe!</Title>
          <Paragraph style={styles.headerDescription}>
            Check surface temperature to keep your dog's paws safe during walks.
            Hot asphalt and concrete can burn sensitive paw pads.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.actionTitle}>Check Surface Temperature</Title>
          
          <Button
            mode="contained"
            onPress={getCurrentLocationForWeather}
            loading={loading}
            disabled={loading}
            style={styles.checkButton}
            icon="thermometer"
            contentStyle={styles.buttonContent}
          >
            Check Temperature
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.settingsContainer}>
        <IconButton
          icon="cog"
          size={24}
          onPress={navigateToSettings}
          style={styles.settingsButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 24,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
  },
  headerDescription: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionCard: {
    marginBottom: 24,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
    color: '#2E7D32',
  },
  checkButton: {
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  settingsContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  settingsButton: {
    backgroundColor: '#E8F5E8',
  },
});

export default HomeScreen;