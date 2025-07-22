import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { HomeScreenNavigationProp } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    checksToday: 0,
    safeWalks: 0,
    totalChecks: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    checkLocationPermission();
    // Mock stats - in real app, these would come from your data storage
    setStats({
      checksToday: Math.floor(Math.random() * 12) + 1,
      safeWalks: Math.floor(Math.random() * 8) + 1,
      totalChecks: Math.floor(Math.random() * 50) + 25,
    });
    return () => clearInterval(timer);
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
          'PawTemp needs location access to check surface temperature for safe dog walking.',
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

  const features = [
    {
      icon: 'location-outline',
      title: 'Auto Weather Check',
      description: 'Get real-time surface temperature for your location automatically',
      gradient: ['#3B82F6', '#1D4ED8'],
      onPress: getCurrentLocationForWeather,
      badge: 'GPS Required',
    },
    {
      icon: 'thermometer-outline',
      title: 'Manual Temperature',
      description: 'Use our interactive check to input the current surface temperature',
      gradient: ['#EF4444', '#EC4899'],
      onPress: () => navigation.navigate('Location'),
      badge: 'No GPS Needed',
    },
  ];

  const safetyLevels = [
    {
      icon: 'shield-checkmark-outline',
      title: 'Safe Walking',
      temp: 'Below 77°F (25°C)',
      description: 'Perfect conditions for longer walks',
      gradient: ['#10B981', '#059669'],
      tips: '30-60 minutes • Perfect for training • Enjoy nature',
    },
    {
      icon: 'sunny-outline',
      title: 'Caution Zone',
      temp: '77-86°F (25-30°C)',
      description: 'Short walks, watch for signs of discomfort',
      gradient: ['#F59E0B', '#EAB308'],
      tips: '10-15 minutes • Stay hydrated • Seek shade',
    },
    {
      icon: 'warning-outline',
      title: 'Dangerous',
      temp: 'Above 86°F (30°C)',
      description: 'Avoid walking, risk of paw burns',
      gradient: ['#EF4444', '#EC4899'],
      tips: 'Stay indoors • Use booties if urgent • Early morning only',
    },
  ];

  const quickStats = [
    {
      icon: 'trending-up-outline',
      value: stats.checksToday,
      label: 'Checks Today',
      gradient: ['#3B82F6', '#1D4ED8'],
    },
    {
      icon: 'shield-checkmark-outline',
      value: stats.safeWalks,
      label: 'Safe Walks',
      gradient: ['#10B981', '#059669'],
    },
    {
      icon: 'trophy-outline',
      value: stats.totalChecks,
      label: 'Total Checks',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            {/* Floating decorative elements */}
            <View style={[styles.floatingElement, styles.floatingElement1]} />
            <View style={[styles.floatingElement, styles.floatingElement2]} />
            
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#EF4444', '#EC4899']}
                style={styles.logoGradient}
              >
                <Ionicons name="heart" size={32} color="white" />
                <View style={styles.activityIndicator}>
                  <View style={styles.activityDot} />
                </View>
              </LinearGradient>
            </View>
            
            <Text style={styles.heroTitle}>PawTemp</Text>
            <Text style={styles.heroSubtitle}>
              Protect your furry friend's paws with real-time surface temperature monitoring.
              Know when it's safe to walk and when to stay indoors.
            </Text>
            
            {/* Time and Location */}
            <View style={styles.contextInfo}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.timeText}>{currentTime.toLocaleTimeString()}</Text>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>Your Location</Text>
              </View>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={getCurrentLocationForWeather}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="location-outline" size={20} color="white" />
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Getting Location...' : 'Check My Location'}
                  </Text>
                  <View style={styles.buttonBadge}>
                    <Text style={styles.badgeText}>Auto</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Location')}
              >
                <Ionicons name="thermometer-outline" size={20} color="#374151" />
                <Text style={styles.secondaryButtonText}>Manual Check</Text>
                <View style={styles.secondaryBadge}>
                  <Text style={styles.secondaryBadgeText}>Offline</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <LinearGradient
                  colors={stat.gradient}
                  style={styles.statIcon}
                >
                  <Ionicons name={stat.icon as any} size={24} color="white" />
                </LinearGradient>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>
            Two simple ways to keep your dog safe during walks
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCard}
                onPress={feature.onPress}
                disabled={index === 0 && loading}
              >
                <View style={styles.featureHeader}>
                  <LinearGradient
                    colors={feature.gradient}
                    style={styles.featureIcon}
                  >
                    <Ionicons name={feature.icon as any} size={24} color="white" />
                  </LinearGradient>
                  <View style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{feature.badge}</Text>
                  </View>
                </View>
                
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
                
                <View style={styles.featureAction}>
                  <Text style={styles.actionText}>Get Started</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color="#3B82F6" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safety Guide */}
        <View style={styles.safetySection}>
          <Text style={styles.sectionTitle}>Temperature Safety Guide</Text>
          <Text style={styles.sectionSubtitle}>
            Understanding surface temperature risks and recommendations
          </Text>
          
          <View style={styles.safetyGrid}>
            {safetyLevels.map((level, index) => (
              <View key={index} style={styles.safetyCard}>
                <View style={styles.safetyHeader}>
                  <LinearGradient
                    colors={level.gradient}
                    style={styles.safetyIcon}
                  >
                    <Ionicons name={level.icon as any} size={24} color="white" />
                  </LinearGradient>
                  <View style={[styles.statusDot, { backgroundColor: level.gradient[0] }]} />
                </View>
                
                <Text style={styles.safetyTitle}>{level.title}</Text>
                <Text style={styles.safetyTemp}>{level.temp}</Text>
                <Text style={styles.safetyDescription}>{level.description}</Text>
                
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsHeader}>Recommendations:</Text>
                  <Text style={styles.tipsText}>{level.tips}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Button */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#6B7280" />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 16,
    opacity: 0.1,
  },
  floatingElement1: {
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
  },
  floatingElement2: {
    bottom: 16,
    left: 16,
    width: 32,
    height: 32,
    backgroundColor: '#EC4899',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activityIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityDot: {
    width: 6,
    height: 6,
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  contextInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    marginLeft: 6,
    color: '#6B7280',
    fontWeight: '500',
  },
  locationContainer: {
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
  },
  locationText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButtons: {
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secondaryBadgeText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Section Headers
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureBadgeText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  featureAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },

  // Safety Section
  safetySection: {
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  safetyGrid: {
    gap: 20,
  },
  safetyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  safetyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  safetyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  safetyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  safetyTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 12,
  },
  safetyDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  tipsHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Settings Section
  settingsSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  settingsText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;