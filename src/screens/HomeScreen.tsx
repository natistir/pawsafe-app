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
  TextInput,
  IconButton,
  Chip,
  useTheme,
} from 'react-native-paper';
import * as Location from 'expo-location';
import { HomeScreenNavigationProp } from '../types';

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [zipCode, setZipCode] = useState('');
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
        getCurrentLocation();
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

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      await requestLocationPermission();
      return;
    }

    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      navigation.navigate('Location', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or enter a zip code.'
      );
    } finally {
      setLoading(false);
    }
  };

  const checkZipCode = () => {
    if (zipCode.trim().length < 5) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid 5-digit zip code');
      return;
    }

    navigation.navigate('Location', {
      zipCode: zipCode.trim(),
    });
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

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>🌡️ Paw Safety Guide</Title>
          <View style={styles.chipContainer}>
            <Chip icon="check-circle" textStyle={styles.safeChip} style={[styles.chip, { backgroundColor: '#4CAF50' }]}>
              Safe: Below 43°C (109°F)
            </Chip>
            <Chip icon="alert" textStyle={styles.cautionChip} style={[styles.chip, { backgroundColor: '#FF9800' }]}>
              Caution: 43-49°C (109-120°F)
            </Chip>
            <Chip icon="alert-circle" textStyle={styles.dangerChip} style={[styles.chip, { backgroundColor: '#F44336' }]}>
              Dangerous: Above 49°C (120°F)
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.actionTitle}>Check Surface Temperature</Title>
          
          <Button
            mode="contained"
            onPress={getCurrentLocation}
            loading={loading}
            disabled={loading}
            style={styles.locationButton}
            icon="crosshairs-gps"
          >
            Use Current Location
          </Button>

          <View style={styles.divider}>
            <Paragraph style={styles.dividerText}>OR</Paragraph>
          </View>

          <TextInput
            label="Enter Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
            mode="outlined"
            keyboardType="numeric"
            maxLength={5}
            style={styles.zipInput}
            placeholder="12345"
          />

          <Button
            mode="outlined"
            onPress={checkZipCode}
            disabled={zipCode.length < 5}
            style={styles.zipButton}
            icon="map-marker"
          >
            Check Zip Code
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
    marginBottom: 16,
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
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#2E7D32',
  },
  chipContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  chip: {
    marginVertical: 2,
  },
  safeChip: {
    color: 'white',
    fontWeight: 'bold',
  },
  cautionChip: {
    color: 'white',
    fontWeight: 'bold',
  },
  dangerChip: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    color: '#2E7D32',
  },
  locationButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  divider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerText: {
    color: '#999',
    fontWeight: 'bold',
  },
  zipInput: {
    marginBottom: 12,
  },
  zipButton: {
    paddingVertical: 4,
  },
  settingsContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  settingsButton: {
    backgroundColor: '#E8F5E8',
  },
});

export default HomeScreen;
