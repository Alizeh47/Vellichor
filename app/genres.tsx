import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundImage from '../components/BackgroundImage';
import Colors from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

// Define a default book cover image to use for all books
const DEFAULT_BOOK_COVER = require('../assets/images/splash-icon.png');

// Create a mapping of book cover image names to their require statements
const BOOK_COVERS = {
  // Crime books
  'crime_book1': require('../assets/images/book-covers/crime_book1.jpg'),
  'crime_book2': require('../assets/images/book-covers/crime_book2.jpg'),
  'crime_book3': require('../assets/images/book-covers/crime_book3.jpg'),
  
  // Sci-Fi books
  'scifi_book1': require('../assets/images/book-covers/scifi_book1.jpg'),
  'scifi_book2': require('../assets/images/book-covers/scifi_book2.jpg'),
  'scifi_book3': require('../assets/images/book-covers/scifi_book3.jpg'),
  
  // Romance books
  'romance_book1': require('../assets/images/book-covers/romance_book1.jpg'),
  'romance_book2': require('../assets/images/book-covers/romance_book2.jpg'),
  'romance_book3': require('../assets/images/book-covers/romance_book3.jpg'),
  
  // Other genre books
  'contemporary_romance_book1': require('../assets/images/book-covers/contemporary_romance_book1.jpg'),
  'contemporary_romance_book2': require('../assets/images/book-covers/contemporary_romance_book2.jpg'),
  'contemporary_romance_book3': require('../assets/images/book-covers/contemporary_romance_book3.jpg'),
  
  'historical_romance_book1': require('../assets/images/book-covers/historical_romance_book1.jpg'),
  'historical_romance_book2': require('../assets/images/book-covers/historical_romance_book2.jpg'),
  'historical_romance_book3': require('../assets/images/book-covers/historical_romance_book3.jpg'),
  
  'paranormal_romance_book1': require('../assets/images/book-covers/paranormal_romance_book1.jpg'),
  'paranormal_romance_book2': require('../assets/images/book-covers/paranormal_romance_book2.jpg'),
  'paranormal_romance_book3': require('../assets/images/book-covers/paranormal_romance_book3.jpg'),
  
  'fantasy_book1': require('../assets/images/book-covers/fantasy_book1.jpg'),
  'fantasy_book2': require('../assets/images/book-covers/fantasy_book2.jpg'),
  'fantasy_book3': require('../assets/images/book-covers/fantasy_book3.jpg'),
  
  'history_book1': require('../assets/images/book-covers/history_book1.jpg'),
  'history_book2': require('../assets/images/book-covers/history_book2.jpg'),
  'history_book3': require('../assets/images/book-covers/history_book3.jpg'),
  
  'horror_book1': require('../assets/images/book-covers/horror_book1.jpg'),
  'horror_book2': require('../assets/images/book-covers/horror_book2.jpg'),
  'horror_book3': require('../assets/images/book-covers/horror_book3.jpg'),
  
  'biography_book1': require('../assets/images/book-covers/biography_book1.jpg'),
  'biography_book2': require('../assets/images/book-covers/biography_book2.jpg'),
  'biography_book3': require('../assets/images/book-covers/biography_book3.jpg'),
  
  'poetry_book1': require('../assets/images/book-covers/poetry_book1.jpg'),
  'poetry_book2': require('../assets/images/book-covers/poetry_book2.jpg'),
  'poetry_book3': require('../assets/images/book-covers/poetry_book3.jpg'),
  
  'superhero_comics_book1': require('../assets/images/book-covers/superhero_comics_book1.jpg'),
  'superhero_comics_book2': require('../assets/images/book-covers/superhero_comics_book2.jpg'),
  'superhero_comics_book3': require('../assets/images/book-covers/superhero_comics_book3.jpg'),
  
  'manga_book1': require('../assets/images/book-covers/manga_book1.jpg'),
  'manga_book2': require('../assets/images/book-covers/manga_book2.jpg'),
  'manga_book3': require('../assets/images/book-covers/manga_book3.jpg'),
  
  'graphic_novels_book1': require('../assets/images/book-covers/graphic_novels_book1.jpg'),
  'graphic_novels_book2': require('../assets/images/book-covers/graphic_novels_book2.jpg'),
  'graphic_novels_book3': require('../assets/images/book-covers/graphic_novels_book3.jpg'),
  
  'thriller_book1': require('../assets/images/book-covers/thriller_book1.jpg'),
  'thriller_book3': require('../assets/images/book-covers/thriller_book3.jpg'),
  
  'mystery_book1': require('../assets/images/book-covers/mystery_book1.jpg'),
  'mystery_book2': require('../assets/images/book-covers/mystery_book2.jpg'),
  'mystery_book3': require('../assets/images/book-covers/mystery_book3.jpg'),
  
  'adventure_book2': require('../assets/images/book-covers/adventure_book2.jpg'),
  'adventure_book3': require('../assets/images/book-covers/adventure_book3.jpg'),
  
  'short_story_book1': require('../assets/images/book-covers/short_story_book1.jpg'),
  'short_story_book2': require('../assets/images/book-covers/short_story_book2.jpg'),
  'short_story_book3': require('../assets/images/book-covers/short_story_book3.jpg'),
  
  'werewolf_book1': require('../assets/images/book-covers/werewolf_book1.jpg'),
  'werewolf_book2': require('../assets/images/book-covers/werewolf_book2.jpg'),
  'werewolf_book3': require('../assets/images/book-covers/werewolf_book3.jpg'),
  
  'non_fiction_book1': require('../assets/images/book-covers/non_fiction_book1.jpg'),
  'non_fiction_book2': require('../assets/images/book-covers/non_fiction_book2.jpg'),
  'non_fiction_book3': require('../assets/images/book-covers/non_fiction_book3.jpg'),
};

// Helper function to get book cover image based on the coverImage string
const getBookCoverImage = (coverImageName: string) => {
  // @ts-ignore - Ignore TS error about indexing with string
  return BOOK_COVERS[coverImageName] || DEFAULT_BOOK_COVER;
};

interface BookCard {
  title: string;
  author: string;
  coverImage: string; // This will just be a placeholder now
}

interface Genre {
  id: string;
  name: string;
  selected: boolean;
  sampleBooks: BookCard[];
}

export default function GenresScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  const [genres, setGenres] = useState<Genre[]>([
    {
      id: 'crime',
      name: 'Crime & Mystery',
      selected: true,
      sampleBooks: [
        {
          title: 'The Ghost',
          author: 'Richard Marsh',
          coverImage: 'crime_book1',
        },
        {
          title: 'Unseen Shadow',
          author: 'Terry Doyle',
          coverImage: 'crime_book2',
        },
        {
          title: 'Dark Path',
          author: 'Kris Stone',
          coverImage: 'crime_book3',
        },
      ],
    },
    {
      id: 'scifi',
      name: 'Science Fiction',
      selected: false,
      sampleBooks: [
        {
          title: 'The Star Voyager',
          author: 'Ellie Chen',
          coverImage: 'scifi_book1',
        },
        {
          title: 'Beyond Time',
          author: 'Marcus Wells',
          coverImage: 'scifi_book2',
        },
        {
          title: 'The Last Colony',
          author: 'Sam Yeung',
          coverImage: 'scifi_book3',
        },
      ],
    },
    {
      id: 'romance',
      name: 'Romance',
      selected: false,
      sampleBooks: [
        {
          title: 'Autumn Hearts',
          author: 'Jessica Park',
          coverImage: 'romance_book1',
        },
        {
          title: 'Whispered Promises',
          author: 'Connor Reed',
          coverImage: 'romance_book2',
        },
        {
          title: 'Summer Encounter',
          author: 'Lily Saunders',
          coverImage: 'romance_book3',
        },
      ],
    },
    {
      id: 'contemporary_romance',
      name: 'Contemporary Romance',
      selected: false,
      sampleBooks: [
        {
          title: 'City Love',
          author: 'Nina Roberts',
          coverImage: 'contemporary_romance_book1',
        },
        {
          title: 'Coffee Shop Meet',
          author: 'Thomas Green',
          coverImage: 'contemporary_romance_book2',
        },
        {
          title: 'Modern Hearts',
          author: 'Rachel Simmons',
          coverImage: 'contemporary_romance_book3',
        },
      ],
    },
    {
      id: 'historical_romance',
      name: 'Historical Romance',
      selected: false,
      sampleBooks: [
        {
          title: 'Duke\'s Promise',
          author: 'Elizabeth Ward',
          coverImage: 'historical_romance_book1',
        },
        {
          title: 'Victorian Passion',
          author: 'Charlotte Reed',
          coverImage: 'historical_romance_book2',
        },
        {
          title: 'Regency Hearts',
          author: 'Jane Miller',
          coverImage: 'historical_romance_book3',
        },
      ],
    },
    {
      id: 'paranormal_romance',
      name: 'Paranormal Romance',
      selected: false,
      sampleBooks: [
        {
          title: 'Vampire\'s Kiss',
          author: 'Amelia Night',
          coverImage: 'paranormal_romance_book1',
        },
        {
          title: 'Wolf\'s Mate',
          author: 'Lucas Storm',
          coverImage: 'paranormal_romance_book2',
        },
        {
          title: 'Enchanted Love',
          author: 'Crystal Moon',
          coverImage: 'paranormal_romance_book3',
        },
      ],
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      selected: false,
      sampleBooks: [
        {
          title: 'Dragon\'s Realm',
          author: 'Morgan Faye',
          coverImage: 'fantasy_book1',
        },
        {
          title: 'The Wizard\'s Path',
          author: 'Trevor Hill',
          coverImage: 'fantasy_book2',
        },
        {
          title: 'Ancient Magic',
          author: 'Kira Stone',
          coverImage: 'fantasy_book3',
        },
      ],
    },
    {
      id: 'history',
      name: 'Historical Fiction',
      selected: false,
      sampleBooks: [
        {
          title: 'The Forgotten Time',
          author: 'Emma Clarke',
          coverImage: 'history_book1',
        },
        {
          title: 'Royal Secrets',
          author: 'James Thornton',
          coverImage: 'history_book2',
        },
        {
          title: 'The Last Dynasty',
          author: 'Victoria Wu',
          coverImage: 'history_book3',
        },
      ],
    },
    {
      id: 'horror',
      name: 'Horror',
      selected: false,
      sampleBooks: [
        {
          title: 'Midnight Manor',
          author: 'Edgar Flynn',
          coverImage: 'horror_book1',
        },
        {
          title: 'The Haunting',
          author: 'Sarah Black',
          coverImage: 'horror_book2',
        },
        {
          title: 'Whispers in Darkness',
          author: 'H.P. Williams',
          coverImage: 'horror_book3',
        },
      ],
    },
    {
      id: 'biography',
      name: 'Biography',
      selected: false,
      sampleBooks: [
        {
          title: 'Hidden Genius',
          author: 'Laura Miller',
          coverImage: 'biography_book1',
        },
        {
          title: 'Journey to Greatness',
          author: 'Michael Roberts',
          coverImage: 'biography_book2',
        },
        {
          title: 'The Unknown Hero',
          author: 'Patricia Lane',
          coverImage: 'biography_book3',
        },
      ],
    },
    {
      id: 'poetry',
      name: 'Poetry',
      selected: false,
      sampleBooks: [
        {
          title: 'Whispers of the Soul',
          author: 'Emily Rivers',
          coverImage: 'poetry_book1',
        },
        {
          title: 'Midnight Thoughts',
          author: 'David Frost',
          coverImage: 'poetry_book2',
        },
        {
          title: 'Silent Echoes',
          author: 'Sophia Lee',
          coverImage: 'poetry_book3',
        },
      ],
    },
    {
      id: 'superhero_comics',
      name: 'Superhero Comics',
      selected: false,
      sampleBooks: [
        {
          title: 'Captain Thunder',
          author: 'Mark Wilson',
          coverImage: 'superhero_comics_book1',
        },
        {
          title: 'The Night Defender',
          author: 'Chris Taylor',
          coverImage: 'superhero_comics_book2',
        },
        {
          title: 'Hero Alliance',
          author: 'Jessica Moore',
          coverImage: 'superhero_comics_book3',
        },
      ],
    },
    {
      id: 'manga',
      name: 'Manga',
      selected: false,
      sampleBooks: [
        {
          title: 'Sword of Destiny',
          author: 'Hiro Tanaka',
          coverImage: 'manga_book1',
        },
        {
          title: 'Academy Heroes',
          author: 'Yuki Sato',
          coverImage: 'manga_book2',
        },
        {
          title: 'Spirit Warriors',
          author: 'Kenji Watanabe',
          coverImage: 'manga_book3',
        },
      ],
    },
    {
      id: 'graphic_novels',
      name: 'Graphic Novels',
      selected: false,
      sampleBooks: [
        {
          title: 'The Dark Path',
          author: 'Alan Moore',
          coverImage: 'graphic_novels_book1',
        },
        {
          title: 'Forgotten City',
          author: 'Neil Gaiman',
          coverImage: 'graphic_novels_book2',
        },
        {
          title: 'Life in Frames',
          author: 'Alison Bechdel',
          coverImage: 'graphic_novels_book3',
        },
      ],
    },
    {
      id: 'thriller',
      name: 'Thriller',
      selected: false,
      sampleBooks: [
        {
          title: 'Silent Witness',
          author: 'Robert Blake',
          coverImage: 'thriller_book1',
        },
        {
          title: 'The Last Deception',
          author: 'Lauren Chase',
          coverImage: 'thriller_book2',
        },
        {
          title: 'Deadline',
          author: 'Michael Torres',
          coverImage: 'thriller_book3',
        },
      ],
    },
    {
      id: 'mystery',
      name: 'Mystery',
      selected: false,
      sampleBooks: [
        {
          title: 'The Hidden Clue',
          author: 'Agatha Wilson',
          coverImage: 'mystery_book1',
        },
        {
          title: 'Private Detective',
          author: 'Raymond Wells',
          coverImage: 'mystery_book2',
        },
        {
          title: 'The Disappeared',
          author: 'Emma Christie',
          coverImage: 'mystery_book3',
        },
      ],
    },
    {
      id: 'adventure',
      name: 'Adventure',
      selected: false,
      sampleBooks: [
        {
          title: 'Lost Treasure',
          author: 'Jack Hunter',
          coverImage: 'adventure_book1',
        },
        {
          title: 'Mountain Expedition',
          author: 'Sierra Everest',
          coverImage: 'adventure_book2',
        },
        {
          title: 'The Explorer\'s Map',
          author: 'Oliver Trek',
          coverImage: 'adventure_book3',
        },
      ],
    },
    {
      id: 'short_story',
      name: 'Short Stories',
      selected: false,
      sampleBooks: [
        {
          title: 'Brief Encounters',
          author: 'Various Authors',
          coverImage: 'short_story_book1',
        },
        {
          title: 'Moments in Time',
          author: 'Lisa Johnson',
          coverImage: 'short_story_book2',
        },
        {
          title: 'Fifteen Tales',
          author: 'Colin Parker',
          coverImage: 'short_story_book3',
        },
      ],
    },
    {
      id: 'werewolf',
      name: 'Werewolf',
      selected: false,
      sampleBooks: [
        {
          title: 'Full Moon Rising',
          author: 'Luna Wolfe',
          coverImage: 'werewolf_book1',
        },
        {
          title: 'Pack Alpha',
          author: 'Hunter Gray',
          coverImage: 'werewolf_book2',
        },
        {
          title: 'The Wolf Within',
          author: 'Diana Moon',
          coverImage: 'werewolf_book3',
        },
      ],
    },
    {
      id: 'non_fiction',
      name: 'Non-Fiction',
      selected: false,
      sampleBooks: [
        {
          title: 'The Science of Everything',
          author: 'Dr. Alan Taylor',
          coverImage: 'non_fiction_book1',
        },
        {
          title: 'Modern Philosophy',
          author: 'Prof. Sarah Jenkins',
          coverImage: 'non_fiction_book2',
        },
        {
          title: 'World History Explained',
          author: 'Historian Press',
          coverImage: 'non_fiction_book3',
        },
      ],
    },
  ]);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const toggleGenre = (id: string) => {
    setGenres(
      genres.map((genre) => {
        if (genre.id === id) {
          return { ...genre, selected: !genre.selected };
        }
        return genre;
      })
    );
  };

  const handleContinue = async () => {
    try {
      // Get the selected genres
      const selectedGenres = genres
        .filter(genre => genre.selected)
        .map(genre => genre.id);
      
      // Save selected genres to AsyncStorage
      await AsyncStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
      
      // Navigate to tropes page
      router.push('/tropes');
    } catch (error) {
      console.error('Failed to save genres:', error);
      // Navigate anyway even if storage fails
      router.push('/tropes');
    }
  };

  const handleSkip = () => {
    // Navigate to reading page without saving preferences
    router.push('/reading');
  };

  const handleBackPress = () => {
    router.back();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BackgroundImage />
      
      <View style={styles.topButtonContainer}>
        <TouchableOpacity 
          style={styles.topBackButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.vellichorContainer}>
            <Text style={styles.vellichorTitle}>Vellichor</Text>
          </View>
          
          <Text style={styles.heading}>Pick your favorites</Text>
          
          {genres.map((genre) => (
            <TouchableOpacity 
              key={genre.id} 
              style={styles.genreCard}
              onPress={() => toggleGenre(genre.id)}
              activeOpacity={0.8}
            >
              <View style={styles.genreHeader}>
                <Text style={styles.genreName}>{genre.name}</Text>
                <View 
                  style={[styles.checkBox, genre.selected ? styles.checkBoxSelected : {}]} 
                >
                  {genre.selected && <Ionicons name="checkmark" size={20} color="#fff" />}
                </View>
              </View>
              
              <View style={styles.bookCovers}>
                {genre.sampleBooks.map((book, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.bookCover, 
                      { 
                        zIndex: genre.sampleBooks.length - index,
                        left: index * 20,
                      }
                    ]}
                  >
                    <Image 
                      source={getBookCoverImage(book.coverImage)}
                      style={styles.coverImage}
                      resizeMode="cover"
                    />
                    <View style={styles.bookInfo}>
                      <Text style={styles.bookTitle}>{book.title}</Text>
                      <Text style={styles.bookAuthor}>by {book.author}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for buttons at bottom
    paddingTop: 30, // Increased top padding
  },
  content: {
    padding: 24,
  },
  vellichorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  vellichorTitle: {
    fontFamily: 'Birthstone',
    fontSize: 62,
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  heading: {
    fontFamily: 'SpaceMono',
    fontSize: 26,
    color: Colors.primary,
    marginBottom: 24,
  },
  genreCard: {
    backgroundColor: 'rgba(255, 243, 214, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    transform: [{ scale: 1 }],
  },
  genreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  genreName: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '500',
  },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxSelected: {
    backgroundColor: Colors.primary,
  },
  bookCovers: {
    flexDirection: 'row',
    height: 180,
    position: 'relative',
  },
  bookCover: {
    width: 110,
    height: 160,
    borderRadius: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  bookInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bookTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookAuthor: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  skipButtonText: {
    color: Colors.primary,
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  continueButtonText: {
    color: Colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  topButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
  },
  topBackButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
}); 