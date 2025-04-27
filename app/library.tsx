import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  ImageBackground,
  Modal,
  GestureResponderEvent,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { ToastAndroid } from 'react-native';

SplashScreen.preventAutoHideAsync();
const { width, height } = Dimensions.get('window');

// Types
type Story = {
  id: string;
  title: string;
  author: string;
  coverImagePath: string;
  category: string;
};

type ReadingList = {
  id: string;
  name: string;
  stories: Story[];
  coverImage?: string;
};

// Type for bookmarked books
type BookmarkedBook = {
  id: string;
  title: string;
  author: string;
  coverImagePath: string;
  currentPage: number;
  totalPages: number;
  lastReadTimestamp: string;
};

// Type for wishlist books from reading screen
type WishlistedBook = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
};

// Default reading lists data
const defaultReadingLists: ReadingList[] = [
  {
    id: '1',
    name: 'My Reading List',
    stories: [],
  },
  {
    id: '2',
    name: 'Liked reading lists',
    stories: [],
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
  const tabAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Elements animation refs
  const readingListAnims = useRef(defaultReadingLists.map(() => new Animated.Value(0))).current;
  
  // Tab indicator animation
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const tabIndicatorWidth = useRef(new Animated.Value(width / 3)).current;
  
  // Header parallax effect
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [bookmarkedBooks, setBookmarkedBooks] = useState<BookmarkedBook[]>([]);
  const bookmarkedBookAnims = useRef<Animated.Value[]>([]).current;
  
  // State for wishlist books
  const [wishlistedBooks, setWishlistedBooks] = useState<WishlistedBook[]>([]);
  const wishlistedBookAnims = useRef<Animated.Value[]>([]).current;

  // Premium modal state
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [premiumFeatureType, setPremiumFeatureType] = useState<'offline' | 'archive'>('offline');
  
  // State for reading lists
  const [readingLists, setReadingLists] = useState<ReadingList[]>(defaultReadingLists);
  
  // State for modals
  const [addToListModalVisible, setAddToListModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookmarkedBook | WishlistedBook | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Add to reading list modal animations
  const listModalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const listModalOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Bookmarked book animation refs
  const bookmarkedLastTapRefs = useRef<{[key: string]: number}>({}).current;
  // Wishlisted book animation refs  
  const wishlistedLastTapRefs = useRef<{[key: string]: number}>({}).current;
  
  // Show premium modal
  const showPremiumModal = useCallback((featureType: 'offline' | 'archive' = 'offline') => {
    setPremiumFeatureType(featureType);
    setPremiumModalVisible(true);
  }, []);
  
  // Helper for onPress
  const handleArchivePress = useCallback((_event: GestureResponderEvent) => {
    showPremiumModal('archive');
  }, [showPremiumModal]);
  
  // Helper for premium button press
  const handlePremiumPress = useCallback((_event: GestureResponderEvent) => {
    showPremiumModal('offline');
  }, [showPremiumModal]);
  
  // Hide premium modal
  const hidePremiumModal = useCallback(() => {
    setPremiumModalVisible(false);
  }, []);

  // Premium modal animations
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Animate modal in/out
  useEffect(() => {
    if (premiumModalVisible) {
      Animated.parallel([
        Animated.timing(modalScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animations when modal is hidden
      modalScaleAnim.setValue(0.8);
      modalOpacityAnim.setValue(0);
    }
  }, [premiumModalVisible]);

  // Load bookmarked books from AsyncStorage
  useEffect(() => {
    loadBookmarkedBooks();
    loadWishlistedBooks();
    loadReadingLists();
    
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const loadBookmarkedBooks = async () => {
    try {
      const bookmarkedBooksJson = await AsyncStorage.getItem('bookmarkedBooks');
      if (bookmarkedBooksJson) {
        const books = JSON.parse(bookmarkedBooksJson);
        setBookmarkedBooks(books);
        
        // Create animations for each book
        while (bookmarkedBookAnims.length < books.length) {
          bookmarkedBookAnims.push(new Animated.Value(0));
        }
        
        // Animate each book with stagger
        Animated.stagger(
          150,
          books.map((_: BookmarkedBook, i: number) =>
            Animated.timing(bookmarkedBookAnims[i], {
              toValue: 1,
              duration: 500,
              delay: 300,
              useNativeDriver: true,
            })
          )
        ).start();
      }
    } catch (error) {
      console.error('Error loading bookmarked books:', error);
    }
  };

  // Load wishlisted books from AsyncStorage
  const loadWishlistedBooks = async () => {
    try {
      const wishlistedBooksJson = await AsyncStorage.getItem('wishlistedBooks');
      if (wishlistedBooksJson) {
        const books = JSON.parse(wishlistedBooksJson);
        setWishlistedBooks(books);
        
        // Create animations for each book
        while (wishlistedBookAnims.length < books.length) {
          wishlistedBookAnims.push(new Animated.Value(0));
        }
        
        // Animate each book with stagger
        Animated.stagger(
          150,
          books.map((_: WishlistedBook, i: number) =>
            Animated.timing(wishlistedBookAnims[i], {
              toValue: 1,
              duration: 500,
              delay: 300,
              useNativeDriver: true,
            })
          )
        ).start();
      }
    } catch (error) {
      console.error('Error loading wishlisted books:', error);
    }
  };

  // Load reading lists from AsyncStorage
  const loadReadingLists = async () => {
    try {
      const listsJson = await AsyncStorage.getItem('userReadingLists');
      if (listsJson) {
        const lists = JSON.parse(listsJson);
        setReadingLists(lists);
      } else {
        // If no reading lists found, set the initial state
        setReadingLists(defaultReadingLists);
      }
    } catch (error) {
      console.error('Error loading reading lists:', error);
    }
  };

  // Save reading lists to AsyncStorage
  const saveReadingLists = async (lists: ReadingList[]) => {
    try {
      await AsyncStorage.setItem('userReadingLists', JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving reading lists:', error);
    }
  };

  const openBookReader = useCallback((book: BookmarkedBook) => {
    router.push({
      pathname: '/book-reader',
      params: {
        bookTitle: book.title,
        bookAuthor: book.author,
        currentPage: book.currentPage.toString(),
        totalPages: book.totalPages.toString()
      }
    });
  }, []);

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
    
    // Animate reading lists with stagger when lists tab is active
    if (activeTab === 'lists') {
      // Reset animations first
      readingListAnims.forEach(anim => anim.setValue(0));
      
    Animated.stagger(
      150,
      readingLists.map((_, i) =>
        Animated.timing(readingListAnims[i], {
          toValue: 1,
          duration: 500,
            delay: 200,
          useNativeDriver: true,
        })
      )
    ).start();
    }
  }, [activeTab]);

  // Navigation functions
  const navigateToReading = useCallback(() => {
    router.replace('/reading');
  }, []);
  
  const navigateToBrowse = useCallback(() => {
    router.replace('/browse');
  }, []);
  
  const navigateToProfile = useCallback(() => {
    router.replace('/profile');
  }, []);
  
  // Render reading list item
  const renderReadingListItem = useCallback(({ item, index }: { item: ReadingList; index: number }) => (
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
        onPress={() => {
          if (item.id === '2') {
            // Jump to the "Books You've Liked" section
            setActiveTab('lists');
          }
        }}
      >
        <View style={styles.readingListImageContainer}>
          {item.id === '2' ? (
            <LinearGradient
              colors={['#322822', '#4a3c35']}
              style={styles.likedListIconContainer}
            >
              <AntDesign name="heart" size={40} color="#FFF" />
            </LinearGradient>
          ) : (
            <View style={styles.readingListImagesStack}>
              <Image 
                source={require('../assets/images/book-covers/fantasy_book1.jpg')} 
                style={styles.mainListImage}
              />
              <Image 
                source={require('../assets/images/book-covers/history_book1.jpg')} 
                style={[styles.stackedListImage, { top: 10, right: -15 }]}
              />
              <Image 
                source={require('../assets/images/book-covers/mystery_book1.jpg')} 
                style={[styles.stackedListImage, { top: 40, right: -25 }]}
              />
            </View>
          )}
        </View>
        <View style={styles.readingListInfo}>
          <Text style={styles.readingListTitle}>{item.name}</Text>
          <Text style={styles.readingListCount}>
            {item.id === '2' ? `${wishlistedBooks.length} books` : '0 stories'}
          </Text>
          {item.id === '2' && wishlistedBooks.length > 0 && (
            <Text style={styles.readingListNote}>
              Books you liked in Reading section
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.moreOptionsButton}>
          <Feather name="more-vertical" size={20} color="#555" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  ), [readingListAnims, wishlistedBooks]);

  // Render bookmarked book item
  const renderBookmarkedBookItem = useCallback(({ item, index }: { item: BookmarkedBook; index: number }) => {
    // Check if animation is available
    const animValue = index < bookmarkedBookAnims.length 
      ? bookmarkedBookAnims[index] 
      : new Animated.Value(1);

    // Get the book cover image based on title (using a path-to-require mapping)
    const getBookCoverImage = (path: string) => {
      if (path.includes('mystery_book1')) {
        return require('../assets/images/book-covers/mystery_book1.jpg');
      } else if (path.includes('fantasy_book1')) {
        return require('../assets/images/book-covers/fantasy_book1.jpg');
      } else if (path.includes('fantasy_book2')) {
        return require('../assets/images/book-covers/fantasy_book2.jpg');
      } else if (path.includes('crime_book1')) {
        return require('../assets/images/book-covers/crime_book1.jpg');
      } else if (path.includes('short_story')) {
        return require('../assets/images/book-covers/short_story_book1.jpg');
      } else if (path.includes('romance')) {
        return require('../assets/images/book-covers/romance_book1.jpg');
      } else if (path.includes('history')) {
        return require('../assets/images/book-covers/history_book1.jpg');
      } else if (path.includes('scifi')) {
        return require('../assets/images/book-covers/scifi_book1.jpg');
      } else {
        return require('../assets/images/book-covers/fantasy_book1.jpg');
      }
    };

    const handleDoubleTap = () => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (now - (bookmarkedLastTapRefs[item.id] || 0) < DOUBLE_PRESS_DELAY) {
        showAddToListModal(item, true);
      }
      bookmarkedLastTapRefs[item.id] = now;
    };

    return (
      <Animated.View
        style={[
          styles.storyCard,
          {
            opacity: animValue,
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={(event) => {
            handleDoubleTap();
            // Only open book reader on single tap
            const now = Date.now();
            const DOUBLE_PRESS_DELAY = 300;
            if (now - (bookmarkedLastTapRefs[item.id] || 0) >= DOUBLE_PRESS_DELAY) {
              setTimeout(() => {
                // If this was a single tap (no second tap followed), open the book
                if (now - (bookmarkedLastTapRefs[item.id] || 0) >= DOUBLE_PRESS_DELAY) {
                  openBookReader(item);
                }
              }, DOUBLE_PRESS_DELAY);
            }
          }}
        >
          <Image 
            source={getBookCoverImage(item.coverImagePath)} 
            style={styles.storyCover} 
          />
          <View style={styles.bookProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(item.currentPage / item.totalPages) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((item.currentPage / item.totalPages) * 100)}%
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [bookmarkedBookAnims, openBookReader, bookmarkedLastTapRefs]);

  // Render wishlisted book item
  const renderWishlistedBookItem = useCallback(({ item, index }: { item: WishlistedBook; index: number }) => {
    // Check if animation is available
    const animValue = index < wishlistedBookAnims.length 
      ? wishlistedBookAnims[index] 
      : new Animated.Value(1);

    // Get the book cover image based on path
    const getBookCoverImage = (coverImage: string) => {
      if (typeof coverImage === 'string') {
        // If it's a string URL, try to match with local assets
        if (coverImage.includes('mystery_book1')) {
          return require('../assets/images/book-covers/mystery_book1.jpg');
        } else if (coverImage.includes('fantasy_book1')) {
          return require('../assets/images/book-covers/fantasy_book1.jpg');
        } else if (coverImage.includes('fantasy_book2')) {
          return require('../assets/images/book-covers/fantasy_book2.jpg');
        } else if (coverImage.includes('crime_book1')) {
          return require('../assets/images/book-covers/crime_book1.jpg');
        } else if (coverImage.includes('short_story')) {
          return require('../assets/images/book-covers/short_story_book1.jpg');
        } else if (coverImage.includes('romance')) {
          return require('../assets/images/book-covers/romance_book1.jpg');
        } else if (coverImage.includes('history')) {
          return require('../assets/images/book-covers/history_book1.jpg');
        } else if (coverImage.includes('scifi')) {
          return require('../assets/images/book-covers/scifi_book1.jpg');
        } else {
          // Default fallback
          return require('../assets/images/book-covers/fantasy_book1.jpg');
        }
      } else {
        // It's already a require() asset
        return coverImage;
      }
    };

    const handleDoubleTap = () => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (now - (wishlistedLastTapRefs[item.id] || 0) < DOUBLE_PRESS_DELAY) {
        showAddToListModal(item, false);
      }
      wishlistedLastTapRefs[item.id] = now;
    };

  return (
      <Animated.View 
        style={[
          styles.storyCard,
          {
            opacity: animValue,
              transform: [
                {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                  outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={(event) => {
            handleDoubleTap();
            // Only open book reader on single tap
            const now = Date.now();
            const DOUBLE_PRESS_DELAY = 300;
            if (now - (wishlistedLastTapRefs[item.id] || 0) >= DOUBLE_PRESS_DELAY) {
              setTimeout(() => {
                // If this was a single tap (no second tap followed), open the book
                if (now - (wishlistedLastTapRefs[item.id] || 0) >= DOUBLE_PRESS_DELAY) {
                  openBookReader({
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    coverImagePath: typeof item.coverImage === 'string' ? item.coverImage : 'fantasy_book1.jpg',
                    currentPage: 1,
                    totalPages: 345,
                    lastReadTimestamp: new Date().toISOString()
                  });
                }
              }, DOUBLE_PRESS_DELAY);
            }
          }}
        >
          <Image 
            source={getBookCoverImage(item.coverImage)} 
            style={styles.storyCover} 
          />
          <View style={styles.wishlistBadge}>
            <AntDesign name="heart" size={16} color="#fff" />
          </View>
              </TouchableOpacity>
        </Animated.View>
    );
  }, [wishlistedBookAnims, openBookReader, wishlistedLastTapRefs]);

  // Render a book in the reading list
  const renderReadingListBookItem = useCallback(({ item, index, listId }: { item: Story; index: number; listId: string }) => {
    // Get the book cover image based on path
    const getBookCoverImage = (path: string) => {
      if (path.includes('mystery_book1')) {
        return require('../assets/images/book-covers/mystery_book1.jpg');
      } else if (path.includes('fantasy_book1')) {
        return require('../assets/images/book-covers/fantasy_book1.jpg');
      } else if (path.includes('fantasy_book2')) {
        return require('../assets/images/book-covers/fantasy_book2.jpg');
      } else if (path.includes('crime_book1')) {
        return require('../assets/images/book-covers/crime_book1.jpg');
      } else if (path.includes('short_story')) {
        return require('../assets/images/book-covers/short_story_book1.jpg');
      } else if (path.includes('romance')) {
        return require('../assets/images/book-covers/romance_book1.jpg');
      } else if (path.includes('history')) {
        return require('../assets/images/book-covers/history_book1.jpg');
      } else if (path.includes('scifi')) {
        return require('../assets/images/book-covers/scifi_book1.jpg');
      } else {
        return require('../assets/images/book-covers/fantasy_book1.jpg');
      }
    };

    return (
      <View style={styles.readingListBookItem}>
        <Image 
          source={getBookCoverImage(item.coverImagePath)} 
          style={styles.readingListBookCover} 
        />
        <View style={styles.readingListBookInfo}>
          <Text style={styles.readingListBookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.readingListBookAuthor} numberOfLines={1}>{item.author}</Text>
          <TouchableOpacity 
            style={styles.readingListBookRemove}
            onPress={() => removeFromReadingList(listId, item.id)}
          >
            <Text style={styles.readingListBookRemoveText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);
  
  // Update render for the reading lists section
  const renderMyReadingList = () => {
    const myList = readingLists.find(list => list.id === '1');
    
    if (!myList) return null;
    
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Reading List</Text>
          <Text style={styles.sectionCount}>{myList.stories.length} Books</Text>
        </View>
        
        {myList.stories.length > 0 ? (
          <View style={styles.readingListBooks}>
            {myList.stories.map((story, index) => (
              <View key={`reading-list-item-${story.id}`}>
                {renderReadingListBookItem({ item: story, index, listId: '1' })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Image
              source={require('../assets/images/book-covers/fantasy_book1.jpg')}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateTitle}>
              Your reading list is empty
            </Text>
            <Text style={styles.emptyStateDescription}>
              Double-tap on any book from your library or liked books to add them to your reading list
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Show add to reading list modal
  const showAddToListModal = (book: BookmarkedBook | WishlistedBook, isFromBookmarks: boolean) => {
    setSelectedBook(book);
    setIsBookmarked(isFromBookmarks);
    setAddToListModalVisible(true);
    
    // Animate the modal
    Animated.parallel([
      Animated.timing(listModalScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(listModalOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  // Hide add to reading list modal
  const hideAddToListModal = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(listModalScaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(listModalOpacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      setAddToListModalVisible(false);
      setSelectedBook(null);
    });
  };
  
  // Add book to reading list
  const addBookToReadingList = () => {
    if (!selectedBook) return;
    
    // Create a story from the selected book
    const newStory: Story = {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      coverImagePath: isBookmarked 
        ? (selectedBook as BookmarkedBook).coverImagePath 
        : (selectedBook as WishlistedBook).coverImage,
      category: 'User Added',
    };
    
    // Update the reading list
    const updatedLists = readingLists.map(list => {
      if (list.id === '1') { // My Reading List has id '1'
        // Check if book already exists in the list
        if (!list.stories.some(story => story.id === newStory.id)) {
          return {
            ...list,
            stories: [...list.stories, newStory]
          };
        }
      }
      return list;
    });
    
    // Update state and save to storage
    setReadingLists(updatedLists);
    saveReadingLists(updatedLists);
    
    // Hide modal
    hideAddToListModal();
    
    // Show success message
    Platform.OS === 'android' 
      ? ToastAndroid.show(`Added "${selectedBook.title}" to My Reading List`, ToastAndroid.SHORT)
      : Alert.alert('Success', `Added "${selectedBook.title}" to My Reading List`);
  };
  
  // Remove book from reading list
  const removeFromReadingList = (listId: string, storyId: string) => {
    const updatedLists = readingLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          stories: list.stories.filter(story => story.id !== storyId)
        };
      }
      return list;
    });
    
    // Update state and save to storage
    setReadingLists(updatedLists);
    saveReadingLists(updatedLists);
  };

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
                  <Text style={styles.sectionTitle}>My Library</Text>
                  <Text style={styles.sectionCount}>{bookmarkedBooks.length} Books</Text>
                </View>
                
                {bookmarkedBooks.length > 0 ? (
                  <FlatList
                    data={bookmarkedBooks}
                    renderItem={renderBookmarkedBookItem}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    scrollEnabled={false}
                    numColumns={3}
                    contentContainerStyle={styles.storiesGrid}
                  />
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Image
                      source={require('../assets/images/book-covers/fantasy_book1.jpg')}
                      style={styles.emptyStateImage}
                    />
                    <Text style={styles.emptyStateTitle}>
                      Your library is empty
                    </Text>
                    <Text style={styles.emptyStateDescription}>
                      Bookmark books while reading to add them to your library
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Available Offline</Text>
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>PREMIUM</Text>
                  </View>
                </View>
                
                <View style={styles.premiumFeatureContainer}>
                  <LinearGradient
                    colors={['#322822', '#4a3c35']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.premiumGradient}
                  >
                    <View style={styles.premiumContent}>
                      <View style={styles.premiumTextContainer}>
                        <Text style={styles.premiumTitle}>Unlock Offline Reading</Text>
                        <Text style={styles.premiumDescription}>
                          Download your favorite books and read them anywhere, anytime - even without internet connection.
                        </Text>
                        <TouchableOpacity 
                          style={styles.premiumButton} 
                          onPress={handlePremiumPress}
                        >
                          <Text style={styles.premiumButtonText}>GET PREMIUM</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.offlineBooksContainer}>
                  <Image
                          source={require('../assets/images/book-covers/fantasy_book1.jpg')} 
                          style={[styles.offlineBook, { top: 0, left: 0, transform: [{ rotate: '-5deg' }] }]}
                        />
                        <Image 
                          source={require('../assets/images/book-covers/mystery_book1.jpg')} 
                          style={[styles.offlineBook, { top: 15, left: 20, transform: [{ rotate: '5deg' }] }]}
                        />
                        <Image 
                          source={require('../assets/images/book-covers/history_book1.jpg')} 
                          style={[styles.offlineBook, { top: 5, left: 40, transform: [{ rotate: '-3deg' }] }]}
                        />
                        <Ionicons name="cloud-download-outline" size={40} color="#FFF" style={styles.downloadIcon} />
                </View>
              </View>
                  </LinearGradient>
                </View>
              </View>
            </View>
          )}
          
          {activeTab === 'archive' && (
            <View style={styles.archiveContainer}>
              <Animatable.View 
                animation="fadeIn" 
                duration={800} 
                style={styles.emptyArchiveContainer}
              >
                <Animatable.View 
                  animation="pulse" 
                  iterationCount="infinite" 
                  duration={2000}
                  style={styles.emptyArchiveIconContainer}
                >
                <LinearGradient
                  colors={['#F3E5F5', '#E1BEE7']}
                    style={styles.emptyArchiveIconGradient}
                >
                    <MaterialCommunityIcons name="archive-outline" size={50} color="#322822" />
                </LinearGradient>
                </Animatable.View>
                <Animatable.Text 
                  animation="fadeInUp" 
                  duration={800} 
                  delay={200}
                  style={styles.emptyArchiveTitle}
                >
                  You don't have any stories archived.
                </Animatable.Text>
                <Animatable.Text 
                  animation="fadeInUp" 
                  duration={800} 
                  delay={400}
                  style={styles.emptyArchiveDescription}
                >
                  If a story is updated, it will return to your Library. Archived 
                  stories take up less space on your device but can't be read offline.
                </Animatable.Text>
                <Animatable.View 
                  animation="fadeIn" 
                  duration={800} 
                  delay={600}
                >
                  <TouchableOpacity 
                    style={styles.selectStoriesButton}
                    onPress={handleArchivePress}
                  >
                  <LinearGradient
                      colors={['#322822', '#4a3c35']}
                    style={styles.selectStoriesGradient}
                  >
                    <Text style={styles.selectStoriesButtonText}>SELECT STORIES TO ARCHIVE</Text>
                  </LinearGradient>
                </TouchableOpacity>
                  <View style={styles.premiumArchiveNote}>
                    <Animatable.View animation="flash" iterationCount={3} duration={1000} delay={1000}>
                      <Ionicons name="star" size={16} color="#322822" />
                    </Animatable.View>
                    <Text style={styles.premiumArchiveNoteText}>Premium Feature</Text>
              </View>
                </Animatable.View>
              </Animatable.View>
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
              
              {/* My Reading List display */}
              {renderMyReadingList()}
              
              {/* Wishlist books display */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Books You've Liked</Text>
                  <Text style={styles.sectionCount}>{wishlistedBooks.length} Books</Text>
                </View>
                
                {wishlistedBooks.length > 0 ? (
                  <FlatList
                    data={wishlistedBooks}
                    renderItem={renderWishlistedBookItem}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    scrollEnabled={false}
                    numColumns={3}
                    contentContainerStyle={styles.storiesGrid}
                  />
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <LinearGradient
                      colors={['#F3E5F5', '#E1BEE7']}
                      style={styles.emptyWishlistIconContainer}
                    >
                      <AntDesign name="heart" size={40} color="#322822" />
                    </LinearGradient>
                    <Text style={styles.emptyStateTitle}>
                      Your liked books list is empty
                    </Text>
                    <Text style={styles.emptyStateDescription}>
                      Use the ♡ button when browsing books in the Reading section to add them to your likes
                    </Text>
                    <TouchableOpacity 
                      style={styles.browseMoreButton}
                      onPress={() => router.replace('/reading')}
                    >
                      <LinearGradient
                        colors={['#322822', '#4a3c35']}
                        style={styles.browseMoreGradient}
                      >
                        <Text style={styles.browseMoreButtonText}>BROWSE BOOKS</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </Animated.View>
      
      {/* Premium Modal */}
      <Modal
        visible={premiumModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hidePremiumModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                opacity: modalOpacityAnim,
                transform: [{ scale: modalScaleAnim }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>VELLICHOR PREMIUM</Text>
              <TouchableOpacity onPress={hidePremiumModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.premiumFeaturesContainer}>
                <Image 
                  source={require('../assets/images/book-covers/premium_banner.jpg')} 
                  style={styles.premiumBanner}
                  resizeMode="cover"
                />
                
                <Text style={styles.premiumModalTitle}>
                  {premiumFeatureType === 'offline' 
                    ? 'Enhance Your Reading Experience' 
                    : 'Organize Your Library Like a Pro'}
                </Text>
                
                {premiumFeatureType === 'offline' ? (
                  <>
                    <View style={styles.premiumFeature}>
                      <View style={styles.featureIconContainer}>
                        <Ionicons name="cloud-download" size={24} color="#322822" />
                      </View>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Offline Reading</Text>
                        <Text style={styles.featureDescription}>Download books and read without internet connection</Text>
                      </View>
                    </View>
                    
                    <View style={styles.premiumFeature}>
                      <View style={styles.featureIconContainer}>
                        <Ionicons name="moon" size={24} color="#322822" />
                      </View>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Dark Mode</Text>
                        <Text style={styles.featureDescription}>Enjoy comfortable reading any time of day</Text>
                      </View>
                    </View>
                    
                    <View style={styles.premiumFeature}>
                      <View style={styles.featureIconContainer}>
                        <Ionicons name="text" size={24} color="#322822" />
                      </View>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Custom Fonts</Text>
                        <Text style={styles.featureDescription}>Choose from a wide variety of premium fonts</Text>
                      </View>
                    </View>
                    
                    <View style={styles.premiumFeature}>
                      <View style={styles.featureIconContainer}>
                        <Ionicons name="bookmark" size={24} color="#322822" />
                      </View>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>Unlimited Bookmarks</Text>
                        <Text style={styles.featureDescription}>Save as many favorite spots as you want</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <Animatable.View 
                      animation="fadeIn" 
                      duration={800}
                      style={styles.archiveIllustration}
                    >
                      <View style={styles.archiveIllustrationContent}>
                        <View style={styles.archiveBooks}>
                          <Animatable.Image 
                            animation="slideInLeft"
                            duration={800}
                            source={require('../assets/images/book-covers/fantasy_book1.jpg')} 
                            style={[styles.archiveBook, { transform: [{ rotate: '-10deg' }] }]}
                          />
                          <Animatable.Image 
                            animation="slideInLeft"
                            duration={800}
                            delay={200}
                            source={require('../assets/images/book-covers/romance_book1.jpg')} 
                            style={[styles.archiveBook, { transform: [{ rotate: '5deg' }] }]}
                          />
                          <Animatable.Image 
                            animation="slideInLeft"
                            duration={800}
                            delay={400}
                            source={require('../assets/images/book-covers/scifi_book1.jpg')} 
                            style={[styles.archiveBook, { transform: [{ rotate: '-5deg' }] }]}
                          />
                        </View>
                        <Animatable.View 
                          animation="pulse" 
                          iterationCount="infinite" 
                          duration={1500}
                          style={styles.archiveArrow}
                        >
                          <Ionicons name="arrow-forward" size={30} color="#322822" />
                        </Animatable.View>
                        <Animatable.View 
                          animation="bounceIn"
                          duration={1000}
                          delay={800}
                          style={styles.archiveBox}
                        >
                          <MaterialCommunityIcons name="archive" size={40} color="#322822" />
                        </Animatable.View>
                      </View>
                    </Animatable.View>
                    
                    <Animatable.View animation="fadeIn" duration={800} delay={400}>
                      <View style={styles.premiumFeature}>
                        <View style={styles.featureIconContainer}>
                          <MaterialCommunityIcons name="archive" size={24} color="#322822" />
                        </View>
                        <View style={styles.featureTextContainer}>
                          <Text style={styles.featureTitle}>Smart Archives</Text>
                          <Text style={styles.featureDescription}>Organize your library by archiving finished books</Text>
                        </View>
                      </View>
                      
                      <View style={styles.premiumFeature}>
                        <View style={styles.featureIconContainer}>
                          <Ionicons name="save" size={24} color="#322822" />
                        </View>
                        <View style={styles.featureTextContainer}>
                          <Text style={styles.featureTitle}>Space Savings</Text>
                          <Text style={styles.featureDescription}>Archived books take up less space on your device</Text>
                        </View>
                      </View>
                      
                      <View style={styles.premiumFeature}>
                        <View style={styles.featureIconContainer}>
                          <Ionicons name="refresh" size={24} color="#322822" />
                        </View>
                        <View style={styles.featureTextContainer}>
                          <Text style={styles.featureTitle}>Auto-Return</Text>
                          <Text style={styles.featureDescription}>Books automatically return to your library when updated</Text>
                        </View>
                      </View>
                      
                      <View style={styles.premiumFeature}>
                        <View style={styles.featureIconContainer}>
                          <Ionicons name="folder" size={24} color="#322822" />
                        </View>
                        <View style={styles.featureTextContainer}>
                          <Text style={styles.featureTitle}>Custom Categories</Text>
                          <Text style={styles.featureDescription}>Create custom archive categories for better organization</Text>
                        </View>
                      </View>
                    </Animatable.View>
                  </>
                )}
              </View>
              
              <View style={styles.pricingContainer}>
                <TouchableOpacity style={styles.pricingOption}>
                  <LinearGradient
                    colors={['#BFA084', '#A67C52']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.pricingGradient}
                  >
                    <Text style={styles.pricingTitle}>MONTHLY</Text>
                    <Text style={styles.pricingPrice}>$4.99</Text>
                    <Text style={styles.pricingPeriod}>per month</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.pricingOption, styles.bestValue]}>
                  <LinearGradient
                    colors={['#322822', '#4a3c35']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.pricingGradient}
                  >
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>BEST VALUE</Text>
                    </View>
                    <Text style={styles.pricingTitle}>YEARLY</Text>
                    <Text style={styles.pricingPrice}>$39.99</Text>
                    <Text style={styles.pricingPeriod}>per year</Text>
                    <Text style={styles.pricingSavings}>Save 33%</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.subscribeCTA} onPress={hidePremiumModal}>
                <LinearGradient
                  colors={['#322822', '#4a3c35']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeGradient}
                >
                  <Text style={styles.subscribeCTAText}>START FREE TRIAL</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <Text style={styles.termsText}>
                7-day free trial, cancel anytime. See terms and conditions.
              </Text>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
      
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
      
      {/* Add to Reading List Modal */}
      <Modal
        visible={addToListModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideAddToListModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              styles.addToListContainer,
              {
                opacity: listModalOpacityAnim,
                transform: [{ scale: listModalScaleAnim }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Reading List?</Text>
              <TouchableOpacity onPress={hideAddToListModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            {selectedBook && (
              <View style={styles.addToListContent}>
                <View style={styles.selectedBookPreview}>
                  <Image 
                    source={isBookmarked 
                      ? (renderBookmarkedBookItem as any).getBookCoverImage((selectedBook as BookmarkedBook).coverImagePath)
                      : (renderWishlistedBookItem as any).getBookCoverImage((selectedBook as WishlistedBook).coverImage)
                    } 
                    style={styles.selectedBookCover} 
                  />
                  <View style={styles.selectedBookInfo}>
                    <Text style={styles.selectedBookTitle}>{selectedBook.title}</Text>
                    <Text style={styles.selectedBookAuthor}>{selectedBook.author}</Text>
                    <Text style={styles.addToListPrompt}>Would you like to add this book to your reading list?</Text>
                  </View>
                </View>
                
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.modalCancelButton}
                    onPress={hideAddToListModal}
                  >
                    <Text style={styles.modalCancelButtonText}>CANCEL</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addToListButton}
                    onPress={addBookToReadingList}
                  >
                    <LinearGradient
                      colors={['#322822', '#4a3c35']}
                      style={styles.addToListGradient}
                    >
                      <Text style={styles.addToListButtonText}>ADD TO LIST</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
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
    color: '#322822',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#322822',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#f5f3ea',
    paddingBottom: 20,
  },
  currentReadsContainer: {
    paddingBottom: 100,
  },
  archiveContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  listsContainer: {
    paddingBottom: 80,
    paddingTop: 20,
  },
  sectionContainer: {
    marginTop: 30,
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
    color: '#322822',
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
    color: '#322822',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#322822',
    textAlign: 'center',
    marginTop: 10,
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
    marginBottom: 25,
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
    resizeMode: 'cover',
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
    overflow: 'hidden',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
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
    color: '#322822',
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
    color: '#322822',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyArchiveDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#322822',
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
    borderBottomColor: '#322822',
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
    color: '#322822',
    fontWeight: 'bold',
    marginTop: 4,
  },
  bookProgress: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    marginRight: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#322822',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'SpaceMono',
    fontSize: 8,
    color: '#fff',
  },
  premiumBadge: {
    backgroundColor: '#322822',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  premiumText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  premiumFeatureContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  premiumGradient: {
    width: '100%',
    height: '100%',
  },
  premiumContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 10,
  },
  premiumDescription: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    marginBottom: 15,
    opacity: 0.9,
  },
  premiumButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#322822',
  },
  premiumButtonText: {
    color: '#322822',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  offlineBooksContainer: {
    width: 140,
    height: 140,
    position: 'relative',
  },
  offlineBook: {
    width: 80,
    height: 120,
    borderRadius: 4,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  downloadIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#322822',
  },
  closeButton: {
    padding: 8,
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  premiumFeaturesContainer: {
    marginBottom: 20,
  },
  premiumBanner: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  premiumModalTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#322822',
    marginBottom: 20,
    textAlign: 'center',
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#322822',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#322822',
    marginBottom: 2,
  },
  featureDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#888',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  pricingOption: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    height: 120,
    borderWidth: 1,
    borderColor: '#eee',
  },
  pricingGradient: {
    padding: 15,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  pricingPrice: {
    fontFamily: 'SpaceMono',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  pricingPeriod: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  bestValue: {
    position: 'relative',
  },
  bestValueBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -40 }],
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#322822',
  },
  bestValueText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#322822',
  },
  pricingSavings: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  subscribeCTA: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
  },
  subscribeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeCTAText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  termsText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
  },
  premiumArchiveNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  premiumArchiveNoteText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#322822',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  archiveIllustration: {
    marginVertical: 20,
  },
  archiveIllustrationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  archiveBooks: {
    width: 80,
    height: 120,
    position: 'relative',
  },
  archiveBook: {
    width: 50,
    height: 70,
    position: 'absolute',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  archiveArrow: {
    padding: 5,
  },
  archiveBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f3f0e8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#322822',
  },
  emptyArchiveIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  readingListNote: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyWishlistIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  browseMoreButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  browseMoreGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseMoreButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  readingListBooks: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  readingListBookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readingListBookCover: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  readingListBookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  readingListBookTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#322822',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingListBookAuthor: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  readingListBookRemove: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  readingListBookRemoveText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#666',
  },
  addToListContainer: {
    width: '85%',
    maxHeight: 'auto',
    padding: 20,
  },
  addToListContent: {
    alignItems: 'center',
  },
  selectedBookPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  selectedBookCover: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  selectedBookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedBookTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#322822',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedBookAuthor: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  addToListPrompt: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#322822',
    marginTop: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#322822',
    fontWeight: 'bold',
  },
  addToListButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  addToListGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToListButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
}); 