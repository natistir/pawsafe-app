import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LocationScreen from './src/screens/LocationScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Location: { 
    latitude?: number; 
    longitude?: number; 
    zipCode?: string 
  };
  Weather: { 
    latitude?: number; 
    longitude?: number; 
    zipCode?: string 
  };
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Custom theme for the app
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#FF9800',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#F44336',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: '🐕 PawSafe',
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: 'bold',
                }
              }}
            />
            <Stack.Screen 
              name="Location" 
              component={LocationScreen} 
              options={{ 
                title: '🌡️ Surface Temperature',
                headerBackTitle: 'Back'
              }}
            />
            <Stack.Screen 
              name="Weather" 
              component={WeatherScreen} 
              options={{ 
                title: '⌚ Apple Watch Weather',
                headerBackTitle: 'Back'
              }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ 
                title: '⚙️ Settings',
                headerBackTitle: 'Back'
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" backgroundColor={theme.colors.primary} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}