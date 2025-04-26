import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

// Sample book content data
const sampleBookContent = {
  title: "Hunting Sweetie Rose",
  author: "Jack Fredrickson",
  chapters: [
    {
      id: '1',
      title: 'Chapter 1',
      content: `The city, once a place filled with opportunities and life, is now nothing but a dead city. Jobs have gone let to automation and the population has moved away. The only people left are those with no options. Susan didn't know anyone in the city. "How should I put myself out there if there is no one?", she thought.

The skies started turning grey and wind was sharper. She pulled her scarf more tight and looked nervously at the time. The bus was as usually late. Which was no surprise because all the buses in this dead city were either late or never actually came.

Suddenly, a woman with children appeared around the corner. Susan hadn't seen children in weeks. The woman looked tired, her coat was too thin for this weather. The children were quiet, their faces solemn beyond their years.

"Is this the bus stop for line 67?" the woman asked, her voice barely audible above the wind.

Susan nodded. "Yes, but it's usually late. Sometimes it doesn't come at all."

The woman sighed and pulled her children closer. "We have to try. We've been walking for hours."

Susan felt a pang of empathy. Life in this city was hard enough for a single person. She couldn't imagine trying to care for children here.

"Where are you headed?" Susan asked.

"The community center on Fifth Street. I heard they're offering temporary shelter and hot meals."

Susan had heard of the place. It was one of the few remaining services in the city, run by volunteers who refused to abandon those left behind.

"I know where that is," Susan said. "If the bus doesn't come soon, I can show you how to get there. It's not too far on foot."

For the first time, the woman's face showed a hint of relief. "Thank you. I'm Maria, by the way."

"Susan," she replied.

As they stood waiting in the cold, Susan realized this was the first real conversation she'd had in weeks. Perhaps there were still people in this dead city after all. People just trying to survive, like her.

Maybe she wasn't as alone as she thought.`,
    },
    {
      id: '2',
      title: 'Chapter 2',
      content: 'Content for chapter 2 would go here...',
    },
  ],
  currentPage: 235,
  totalPages: 345,
};

// Helper function to get book cover based on title
const getBookCoverByTitle = (title: string) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('sweetie') || titleLower.includes('hunting')) {
    return require('../assets/images/book-covers/mystery_book1.jpg');
  } else if (titleLower.includes('here and now')) {
    return require('../assets/images/book-covers/fantasy_book1.jpg');
  } else if (titleLower.includes('silent echo')) {
    return require('../assets/images/book-covers/fantasy_book2.jpg');
  } else if (titleLower.includes('stranger') || titleLower.includes('lake')) {
    return require('../assets/images/book-covers/crime_book1.jpg');
  } else if (titleLower.includes('abyss')) {
    return require('../assets/images/book-covers/short_story_book1.jpg');
  } else if (titleLower.includes('kingdom') || titleLower.includes('mist')) {
    return require('../assets/images/book-covers/fantasy_book1.jpg');
  } else if (titleLower.includes('whisper') || titleLower.includes('forever')) {
    return require('../assets/images/book-covers/romance_book1.jpg');
  } else if (titleLower.includes('echo') || titleLower.includes('time')) {
    return require('../assets/images/book-covers/history_book1.jpg');
  } else if (titleLower.includes('beyond') || titleLower.includes('star')) {
    return require('../assets/images/book-covers/scifi_book1.jpg');
  } else {
    // Default cover if no match
    return require('../assets/images/book-covers/fantasy_book1.jpg');
  }
};

export default function BookReader() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Merriweather': require('../assets/fonts/Merriweather-Regular.ttf'),
  });
  
  // Get parameters from route
  const params = useLocalSearchParams();
  const bookTitle = params.bookTitle as string || 'Unknown Book';
  const bookAuthor = params.bookAuthor as string || 'Unknown Author';
  const currentPage = parseInt(params.currentPage as string || '1', 10);
  const totalPages = parseInt(params.totalPages as string || '100', 10);
  
  // Create book data from parameters
  const [book, setBook] = useState({
    ...sampleBookContent,
    title: bookTitle,
    author: bookAuthor,
    currentPage,
    totalPages
  });
  
  const [fontSize, setFontSize] = useState(18);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [bookmarkToastMessage, setBookmarkToastMessage] = useState('');

  // Check if book is already bookmarked on load
  useEffect(() => {
    checkIfBookmarked();
  }, []);

  const checkIfBookmarked = async () => {
    try {
      const bookmarkedBooksJson = await AsyncStorage.getItem('bookmarkedBooks');
      if (bookmarkedBooksJson) {
        const bookmarkedBooks = JSON.parse(bookmarkedBooksJson);
        const isAlreadyBookmarked = bookmarkedBooks.some(
          (bookmarked: any) => bookmarked.title === book.title && bookmarked.author === book.author
        );
        setIsBookmarked(isAlreadyBookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmarked status:', error);
    }
  };
  
  const handleBack = () => {
    router.replace('/browse');
  };
  
  const toggleControls = () => {
    setShowControls(!showControls);
  };
  
  const handleBookmark = async () => {
    try {
      let bookmarkedBooks = [];
      const bookmarkedBooksJson = await AsyncStorage.getItem('bookmarkedBooks');
      
      if (bookmarkedBooksJson) {
        bookmarkedBooks = JSON.parse(bookmarkedBooksJson);
      }
      
      if (isBookmarked) {
        // Remove from bookmarks
        const updatedBookmarks = bookmarkedBooks.filter(
          (bookmarked: any) => !(bookmarked.title === book.title && bookmarked.author === book.author)
        );
        await AsyncStorage.setItem('bookmarkedBooks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
        showToast('Removed from Library');
      } else {
        // Add to bookmarks
        const coverImage = getBookCoverByTitle(book.title);
        let coverImagePath = '';
        
        // Get the path from the require statement
        if (coverImage && typeof coverImage === 'number') {
          // This is a rough approximation - in a real app you'd need a more robust solution
          coverImagePath = `book-covers/${book.title.toLowerCase().replace(/\s+/g, '_')}.jpg`;
        }
        
        const bookmarkData = {
          id: `bookmark_${Date.now()}`,
          title: book.title,
          author: book.author,
          coverImagePath,
          currentPage: book.currentPage,
          totalPages: book.totalPages,
          lastReadTimestamp: new Date().toISOString()
        };
        
        bookmarkedBooks.push(bookmarkData);
        await AsyncStorage.setItem('bookmarkedBooks', JSON.stringify(bookmarkedBooks));
        setIsBookmarked(true);
        showToast('Added to Library');
      }
    } catch (error) {
      console.error('Error updating bookmarks:', error);
      showToast('Error updating Library');
    }
  };
  
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      setBookmarkToastMessage(message);
      setShowBookmarkToast(true);
      setTimeout(() => {
        setShowBookmarkToast(false);
      }, 2000);
    }
  };
  
  const handleChapterList = () => {
    // Implement chapter list display
    console.log('Show chapter list');
  };
  
  const handleFontSizeIncrease = () => {
    setFontSize(prev => Math.min(prev + 2, 28));
  };
  
  const handleFontSizeDecrease = () => {
    setFontSize(prev => Math.max(prev - 2, 14));
  };

  const handleProgressBarClick = () => {
    // Show premium modal when user tries to change page position
    setShowPremiumModal(true);
  };

  const closePremiumModal = () => {
    setShowPremiumModal(false);
  };

  const handleRateBook = () => {
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const submitReview = () => {
    if (!review.trim()) {
      return; // Don't submit empty reviews
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to submit review
    setTimeout(() => {
      console.log('Rating:', rating, 'Review:', review);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset and close after showing success message
      setTimeout(() => {
        setReview('');
        setSubmitSuccess(false);
        setShowReviewModal(false);
      }, 1500);
    }, 1000);
  };

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "", headerShown: false }} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={24} color="#4a4e82" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleRateBook}
          >
            <Ionicons name="star-outline" size={22} color="#4a4e82" />
          </TouchableOpacity>
          
          <View style={styles.spacer} />
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={toggleControls}
          >
            <Ionicons name="menu" size={22} color="#4a4e82" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color="#4a4e82" 
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.textContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bookTitleContainer}>
            <Text style={styles.bookTitleText}>{book.title}</Text>
            <Text style={styles.bookAuthorText}>by {book.author}</Text>
          </View>
          
          <Text style={[styles.bookText, { fontSize: fontSize }]}>
            {book.chapters[currentChapter].content}
          </Text>
          <View style={styles.endPadding} />
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.progressBarContainer}>
            <TouchableWithoutFeedback onPress={handleProgressBarClick}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressIndicator, 
                    { width: `${(book.currentPage / book.totalPages) * 100}%` }
                  ]} 
                />
                <View 
                  style={[
                    styles.progressDot, 
                    { left: `${(book.currentPage / book.totalPages) * 100}%` }
                  ]} 
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.pageInfo}>
            {`page ${book.currentPage} of ${book.totalPages}`}
          </Text>
          <Text style={styles.pagesLeft}>{`${book.totalPages - book.currentPage} pages left`}</Text>
        </View>
      </View>
      
      {showControls && (
        <View style={styles.readingControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleFontSizeDecrease}
          >
            <Text style={styles.controlButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleFontSizeIncrease}
          >
            <Text style={styles.controlButtonText}>A+</Text>
          </TouchableOpacity>
          {/* Add more reading controls here (theme, font, etc.) */}
        </View>
      )}
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/library')}
        >
          <Ionicons name="bookmark-outline" size={20} color="#5C3D2F" />
          <Text style={styles.tabButtonText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/reading')}
        >
          <Ionicons name="book-outline" size={20} color="#5C3D2F" />
          <Text style={styles.tabButtonText}>Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/browse')}
        >
          <Ionicons name="search-outline" size={20} color="#5C3D2F" />
          <Text style={styles.tabButtonText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/profile')}
        >
          <Ionicons name="person-outline" size={20} color="#5C3D2F" />
          <Text style={styles.tabButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Book Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeReviewModal}
      >
        <TouchableWithoutFeedback onPress={closeReviewModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.reviewModalContainer}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={closeReviewModal}
                >
                  <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                
                <ScrollView 
                  contentContainerStyle={styles.reviewScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.bookCoverContainer}>
                    <Image
                      source={getBookCoverByTitle(book.title)}
                      style={styles.reviewBookCover}
                      resizeMode="cover"
                    />
                  </View>
                  
                  <Text style={styles.reviewBookTitle}>{book.title}</Text>
                  <Text style={styles.reviewBookAuthor}>{book.author}</Text>
                  
                  <View style={styles.ratingStarsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity 
                        key={star} 
                        onPress={() => setRating(star)}
                      >
                        <AntDesign 
                          name={star <= rating ? "star" : "staro"} 
                          size={28} 
                          color="#F2BB36" 
                          style={styles.ratingStar}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <View style={styles.reviewInputContainer}>
                    <TextInput
                      style={styles.reviewInput}
                      placeholder="The characters in this book are so vibrant..."
                      placeholderTextColor="#999"
                      multiline={true}
                      numberOfLines={3}
                      textAlignVertical="top"
                      value={review}
                      onChangeText={setReview}
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.sendButton, isSubmitting && styles.sendButtonDisabled]}
                    onPress={submitReview}
                    disabled={isSubmitting || !review.trim()}
                  >
                    {isSubmitting ? (
                      <Text style={styles.sendButtonText}>Sending...</Text>
                    ) : submitSuccess ? (
                      <View style={styles.sendButtonContent}>
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        <Text style={styles.sendButtonText}>Sent!</Text>
                      </View>
                    ) : (
                      <View style={styles.sendButtonContent}>
                        <Ionicons name="send" size={18} color="#fff" style={styles.sendIcon} />
                        <Text style={styles.sendButtonText}>Send</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Premium Feature Modal */}
      <Modal
        visible={showPremiumModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closePremiumModal}
      >
        <TouchableWithoutFeedback onPress={closePremiumModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.premiumModalContainer}>
                <View style={styles.premiumModalHeader}>
                  <FontAwesome name="diamond" size={28} color="#6E6BA8" />
                  <Text style={styles.premiumModalTitle}>Premium Feature</Text>
                </View>
                
                <Text style={styles.premiumModalText}>
                  Change page position and access advanced reading features with Vellichor Premium.
                </Text>
                
                <View style={styles.premiumFeaturesList}>
                  <View style={styles.premiumFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#6E6BA8" />
                    <Text style={styles.premiumFeatureText}>Jump to any page instantly</Text>
                  </View>
                  <View style={styles.premiumFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#6E6BA8" />
                    <Text style={styles.premiumFeatureText}>Customize reading themes</Text>
                  </View>
                  <View style={styles.premiumFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#6E6BA8" />
                    <Text style={styles.premiumFeatureText}>Ad-free reading experience</Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.upgradeToPremiumButton}
                  onPress={closePremiumModal}
                >
                  <Text style={styles.upgradeToPremiumButtonText}>Upgrade to Premium</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.notNowButton}
                  onPress={closePremiumModal}
                >
                  <Text style={styles.notNowButtonText}>Not Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* iOS Bookmark Toast */}
      {Platform.OS !== 'android' && (
        <Modal
          visible={showBookmarkToast}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.toastContainer}>
            <View style={styles.toastContent}>
              <Text style={styles.toastText}>{bookmarkToastMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7E7',
  },
  content: {
    flex: 1,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D5',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F1E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  spacer: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bookText: {
    fontFamily: 'Merriweather',
    fontSize: 18,
    lineHeight: 28,
    color: '#38384E',
    textAlign: 'left',
  },
  endPadding: {
    height: 100,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E0D5',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E0D5',
    borderRadius: 2,
    position: 'relative',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#6E6BA8',
    borderRadius: 2,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6E6BA8',
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  pageInfo: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#38384E',
    textAlign: 'center',
  },
  pagesLeft: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  readingControls: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  controlButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#4a4e82',
    fontWeight: 'bold',
  },
  bookTitleContainer: {
    marginBottom: 20,
  },
  bookTitleText: {
    fontFamily: 'Merriweather',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38384E',
    textAlign: 'center',
  },
  bookAuthorText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FAF7E7',
    borderTopWidth: 1,
    borderTopColor: '#E5E0D5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6E6BA8',
  },
  tabButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 8,
    color: '#5C3D2F',
    marginTop: 2,
  },
  activeTabButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 8,
    color: '#6E6BA8',
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumModalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  premiumModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  premiumModalTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6E6BA8',
    marginLeft: 10,
  },
  premiumModalText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumFeaturesList: {
    width: '100%',
    marginBottom: 20,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  premiumFeatureText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    marginLeft: 10,
  },
  upgradeToPremiumButton: {
    backgroundColor: '#6E6BA8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  upgradeToPremiumButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notNowButton: {
    paddingVertical: 10,
  },
  notNowButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#888888',
  },
  reviewModalContainer: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#FAF7E7',
    borderRadius: 20,
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  reviewScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  bookCoverContainer: {
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  reviewBookCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  reviewBookTitle: {
    fontFamily: 'Merriweather',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  reviewBookAuthor: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingStar: {
    marginHorizontal: 4,
  },
  reviewInputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  reviewInput: {
    fontFamily: 'SpaceMono',
    fontSize: 15,
    color: '#333',
    height: 100,
  },
  sendButton: {
    backgroundColor: '#4a4e82',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#a5a5c0',
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  toastText: {
    color: '#fff',
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
}); 