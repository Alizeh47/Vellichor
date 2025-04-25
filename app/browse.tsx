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
  TextInput,
  FlatList,
  Pressable
} from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const { width, height } = Dimensions.get('window');

// Categories data with image URLs and titles
type Category = {
  id: string;
  title: string;
  image: string;
  icon: string;
  color: string;
};

type RecentSearch = {
  id: string;
  query: string;
  count: number;
  color: string;
};

const categories: Category[] = [
  { id: '1', title: 'Romance', image: 'https://via.placeholder.com/150/0066ff/FFFFFF?text=Romance', icon: 'heart', color: '#FF6B6B' },
  { id: '2', title: 'Fanfiction', image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Fanfiction', icon: 'sparkles', color: '#4ECDC4' },
  { id: '3', title: 'LGBTQ+', image: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=LGBTQ%2B', icon: 'heart', color: '#FF6B6B' },
  { id: '4', title: 'Wattpad Originals', image: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Originals', icon: 'sparkles', color: '#4ECDC4' },
  { id: '5', title: 'Werewolf', image: 'https://via.placeholder.com/150/A569BD/FFFFFF?text=Werewolf', icon: 'heart', color: '#FF6B6B' },
  { id: '6', title: 'New Adult', image: 'https://via.placeholder.com/150/5DADE2/FFFFFF?text=New+Adult', icon: 'sparkles', color: '#4ECDC4' },
  { id: '7', title: 'Fantasy', image: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Fantasy', icon: 'sparkles', color: '#4ECDC4' },
  { id: '8', title: 'Short Story', image: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Short+Story', icon: 'search', color: '#45B7D1' },
  { id: '9', title: 'Teen Fiction', image: 'https://via.placeholder.com/150/7FB3D5/FFFFFF?text=Teen+Fiction', icon: 'heart', color: '#FF6B6B' },
  { id: '10', title: 'Historical Fiction', image: 'https://via.placeholder.com/150/E67E22/FFFFFF?text=Historical', icon: 'time', color: '#D7A774' },
  { id: '11', title: 'Paranormal', image: 'https://via.placeholder.com/150/00CED1/FFFFFF?text=Paranormal', icon: 'heart', color: '#FF6B6B' },
  { id: '12', title: 'Editor\'s Picks', image: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=Editor\'s+Picks', icon: 'sparkles', color: '#4ECDC4' },
  { id: '13', title: 'Humor', image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Humor', icon: 'heart', color: '#FF6B6B' },
  { id: '14', title: 'Horror', image: 'https://via.placeholder.com/150/708090/FFFFFF?text=Horror', icon: 'skull', color: '#6B5B95' },
  { id: '15', title: 'Contemporary Lit', image: 'https://via.placeholder.com/150/1E90FF/FFFFFF?text=Contemporary', icon: 'heart', color: '#FF6B6B' },
  { id: '16', title: 'Diverse Lit', image: 'https://via.placeholder.com/150/008080/FFFFFF?text=Diverse', icon: 'sparkles', color: '#4ECDC4' },
  { id: '17', title: 'Mystery', image: 'https://via.placeholder.com/150/556B2F/FFFFFF?text=Mystery', icon: 'search', color: '#45B7D1' },
  { id: '18', title: 'Thriller', image: 'https://via.placeholder.com/150/444444/FFFFFF?text=Thriller', icon: 'flash', color: '#FF9671' },
  { id: '19', title: 'Science Fiction', image: 'https://via.placeholder.com/150/00BFFF/FFFFFF?text=Sci-Fi', icon: 'rocket', color: '#845EC2' },
  { id: '20', title: 'The Wattys', image: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Wattys', icon: 'heart', color: '#FF6B6B' },
  { id: '21', title: 'Adventure', image: 'https://via.placeholder.com/150/F0F8FF/000000?text=Adventure', icon: 'compass', color: '#88B04B' },
  { id: '22', title: 'Non-Fiction', image: 'https://via.placeholder.com/150/6495ED/FFFFFF?text=Non-Fiction', icon: 'book', color: '#FF6B6B' },
  { id: '23', title: 'Poetry', image: 'https://via.placeholder.com/150/FFEBCD/000000?text=Poetry', icon: 'sparkles', color: '#4ECDC4' },
];

// Recent searches data with color variety
const recentSearches: RecentSearch[] = [
  { id: '1', query: 'Fantasy Adventure', count: 247, color: '#4a4e82' },
  { id: '2', query: 'Mystery Novels', count: 182, color: '#3a7ca5' },
  { id: '3', query: 'Romantic Fiction', count: 156, color: '#d25a7e' },
  { id: '4', query: 'Classic Literature', count: 133, color: '#947e5d' },
  { id: '5', query: 'Science Fiction', count: 201, color: '#3d7068' },
];

export default function BrowseScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const staggerAnimations = useRef(categories.map(() => new Animated.Value(0))).current;
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const recentSearchesAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const recentItemAnims = useRef(recentSearches.map(() => new Animated.Value(0))).current;
  
  // Search text state
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Animation when component mounts
  useEffect(() => {
    // Main fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Search bar animation
    Animated.timing(searchBarAnim, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
    
    // Recent searches animation
    Animated.timing(recentSearchesAnim, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();
    
    // Recent search items animations
    recentSearches.forEach((_, i) => {
      Animated.timing(recentItemAnims[i], {
        toValue: 1,
        duration: 400,
        delay: 300 + i * 80,
        useNativeDriver: true,
      }).start();
    });
    
    // Browse categories title animation
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 400,
      delay: 600,
      useNativeDriver: true,
    }).start();
    
    // Staggered animations for the category items
    const staggerAnimSequence = categories.map((_, i) => 
      Animated.timing(staggerAnimations[i], {
        toValue: 1,
        duration: 400,
        delay: 700 + i * 30,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(20, staggerAnimSequence).start();
  }, []);

  // Handle category selection
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Navigate to reading screen
  const navigateToReading = () => {
    router.replace('/reading');
  };

  // Navigate to profile screen
  const navigateToProfile = () => {
    router.replace('/profile');
  };

  // Render recent search item
  const renderRecentSearchItem = ({ item, index }: { item: RecentSearch; index: number }) => (
    <Animated.View
      style={{
        opacity: recentItemAnims[index],
        transform: [
          { 
            translateX: recentItemAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            })
          }
        ]
      }}
    >
      <TouchableOpacity 
        style={styles.recentSearchItem}
        onPress={() => setSearchText(item.query)}
        activeOpacity={0.7}
      >
        <View style={[styles.recentSearchIconContainer, { backgroundColor: item.color }]}>
          <Ionicons name="search-outline" size={16} color="#fff" />
        </View>
        <View style={styles.recentSearchContent}>
          <Text style={styles.recentSearchText}>{item.query}</Text>
          <Text style={styles.recentSearchCount}>{item.count} stories</Text>
        </View>
        <TouchableOpacity 
          style={styles.recentSearchRemoveButton}
          onPress={() => console.log(`Remove search: ${item.query}`)}
        >
          <Ionicons name="close" size={16} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render category item
  const renderCategoryItem = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      style={[
        styles.categoryItemContainer,
        {
          opacity: staggerAnimations[index],
          transform: [
            { 
              translateY: staggerAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            },
            {
              scale: staggerAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }
          ]
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.categoryItem,
          selectedCategory === item.id && styles.selectedCategoryItem,
          { backgroundColor: item.color + '22' }
        ]}
        onPress={() => handleCategoryPress(item.id)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.categoryImage} 
          resizeMode="cover"
        />
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
        {selectedCategory === item.id && (
          <View style={styles.selectedIndicator}>
            <Feather name="check" size={16} color="#4a4e82" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Vellichor</Text>
          </View>

          <View style={styles.searchContainer}>
            <Animated.View 
              style={[
                styles.searchBar, 
                {
                  opacity: searchBarAnim,
                  transform: [
                    { 
                      translateY: searchBarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                      })
                    }
                  ]
                }
              ]}
            >
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for stories and people"
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={18} color="#888" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {searchText.length === 0 && (
            <View>
              <Animated.Text 
                style={[
                  styles.sectionTitle,
                  {
                    opacity: recentSearchesAnim,
                    transform: [
                      {
                        translateY: recentSearchesAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                Recent Searches
              </Animated.Text>
              <View style={styles.recentSearchesContainer}>
                <FlatList
                  data={recentSearches}
                  renderItem={({ item, index }) => renderRecentSearchItem({ item, index })}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.recentSearchesList}
                />
              </View>
              
              <Animated.Text 
                style={[
                  styles.sectionTitle,
                  {
                    opacity: titleAnim,
                    transform: [
                      {
                        translateY: titleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                Browse Categories
              </Animated.Text>
            </View>
          )}

          <View style={styles.categoriesGrid}>
            {categories.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.categoryItemContainer,
                  {
                    opacity: staggerAnimations[index],
                    transform: [
                      { 
                        translateY: staggerAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        })
                      }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress(item.id)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.categoryImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
      
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
          onPress={() => router.replace('/reading')}
        >
          <Ionicons name="book-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Ionicons name="search" size={24} color="#4a4e82" />
          <Text style={styles.activeTabButtonText}>Discover</Text>
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
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Birthstone',
    fontSize: 56,
    color: '#4a4e82',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 10,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'SpaceMono',
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  recentSearchesContainer: {
    marginBottom: 20,
  },
  recentSearchesList: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recentSearchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a4e82',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentSearchContent: {
    flex: 1,
  },
  recentSearchText: {
    fontFamily: 'SpaceMono',
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  recentSearchCount: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#888',
  },
  recentSearchRemoveButton: {
    padding: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 8,
  },
  categoryItemContainer: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 12,
  },
  categoryItem: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    height: 130,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryImage: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  categoryTitleContainer: {
    padding: 12,
    height: 40,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryItem: {
    borderWidth: 2,
    borderColor: '#4a4e82',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a4e82',
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