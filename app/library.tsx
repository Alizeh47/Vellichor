import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Dimensions,
  Animated,
  FlatList,
  StatusBar,
  ImageBackground
} from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

SplashScreen.preventAutoHideAsync();
const { width, height } = Dimensions.get('window');

// Types
type Story = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  category: string;
};

type ReadingList = {
  id: string;
  name: string;
  stories: Story[];
  coverImage?: string;
};

// Sample data
const wattpadOriginals: Story[] = [
  {
    id: '1',
    title: 'Marrying Mr. CEO',
    author: 'Rebecca Johnpee',
    coverImage: 'https://via.placeholder.com/200x300/7B1FA2/FFFFFF?text=Marrying+Mr.+CEO',
    category: 'Romance'
  }
];

const readingLists: ReadingList[] = [
  {
    id: '1',
    name: 'Yffj_9\'s Reading List',
    stories: [],
    coverImage: 'https://via.placeholder.com/200x300/CCCCCC/FFFFFF?text=Reading+List'
  },
  {
    id: '2',
    name: 'Liked reading lists',
    stories: [],
    coverImage: 'https://via.placeholder.com/200x300/FFCCBC/FF5722?text=❤️'
  }
];

export default function LibraryScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<'current' | 'archive' | 'lists'>('current');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const tabAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Elements animation refs
  const readingListAnims = useRef(readingLists.map(() => new Animated.Value(0))).current;
  const storyItemAnims = useRef(wattpadOriginals.map(() => new Animated.Value(0))).current;
  
  // Tab indicator animation
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const tabIndicatorWidth = useRef(new Animated.Value(width / 3)).current;
  
  // Header parallax effect
  const scrollY = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Move tab indicator based on active tab
    let position = 0;
    let indicatorWidth = width / 3;
    
    if (activeTab === 'current') {
      position = 0;
    } else if (activeTab === 'archive') {
      position = width / 3;
    } else {
      position = (width / 3) * 2;
    }
    
    Animated.parallel([
      Animated.spring(tabIndicatorPosition, {
        toValue: position,
        useNativeDriver: false,
        friction: 8,
        tension: 50
      }),
      Animated.spring(tabIndicatorWidth, {
        toValue: indicatorWidth,
        useNativeDriver: false,
        friction: 8,
        tension: 50
      })
    ]).start();
    
    // Run animations sequentially
    Animated.sequence([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      
      // Header animation
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Tab animation
      Animated.timing(tabAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Content animation
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animate reading lists with stagger
    Animated.stagger(
      150,
      readingLists.map((_, i) =>
        Animated.timing(readingListAnims[i], {
          toValue: 1,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        })
      )
    ).start();
    
    // Animate story items with stagger
    Animated.stagger(
      150,
      wattpadOriginals.map((_, i) =>
        Animated.timing(storyItemAnims[i], {
          toValue: 1,
          duration: 500,
          delay: 400,
          useNativeDriver: true,
        })
      )
    ).start();
    
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  // Navigation functions
  const navigateToReading = () => {
    router.replace('/reading');
  };
  
  const navigateToBrowse = () => {
    router.replace('/browse');
  };
  
  const navigateToProfile = () => {
    router.replace('/profile');
  };
  
  // Render reading list item
  const renderReadingListItem = ({ item, index }: { item: ReadingList; index: number }) => (
    <Animated.View
      style={[
        styles.readingListCard,
        {
          opacity: readingListAnims[index],
          transform: [
            {
              translateY: readingListAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
            {
              scale: readingListAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.readingListCardContent} 
        activeOpacity={0.7}
      >
        <View style={styles.readingListImageContainer}>
          {item.id === '2' ? (
            <LinearGradient
              colors={['#BFA084', '#A67C52']}
              style={styles.likedListIconContainer}
            >
              <AntDesign name="heart" size={40} color="#FFF" />
            </LinearGradient>
          ) : (
            <View style={styles.readingListImagesStack}>
              <LinearGradient
                colors={['#4a4e82', '#5d628c']} 
                style={styles.mainListImage}
              >
                <Text style={styles.listImagePlaceholder}>w</Text>
              </LinearGradient>
              <LinearGradient
                colors={['#4a4e82', '#5d628c']} 
                style={[styles.stackedListImage, { top: 10, right: -15 }]}
              >
                <Text style={styles.listImagePlaceholder}>w</Text>
              </LinearGradient>
              <LinearGradient
                colors={['#4a4e82', '#5d628c']} 
                style={[styles.stackedListImage, { top: 40, right: -25 }]}
              >
                <Text style={styles.listImagePlaceholder}>w</Text>
              </LinearGradient>
            </View>
          )}
        </View>
        <View style={styles.readingListInfo}>
          <Text style={styles.readingListTitle}>{item.name}</Text>
          <Text style={styles.readingListCount}>
            {item.id === '2' ? '0 lists' : '0 stories'}
          </Text>
          {item.id === '2' && (
            <View style={styles.lockIconContainer}>
              <Feather name="lock" size={16} color="#888" />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.moreOptionsButton}>
          <Feather name="more-vertical" size={20} color="#555" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
  
  // Render story item
  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => (
    <Animated.View
      style={[
        styles.storyCard,
        {
          opacity: storyItemAnims[index],
          transform: [
            {
              translateY: storyItemAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.7}>
        <Image source={{ uri: item.coverImage }} style={styles.storyCover} />
        <View style={styles.storyCheckmark}>
          <AntDesign name="check" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ea" />
      
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Header with parallax effect */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ImageBackground
            source={{ uri: 'https://via.placeholder.com/500x200/f5f3ea/f5f3ea?text=' }}
            style={styles.headerBackground}
          >
            <LinearGradient
              colors={['rgba(245, 243, 234, 0.2)', 'rgba(245, 243, 234, 1)']}
              style={styles.headerGradient}
            >
              <Text style={styles.headerTitle}>Library</Text>
              <TouchableOpacity style={styles.headerOptionsButton}>
                <Feather name="more-vertical" size={24} color="#333" />
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>
        
        {/* Tabs */}
        <Animated.View
          style={[
            styles.tabsContainer,
            {
              opacity: tabAnim,
              transform: [
                {
                  translateY: tabAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('current')}
          >
            <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
              CURRENT READS
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('archive')}
          >
            <Text style={[styles.tabText, activeTab === 'archive' && styles.activeTabText]}>
              ARCHIVE
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('lists')}
          >
            <Text style={[styles.tabText, activeTab === 'lists' && styles.activeTabText]}>
              READING LISTS
            </Text>
          </TouchableOpacity>
          
          {/* Animated Tab Indicator */}
          <Animated.View 
            style={[
              styles.tabIndicator,
              {
                width: tabIndicatorWidth,
                transform: [{ translateX: tabIndicatorPosition }]
              }
            ]} 
          />
        </Animated.View>
        
        {/* Content based on selected tab */}
        <Animated.ScrollView
          style={[
            styles.scrollContent,
            {
              opacity: contentAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {activeTab === 'current' && (
            <View style={styles.currentReadsContainer}>
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Available Offline</Text>
                  <Text style={styles.sectionCount}>0 Stories</Text>
                </View>
                
                <View style={styles.emptyStateContainer}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/200x150/FFF3E0/FF9800?text=Readers' }}
                    style={styles.emptyStateImage}
                  />
                  <Text style={styles.emptyStateTitle}>
                    Stories added to your Offline list will appear here.
                  </Text>
                </View>
              </View>
              
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Wattpad Originals</Text>
                  <Text style={styles.sectionCount}>1 Story</Text>
                </View>
                
                <FlatList
                  data={wattpadOriginals}
                  renderItem={renderStoryItem}
                  keyExtractor={item => item.id}
                  horizontal={false}
                  scrollEnabled={false}
                  numColumns={3}
                  contentContainerStyle={styles.storiesGrid}
                />
              </View>
            </View>
          )}
          
          {activeTab === 'archive' && (
            <View style={styles.archiveContainer}>
              <View style={styles.emptyArchiveContainer}>
                <LinearGradient
                  colors={['#F3E5F5', '#E1BEE7']}
                  style={styles.emptyArchiveIconContainer}
                >
                  <MaterialCommunityIcons name="archive-outline" size={50} color="#9C27B0" />
                </LinearGradient>
                <Text style={styles.emptyArchiveTitle}>
                  You don't have any stories archived.
                </Text>
                <Text style={styles.emptyArchiveDescription}>
                  If a story is updated, it will return to your Library. Archived 
                  stories take up less space on your device but can't be read offline.
                </Text>
                <TouchableOpacity style={styles.selectStoriesButton}>
                  <LinearGradient
                    colors={['#BFA084', '#A67C52']}
                    style={styles.selectStoriesGradient}
                  >
                    <Text style={styles.selectStoriesButtonText}>SELECT STORIES TO ARCHIVE</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {activeTab === 'lists' && (
            <View style={styles.listsContainer}>
              <FlatList
                data={readingLists}
                renderItem={renderReadingListItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </Animated.ScrollView>
      </Animated.View>
      
      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Ionicons name="bookmark" size={24} color="#4a4e82" />
          <Text style={styles.activeTabButtonText}>Library</Text>
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
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={navigateToProfile}
        >
          <Ionicons name="person-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Profile</Text>
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
  content: {
    flex: 1,
  },
  headerBackground: {
    width: '100%',
    height: 110,
  },
  headerGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  header: {
    width: '100%',
    paddingTop: 40,
  },
  headerTitle: {
    fontFamily: 'Birthstone',
    fontSize: 40,
    color: '#4a4e82',
    fontWeight: '500',
  },
  headerOptionsButton: {
    padding: 8,
    marginBottom: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4a4e82',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#A67C52',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#f5f3ea',
  },
  currentReadsContainer: {
    paddingBottom: 80,
  },
  archiveContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  listsContainer: {
    paddingBottom: 80,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#4a4e82',
    fontWeight: 'bold',
  },
  sectionCount: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#888',
  },
  emptyStateContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateImage: {
    width: 200,
    height: 120,
    marginBottom: 20,
    borderRadius: 8,
  },
  emptyStateTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#5C3D2F',
    textAlign: 'center',
    lineHeight: 24,
  },
  storiesGrid: {
    paddingHorizontal: 16,
  },
  storyCard: {
    width: (width - 48) / 3,
    margin: 4,
  },
  storyCover: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  storyCheckmark: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  readingListCard: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  readingListCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readingListImageContainer: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  readingListImagesStack: {
    width: 70,
    height: 70,
    position: 'relative',
  },
  mainListImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  stackedListImage: {
    width: 24,
    height: 24,
    borderRadius: 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  listImagePlaceholder: {
    fontFamily: 'Birthstone',
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  likedListIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  readingListInfo: {
    flex: 1,
    position: 'relative',
  },
  readingListTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#4a4e82',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingListCount: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#888',
  },
  lockIconContainer: {
    position: 'absolute',
    top: 0,
    right: 30,
  },
  moreOptionsButton: {
    padding: 8,
  },
  emptyArchiveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyArchiveIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyArchiveTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    color: '#4a4e82',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyArchiveDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  selectStoriesButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectStoriesGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectStoriesButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
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