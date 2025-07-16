import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Switch,
  Button,
  Divider,
  List,
  useTheme,
} from 'react-native-paper';
import { SettingsScreenNavigationProp, UserPreferences, SurfaceType } from '../types';

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  
  // Default preferences - in a real app, these would be loaded from storage
  const [preferences, setPreferences] = useState<UserPreferences>({
    temperatureUnit: 'fahrenheit',
    defaultSurfaceType: 'asphalt',
    notificationsEnabled: true,
    locationServicesEnabled: true,
  });

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // In a real app, save to AsyncStorage here
  };

  const resetToDefaults = () => {
    setPreferences({
      temperatureUnit: 'fahrenheit',
      defaultSurfaceType: 'asphalt',
      notificationsEnabled: true,
      locationServicesEnabled: true,
    });
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Temperature Unit */}
      <Card style={styles.settingCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Temperature Unit</Title>
          <List.Item
            title="Fahrenheit (°F)"
            left={props => <List.Icon {...props} icon="thermometer" />}
            right={() => (
              <Switch
                value={preferences.temperatureUnit === 'fahrenheit'}
                onValueChange={() => 
                  updatePreference('temperatureUnit', 
                    preferences.temperatureUnit === 'fahrenheit' ? 'celsius' : 'fahrenheit'
                  )
                }
              />
            )}
          />
          <List.Item
            title="Celsius (°C)"
            left={props => <List.Icon {...props} icon="thermometer" />}
            right={() => (
              <Switch
                value={preferences.temperatureUnit === 'celsius'}
                onValueChange={() => 
                  updatePreference('temperatureUnit', 
                    preferences.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius'
                  )
                }
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Default Surface Type */}
      <Card style={styles.settingCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Default Surface Type</Title>
          <Paragraph style={styles.cardDescription}>
            Choose the surface type to use for temperature calculations by default.
          </Paragraph>
          
          {(['asphalt', 'concrete', 'grass', 'sand', 'metal'] as SurfaceType[]).map((surface) => (
            <List.Item
              key={surface}
              title={surface.charAt(0).toUpperCase() + surface.slice(1)}
              left={props => <List.Icon {...props} icon="road" />}
              right={() => (
                <Switch
                  value={preferences.defaultSurfaceType === surface}
                  onValueChange={() => updatePreference('defaultSurfaceType', surface)}
                />
              )}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Permissions */}
      <Card style={styles.settingCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Permissions & Notifications</Title>
          
          <List.Item
            title="Location Services"
            description="Allow app to access your location"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={preferences.locationServicesEnabled}
                onValueChange={(value) => updatePreference('locationServicesEnabled', value)}
              />
            )}
          />
          
          <List.Item
            title="Notifications"
            description="Receive safety alerts and updates"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={preferences.notificationsEnabled}
                onValueChange={(value) => updatePreference('notificationsEnabled', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.settingCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>About PawSafe</Title>
          <Paragraph style={styles.aboutText}>
            PawSafe helps protect your dog's paws by checking surface temperatures.
            Hot pavement can burn sensitive paw pads in just 60 seconds!
          </Paragraph>
          
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Version:</Paragraph>
            <Paragraph style={styles.infoValue}>1.0.0</Paragraph>
          </View>
          
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Developer:</Paragraph>
            <Paragraph style={styles.infoValue}>PawSafe Team</Paragraph>
          </View>
          
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Weather Data:</Paragraph>
            <Paragraph style={styles.infoValue}>WeatherAPI.com</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={resetToDefaults} 
          style={styles.resetButton}
          icon="restore"
        >
          Reset to Defaults
        </Button>
        
        <Button 
          mode="contained" 
          onPress={goHome} 
          style={styles.homeButton}
          icon="home"
        >
          Back to Home
        </Button>
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
  settingCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 12,
  },
  aboutText: {
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#333',
  },
  buttonContainer: {
    marginTop: 16,
  },
  resetButton: {
    marginBottom: 12,
  },
  homeButton: {
    marginBottom: 8,
  },
});

export default SettingsScreen;