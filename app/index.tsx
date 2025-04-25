import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import BackgroundImage from '../components/BackgroundImage';
import Colors from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontsLoaded, fadeAnim, scaleAnim]);

  const handleStartPress = () => {
    router.push('/genres');
  };

  const handleLoginPress = () => {
    // Navigate to login screen
    router.push('/login');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BackgroundImage />

      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.contentContainer,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        >
          {/* Main content */}
          <Text style={styles.title}>
            All your books in one place on{' '}
            <Text style={styles.vellichorText}>Vellichor.</Text>
          </Text>

          <TouchableOpacity 
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={handleStartPress}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLoginPress}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
    zIndex: 1,
  },
  title: {
    fontSize: 49,
    fontFamily: 'SpaceMono',
    color: '#0D1D3C',
    marginBottom: 100,
    lineHeight: 52,
    width: '100%',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  vellichorText: {
    fontFamily: 'Birthstone',
    fontSize: 92,
    fontStyle: 'italic',
    color: '#0D1D3C',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highlightedText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 54, // Slightly larger
    color: '#0D1D3C',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  loginText: {
    color: '#333333',
    fontFamily: 'SpaceMono',
    marginRight: 5,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
}); 