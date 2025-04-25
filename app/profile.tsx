import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import BackgroundImage from '../components/BackgroundImage';

SplashScreen.preventAutoHideAsync();
const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  // Try to load avatar image, fallback to placeholder
  const [avatarError, setAvatarError] = useState(false);
  
  // Define avatar image path
  const avatarImagePath = '../assets/images/profile/avatar.png';

  // Function to handle avatar image error
  const handleAvatarError = () => {
    console.log('Avatar image failed to load, using placeholder');
    setAvatarError(true);
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Weekly reading statistics data
  const weeklyStats = [
    { day: 'Mon', hours: 2.8 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.7 },
    { day: 'Thu', hours: 2.8 },
    { day: 'Fri', hours: 0.8 },
    { day: 'Sat', hours: 3.3 },
    { day: 'Sun', hours: 1.8 }
  ];

  // Animation when component mounts
  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1.0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ];
    
    Animated.parallel(animations).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Navigate to library screen
  const navigateToLibrary = () => {
    router.replace('/library');
  };
  
  // Navigate to reading screen
  const navigateToReading = () => {
    router.replace('/reading');
  };

  // Navigate to browse screen
  const navigateToBrowse = () => {
    router.replace('/browse');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Vellichor</Text>
        </View>

        <View style={styles.profileSection}>
          <Animated.View 
            style={[
              styles.profileCard,
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: Animated.multiply(slideAnim, 0.8) }] 
              }
            ]}
          >
            <Image 
              source={avatarError ? 
                { uri: 'https://via.placeholder.com/150x150/CCCCCC/666666?text=Profile' } :
                require('../assets/images/profile/avatar.png')}
              onError={handleAvatarError}
              style={styles.profileImage}
            />
            
            <Text style={styles.profileName}>Boris Filan</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>700</Text>
                <Text style={styles.statLabel}>Books</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3,000</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Details</Text>
                <Text style={styles.detailValue}>Male, Bratislava/Kosice</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Birthday</Text>
                <Text style={styles.detailValue}>October 23</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Activity</Text>
                <Text style={styles.detailValue}>Joined in December 2009</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Genres</Text>
                <Text style={styles.detailValue}>Crime and Mystery, Short stories, + 5 more</Text>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>'22 Books</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: '35%' }]} />
                </View>
                <Text style={styles.progressValue}>7/20</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.statsSection,
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: Animated.multiply(slideAnim, 1.2) }] 
            }
          ]}
        >
          <Text style={styles.statsSectionTitle}>This Week's Statistics</Text>
          
          <View style={styles.timeIndicators}>
            <Text style={styles.timeIndicator}>4h</Text>
            <Text style={styles.timeIndicator}>3h</Text>
            <Text style={styles.timeIndicator}>2h</Text>
            <Text style={styles.timeIndicator}>1h</Text>
            <Text style={styles.timeIndicator}>0h</Text>
          </View>

          <View style={styles.chartContainer}>
            {weeklyStats.map((stat, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={[styles.chartBarContainer, { height: `${(stat.hours < 1 ? 1 : stat.hours) * 20}%` }]}>
                  <Animated.View 
                    style={[
                      styles.chartBar, 
                      { 
                        height: '100%',
                        opacity: Animated.multiply(fadeAnim, 0.5 + index * 0.07)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{stat.day}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/library')}
        >
          <Ionicons name="bookmark-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={navigateToReading}
        >
          <Ionicons name="book-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={navigateToBrowse}
        >
          <Ionicons name="search-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Ionicons name="person" size={24} color="#4a4e82" />
          <Text style={styles.activeTabButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ea',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Birthstone',
    fontSize: 56,
    color: '#4a4e82',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  profileName: {
    fontFamily: 'SpaceMono',
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#4a4e82',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 15,
  },
  detailsSection: {
    width: '100%',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#555',
    width: 85,
    fontWeight: '500',
  },
  detailValue: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#333',
    flex: 1,
    paddingLeft: 5,
  },
  progressSection: {
    width: '100%',
    marginTop: 15,
    marginBottom: 5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  progressLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#444',
    width: 80,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#364273',
    borderRadius: 5,
  },
  progressValue: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#444',
    width: 40,
    textAlign: 'right',
  },
  statsSection: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f9f5e4',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsSectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeIndicators: {
    position: 'absolute',
    left: 15,
    top: 55,
    height: 170,
    justifyContent: 'space-between',
  },
  timeIndicator: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#888',
    height: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 10,
    paddingBottom: 20,
    marginLeft: 38,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBarContainer: {
    width: 18,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#364273',
    borderRadius: 10,
  },
  chartLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#777',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0ddd3',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4a4e82',
  },
  tabButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  activeTabButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: '#4a4e82',
    fontWeight: 'bold',
    marginTop: 4,
  },
}); 