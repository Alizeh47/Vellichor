import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import Colors from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

interface BookCard {
  title: string;
  author: string;
  color: string;
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
          color: '#5C3D2F',
        },
        {
          title: 'Unseen Shadow',
          author: 'Terry Doyle',
          color: '#25323A',
        },
        {
          title: 'Dark Path',
          author: 'Kris Stone',
          color: '#623D33',
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
          color: '#896E51',
        },
        {
          title: 'Beyond Time',
          author: 'Marcus Wells',
          color: '#B8A174',
        },
        {
          title: 'The Last Colony',
          author: 'Sam Yeung',
          color: '#916F5E',
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
          color: '#C78E65',
        },
        {
          title: 'Whispered Promises',
          author: 'Connor Reed',
          color: '#E0AC80',
        },
        {
          title: 'Summer Encounter',
          author: 'Lily Saunders',
          color: '#B39285',
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
          color: '#917E78',
        },
        {
          title: 'Coffee Shop Meet',
          author: 'Thomas Green',
          color: '#948370',
        },
        {
          title: 'Modern Hearts',
          author: 'Rachel Simmons',
          color: '#916F5E',
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
          color: '#5C3D2F',
        },
        {
          title: 'Victorian Passion',
          author: 'Charlotte Reed',
          color: '#623D33',
        },
        {
          title: 'Regency Hearts',
          author: 'Jane Miller',
          color: '#25323A',
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
          color: '#896E51',
        },
        {
          title: 'Wolf\'s Mate',
          author: 'Lucas Storm',
          color: '#B8A174',
        },
        {
          title: 'Enchanted Love',
          author: 'Crystal Moon',
          color: '#916F5E',
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
          color: '#C78E65',
        },
        {
          title: 'The Wizard\'s Path',
          author: 'Trevor Hill',
          color: '#E0AC80',
        },
        {
          title: 'Ancient Magic',
          author: 'Kira Stone',
          color: '#B39285',
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
          color: '#917E78',
        },
        {
          title: 'Royal Secrets',
          author: 'James Thornton',
          color: '#948370',
        },
        {
          title: 'The Last Dynasty',
          author: 'Victoria Wu',
          color: '#623D33',
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
          color: '#25323A',
        },
        {
          title: 'The Haunting',
          author: 'Sarah Black',
          color: '#5C3D2F',
        },
        {
          title: 'Whispers in Darkness',
          author: 'H.P. Williams',
          color: '#623D33',
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
          color: '#896E51',
        },
        {
          title: 'Journey to Greatness',
          author: 'Michael Roberts',
          color: '#B8A174',
        },
        {
          title: 'The Unknown Hero',
          author: 'Patricia Lane',
          color: '#916F5E',
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
          color: '#C78E65',
        },
        {
          title: 'Midnight Thoughts',
          author: 'David Frost',
          color: '#E0AC80',
        },
        {
          title: 'Silent Echoes',
          author: 'Sophia Lee',
          color: '#B39285',
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
          color: '#917E78',
        },
        {
          title: 'The Night Defender',
          author: 'Chris Taylor',
          color: '#5C3D2F',
        },
        {
          title: 'Hero Alliance',
          author: 'Jessica Moore',
          color: '#25323A',
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
          color: '#B8A174',
        },
        {
          title: 'Academy Heroes',
          author: 'Yuki Sato',
          color: '#896E51',
        },
        {
          title: 'Spirit Warriors',
          author: 'Kenji Watanabe',
          color: '#623D33',
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
          color: '#C78E65',
        },
        {
          title: 'Forgotten City',
          author: 'Neil Gaiman',
          color: '#E0AC80',
        },
        {
          title: 'Life in Frames',
          author: 'Alison Bechdel',
          color: '#B39285',
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
          color: '#917E78',
        },
        {
          title: 'The Last Deception',
          author: 'Lauren Chase',
          color: '#948370',
        },
        {
          title: 'Deadline',
          author: 'Michael Torres',
          color: '#25323A',
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
          color: '#5C3D2F',
        },
        {
          title: 'Private Detective',
          author: 'Raymond Wells',
          color: '#623D33',
        },
        {
          title: 'The Disappeared',
          author: 'Emma Christie',
          color: '#916F5E',
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
          color: '#B8A174',
        },
        {
          title: 'Mountain Expedition',
          author: 'Sierra Everest',
          color: '#896E51',
        },
        {
          title: 'The Explorer\'s Map',
          author: 'Oliver Trek',
          color: '#C78E65',
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
          color: '#E0AC80',
        },
        {
          title: 'Moments in Time',
          author: 'Lisa Johnson',
          color: '#B39285',
        },
        {
          title: 'Fifteen Tales',
          author: 'Colin Parker',
          color: '#917E78',
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
          color: '#5C3D2F',
        },
        {
          title: 'Pack Alpha',
          author: 'Hunter Gray',
          color: '#623D33',
        },
        {
          title: 'The Wolf Within',
          author: 'Diana Moon',
          color: '#25323A',
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
          color: '#896E51',
        },
        {
          title: 'Modern Philosophy',
          author: 'Prof. Sarah Jenkins',
          color: '#B8A174',
        },
        {
          title: 'World History Explained',
          author: 'Historian Press',
          color: '#916F5E',
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

  const handleContinue = () => {
    // Save selected genres and navigate to tropes page
    router.push('/tropes');
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
            <View key={genre.id} style={styles.genreCard}>
              <View style={styles.genreHeader}>
                <Text style={styles.genreName}>{genre.name}</Text>
                <TouchableOpacity 
                  style={[styles.checkBox, genre.selected ? styles.checkBoxSelected : {}]} 
                  onPress={() => toggleGenre(genre.id)}
                >
                  {genre.selected && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
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
                        backgroundColor: book.color
                      }
                    ]}
                  >
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>by {book.author}</Text>
                  </View>
                ))}
              </View>
            </View>
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
  appTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 40,
  },
  genreCard: {
    backgroundColor: 'rgba(255, 243, 214, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  bookTitle: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bookAuthor: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    color: 'white',
    fontSize: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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