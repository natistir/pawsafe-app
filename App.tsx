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

// Updated theme with SafePaws colors
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    accent: '#EC4899',
    background: '#F0F9FF',
    surface: '#FFFFFF',
    error: '#EF4444',
    text: '#111827',
    placeholder: '#6B7280',
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
              headerShown: false, // Hide headers since we have custom navigation
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
            />
            <Stack.Screen 
              name="Location" 
              component={LocationScreen} 
            />
            <Stack.Screen 
              name="Weather" 
              component={WeatherScreen} 
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="dark" backgroundColor="#F0F9FF" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}