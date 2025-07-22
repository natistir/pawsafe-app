import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  PanGestureHandler,
  State,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  Text as SvgText,
} from 'react-native-svg';
import { LinearGradient as RNLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TemperatureDialProps {
  temperature: number;
  onTemperatureChange?: (temp: number) => void;
  unit?: 'fahrenheit' | 'celsius';
  size?: number;
  interactive?: boolean;
}

const TemperatureDial: React.FC<TemperatureDialProps> = ({
  temperature,
  onTemperatureChange,
  unit = 'fahrenheit',
  size = 280,
  interactive = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const panRef = useRef<PanGestureHandler>(null);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.32;
  const strokeWidth = size * 0.06;

  const minTemp = unit === 'fahrenheit' ? 32 : 0;
  const maxTemp = unit === 'fahrenheit' ? 120 : 50;

  const tempToAngle = (temp: number) => {
    const percentage = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
    return -135 + (percentage * 270);
  };

  const angleToTemp = (angle: number) => {
    let normalizedAngle = angle + 135;
    if (normalizedAngle < 0) normalizedAngle += 360;
    if (normalizedAngle > 270) normalizedAngle = 270;
    if (normalizedAngle < 0) normalizedAngle = 0;
    
    const percentage = normalizedAngle / 270;
    return Math.round(minTemp + (percentage * (maxTemp - minTemp)));
  };

  const handleGestureEvent = (event: any) => {
    if (!interactive || !onTemperatureChange) return;

    const { x, y } = event.nativeEvent;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    const newTemp = angleToTemp(angle);
    onTemperatureChange(newTemp);
  };

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
    } else if (event.nativeEvent.state === State.END) {
      setIsDragging(false);
    }
  };

  const progressPercentage = Math.max(0, Math.min(1, (temperature - minTemp) / (maxTemp - minTemp)));

  const getTemperatureColor = (percentage: number) => {
    if (percentage < 0.4) return '#34C759'; // iOS Green
    if (percentage < 0.6) return '#FF9500'; // iOS Orange  
    if (percentage < 0.8) return '#FF6B35'; // iOS Red-Orange
    return '#FF3B30'; // iOS Red
  };

  const temperatureLabels = unit === 'fahrenheit' 
    ? [40, 60, 80, 100, 120]
    : [5, 15, 25, 35, 45];

  // Calculate path for the progress arc
  const angle = progressPercentage * 270 - 135;
  const startX = centerX - radius * Math.cos(Math.PI * 3/4);
  const startY = centerY - radius * Math.sin(Math.PI * 3/4);
  const endX = centerX + radius * Math.cos((angle * Math.PI) / 180);
  const endY = centerY + radius * Math.sin((angle * Math.PI) / 180);
  
  const progressPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${progressPercentage > 0.5 ? 1 : 0} 1 ${endX} ${endY}`;
  const backgroundPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${centerX + radius * Math.cos(Math.PI * 3/4)} ${centerY - radius * Math.sin(Math.PI * 3/4)}`;

  return (
    <View style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        enabled={interactive}
      >
        <View style={[styles.dialContainer, { width: size, height: size }]}>
          <View style={styles.glassMorphism}>
            <Svg width={size} height={size} style={styles.svgContainer}>
              <Defs>
                <LinearGradient id="temperatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#34C759" />
                  <Stop offset="40%" stopColor="#FF9500" />
                  <Stop offset="70%" stopColor="#FF6B35" />
                  <Stop offset="100%" stopColor="#FF3B30" />
                </LinearGradient>
                
                <Filter id="glowEffect">
                  <FeGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <FeMerge> 
                    <FeMergeNode in="coloredBlur"/>
                    <FeMergeNode in="SourceGraphic"/>
                  </FeMerge>
                </Filter>
              </Defs>
              
              {/* Background track */}
              <Path
                d={backgroundPath}
                fill="none"
                stroke="#F2F2F7"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              
              {/* Progress arc with iOS gradient */}
              <Path
                d={progressPath}
                fill="none"
                stroke="url(#temperatureGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                filter="url(#glowEffect)"
              />
              
              {/* Interactive indicator */}
              {interactive && (
                <Circle
                  cx={endX}
                  cy={endY}
                  r={strokeWidth * 0.8}
                  fill="white"
                  stroke={getTemperatureColor(progressPercentage)}
                  strokeWidth={3}
                  opacity={isDragging ? 0.8 : 1}
                />
              )}
            </Svg>

            {/* Temperature labels */}
            {temperatureLabels.map((temp, index) => {
              const labelAngle = -135 + (index / (temperatureLabels.length - 1)) * 270;
              const labelRadius = radius + strokeWidth * 1.2;
              const labelX = centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180) - 12;
              const labelY = centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180) - 8;
              
              return (
                <Text
                  key={index}
                  style={[
                    styles.temperatureLabel,
                    {
                      position: 'absolute',
                      left: labelX,
                      top: labelY,
                    }
                  ]}
                >
                  {temp}
                </Text>
              );
            })}

            {/* Center content with iOS styling */}
            <View style={styles.centerContent}>
              <RNLinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.centerIcon}
              >
                <Ionicons name="thermometer" size={28} color="white" />
              </RNLinearGradient>
              
              <View style={styles.temperatureDisplay}>
                <Text style={styles.temperatureValue}>
                  {Math.round(temperature)}°
                </Text>
                <Text style={styles.temperatureUnit}>
                  {unit === 'fahrenheit' ? 'Fahrenheit' : 'Celsius'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </PanGestureHandler>

      {/* iOS-style temperature scale */}
      <View style={styles.temperatureScale}>
        <View style={styles.scaleItem}>
          <View style={[styles.scaleDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.scaleText}>Safe</Text>
        </View>
        <View style={styles.scaleItem}>
          <View style={[styles.scaleDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.scaleText}>Caution</Text>
        </View>
        <View style={styles.scaleItem}>
          <View style={[styles.scaleDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.scaleText}>Dangerous</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dialContainer: {
    position: 'relative',
  },
  glassMorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ rotate: '-90deg' }],
  },
  temperatureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    width: 24,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  temperatureDisplay: {
    alignItems: 'center',
  },
  temperatureValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  temperatureUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  temperatureScale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scaleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scaleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});

export default TemperatureDial;