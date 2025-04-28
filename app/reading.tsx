import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Dimensions,
  Pressable,
  FlatList,
  Animated,
  TextInput,
  Modal,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundImage from '../components/BackgroundImage';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

// Expanded type definition for Book with descriptions
type Book = {
  id: string;
  title: string;
  author: string;
  coverImage: string | any; // Allow both string URLs and require() image sources
  description: string;
};

// Updated book data with descriptions
const booksToRead: Book[] = [
  {
    id: '1',
    title: 'The Here And Now',
    author: 'Jillian Lawrence',
    coverImage: require('../assets/images/book-covers/fantasy_book1.jpg'),
    description: 'A thought-provoking journey through time and space, exploring the concept of living in the present moment while reconciling with the past.'
  },
  {
    id: '1a',
    title: 'Silent Echo',
    author: 'Maya Rivers',
    coverImage: require('../assets/images/book-covers/fantasy_book2.jpg'),
    description: 'When a mysterious sound phenomenon appears in a small coastal town, a young scientist must uncover its secrets before it consumes everything.'
  },
  {
    id: '1b',
    title: 'Midnight Dreams',
    author: 'Thomas Night',
    coverImage: require('../assets/images/book-covers/fantasy_book3.jpg'),
    description: 'A thrilling tale of a young woman who discovers a hidden world of dreams and nightmares.'
  },
  {
    id: '1c',
    title: 'The Lost Letter',
    author: 'Sarah Winters',
    coverImage: require('../assets/images/book-covers/romance_book1.jpg'),
    description: 'A heartwarming story about a letter that brings hope to a lonely old man.'
  },
  {
    id: '1d',
    title: 'Whispers in Shadow',
    author: 'Jackson Gray',
    coverImage: require('../assets/images/book-covers/thriller_book1.jpg'),
    description: 'A chilling tale of a small town haunted by mysterious whispers.'
  },
  {
    id: '1e',
    title: 'Forgotten Time',
    author: 'Olivia Pierce',
    coverImage: require('../assets/images/book-covers/scifi_book1.jpg'),
    description: 'A poignant story about a woman who discovers a hidden time machine.'
  },
  {
    id: '1f',
    title: 'Broken Memories',
    author: 'Nathan Blake',
    coverImage: require('../assets/images/book-covers/mystery_book1.jpg'),
    description: 'A powerful tale of love and loss, set in a world where memories are fragile and easily broken.'
  },
  {
    id: '1g',
    title: 'Summer\'s End',
    author: 'Lily Moore',
    coverImage: require('../assets/images/book-covers/contemporary_romance_book1.jpg'),
    description: 'A bittersweet story about the end of summer and the beginning of a new chapter.'
  },
  {
    id: '1h',
    title: 'Hidden Truths',
    author: 'Maxwell King',
    coverImage: require('../assets/images/book-covers/mystery_book2.jpg'),
    description: 'A thrilling mystery that explores the dark secrets of a small town.'
  },
  {
    id: '1i',
    title: 'Eternal Twilight',
    author: 'Isabella Dawn',
    coverImage: require('../assets/images/book-covers/paranormal_romance_book1.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of vampires.'
  },
  {
    id: '1j',
    title: 'Autumn Leaves',
    author: 'Daniel Harper',
    coverImage: require('../assets/images/book-covers/romance_book2.jpg'),
    description: 'A poignant story about the changing seasons and the passing of time.'
  },
  {
    id: '1k',
    title: 'Distant Shores',
    author: 'Marina Coast',
    coverImage: require('../assets/images/book-covers/adventure_book2.jpg'),
    description: 'A heartwarming tale about a young woman who discovers a hidden island.'
  },
];

const crimeMysteryBooks: Book[] = [
  {
    id: '2',
    title: 'The Stranger In The Lake',
    author: 'Sloane Collins',
    coverImage: require('../assets/images/book-covers/crime_book1.jpg'),
    description: 'A chilling tale of a body discovered in a peaceful mountain lake, and the dark secrets that emerge as a small town detective digs deeper.'
  },
  {
    id: '2a',
    title: 'Cold Cases',
    author: 'Detective Morgan',
    coverImage: require('../assets/images/book-covers/crime_book2.jpg'),
    description: 'A collection of cold cases that challenge a detective to solve mysteries from the past.'
  },
  {
    id: '2b',
    title: 'Vanishing Point',
    author: 'Jessica Thorne',
    coverImage: require('../assets/images/book-covers/crime_book3.jpg'),
    description: 'A thrilling mystery about a woman who disappears without a trace.'
  },
  {
    id: '2c',
    title: 'The Final Witness',
    author: 'Alexander Knight',
    coverImage: require('../assets/images/book-covers/mystery_book3.jpg'),
    description: 'A gripping tale of a murder case that hinges on the testimony of a single witness.'
  },
  {
    id: '2d',
    title: 'Shattered Evidence',
    author: 'Catherine Miles',
    coverImage: require('../assets/images/book-covers/thriller_book3.jpg'),
    description: 'A thrilling mystery that explores the consequences of a single piece of evidence.'
  },
  {
    id: '2e',
    title: 'Silent Confessions',
    author: 'Michael Stone',
    coverImage: require('../assets/images/book-covers/horror_book1.jpg'),
    description: 'A chilling tale of a murder investigation that reveals dark secrets.'
  },
  {
    id: '2f',
    title: 'The Broken Alibi',
    author: 'Rebecca Holmes',
    coverImage: require('../assets/images/book-covers/mystery_book1.jpg'),
    description: 'A gripping tale of a murder case that challenges the integrity of a police officer.'
  },
  {
    id: '2g',
    title: 'Murder at Midnight',
    author: 'James Noir',
    coverImage: require('../assets/images/book-covers/thriller_book1.jpg'),
    description: 'A thrilling tale of a murder that occurs at midnight.'
  },
  {
    id: '2h',
    title: 'The Detective\'s Dilemma',
    author: 'Sophia Case',
    coverImage: require('../assets/images/book-covers/mystery_book2.jpg'),
    description: 'A gripping tale of a detective who must choose between her duty and her personal life.'
  },
  {
    id: '2i',
    title: 'Crimson Evidence',
    author: 'Victor Marks',
    coverImage: require('../assets/images/book-covers/horror_book2.jpg'),
    description: 'A thrilling mystery that explores the consequences of a single piece of evidence.'
  },
  {
    id: '2j',
    title: 'The Perfect Crime',
    author: 'Eleanor Walsh',
    coverImage: require('../assets/images/book-covers/horror_book3.jpg'),
    description: 'A gripping tale of a perfect murder that leaves no trace.'
  },
  {
    id: '2k',
    title: 'Missing Witnesses',
    author: 'Thomas Sleuth',
    coverImage: require('../assets/images/book-covers/mystery_book3.jpg'),
    description: 'A thrilling mystery about a missing witness in a murder trial.'
  },
];

const shortStoryBooks: Book[] = [
  {
    id: '3',
    title: 'Abyss retreat',
    author: 'Jane Doe',
    coverImage: require('../assets/images/book-covers/short_story_book1.jpg'),
    description: 'A collection of interconnected short stories exploring the depths of human emotion and the retreat into inner worlds during times of crisis.'
  },
  {
    id: '3a',
    title: 'Fragments',
    author: 'Emily Clarke',
    coverImage: require('../assets/images/book-covers/short_story_book2.jpg'),
    description: 'A collection of short stories that explore the concept of fragments and how they shape our lives.'
  },
  {
    id: '3b',
    title: 'Whispers & Tales',
    author: 'Lily White',
    coverImage: require('../assets/images/book-covers/short_story_book3.jpg'),
    description: 'A collection of short stories that explore the concept of whispers and how they connect people.'
  },
  {
    id: '3c',
    title: 'Passing Moments',
    author: 'Richard Hall',
    coverImage: require('../assets/images/book-covers/poetry_book1.jpg'),
    description: 'A collection of short stories that explore the concept of passing moments and how they shape our memories.'
  },
  {
    id: '3d',
    title: 'Reflections',
    author: 'Claire Waters',
    coverImage: require('../assets/images/book-covers/poetry_book2.jpg'),
    description: 'A collection of short stories that explore the concept of reflections and how they shape our perceptions.'
  },
  {
    id: '3e',
    title: 'Tiny Dreams',
    author: 'Martin Green',
    coverImage: require('../assets/images/book-covers/poetry_book3.jpg'),
    description: 'A collection of short stories that explore the concept of tiny dreams and how they shape our reality.'
  },
  {
    id: '3f',
    title: 'Fleeting Moments',
    author: 'Emma Frost',
    coverImage: require('../assets/images/book-covers/short_story_book1.jpg'),
    description: 'A collection of short stories that explore the concept of fleeting moments and how they shape our lives.'
  },
  {
    id: '3g',
    title: 'Brief Encounters',
    author: 'David Swift',
    coverImage: require('../assets/images/book-covers/short_story_book2.jpg'),
    description: 'A collection of short stories that explore the concept of brief encounters and how they shape our memories.'
  },
  {
    id: '3h',
    title: 'Minutes to Midnight',
    author: 'Olivia Short',
    coverImage: require('../assets/images/book-covers/short_story_book3.jpg'),
    description: 'A collection of short stories that explore the concept of minutes to midnight and how they shape our lives.'
  },
  {
    id: '3i',
    title: 'Tiny Victories',
    author: 'Peter Small',
    coverImage: require('../assets/images/book-covers/poetry_book1.jpg'),
    description: 'A collection of short stories that explore the concept of tiny victories and how they shape our reality.'
  },
  {
    id: '3j',
    title: 'Flash Fiction',
    author: 'Sophie Quick',
    coverImage: require('../assets/images/book-covers/poetry_book2.jpg'),
    description: 'A collection of flash fiction stories that explore the concept of flash fiction and how it shapes our reality.'
  },
  {
    id: '3k',
    title: 'Micro Tales',
    author: 'Philip Tiny',
    coverImage: require('../assets/images/book-covers/poetry_book3.jpg'),
    description: 'A collection of micro tales that explore the concept of micro tales and how they shape our reality.'
  },
];

const fantasyBooks: Book[] = [
  {
    id: '4',
    title: 'Kingdom of Mist',
    author: 'Eleanor Gray',
    coverImage: require('../assets/images/book-covers/fantasy_book1.jpg'),
    description: 'A captivating story about a kingdom hidden in mist and the adventures that await those who dare to explore it.'
  },
  {
    id: '4a',
    title: 'The Dragon Heir',
    author: 'Marcus Flame',
    coverImage: require('../assets/images/book-covers/fantasy_book2.jpg'),
    description: 'A thrilling tale about a young woman who discovers she is the heir to a dragon kingdom.'
  },
  {
    id: '4b',
    title: 'Crystal Kingdoms',
    author: 'Violet Star',
    coverImage: require('../assets/images/book-covers/fantasy_book3.jpg'),
    description: 'A captivating story about a kingdom made of crystals and the adventures that await those who dare to explore it.'
  },
  {
    id: '4c',
    title: 'Enchanted Forest',
    author: 'Luna Silvermoon',
    coverImage: require('../assets/images/book-covers/superhero_comics_book1.jpg'),
    description: 'A magical story about a young woman who discovers a hidden enchanted forest.'
  },
  {
    id: '4d',
    title: 'Raven\'s Magic',
    author: 'Damien Dark',
    coverImage: require('../assets/images/book-covers/superhero_comics_book2.jpg'),
    description: 'A thrilling tale about a young man who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4e',
    title: 'Forgotten Realms',
    author: 'Peter Elderwood',
    coverImage: require('../assets/images/book-covers/superhero_comics_book3.jpg'),
    description: 'A captivating story about a young man who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4f',
    title: 'Crown of Shadows',
    author: 'Serena Knight',
    coverImage: require('../assets/images/book-covers/werewolf_book1.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4g',
    title: 'Wizard\'s Quest',
    author: 'Magnus Spell',
    coverImage: require('../assets/images/book-covers/werewolf_book2.jpg'),
    description: 'A thrilling tale about a young man who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4h',
    title: 'The Elven Legacy',
    author: 'Arwen Leafsong',
    coverImage: require('../assets/images/book-covers/werewolf_book3.jpg'),
    description: 'A captivating story about a young man who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4i',
    title: 'Mystic Portals',
    author: 'Orion Starlight',
    coverImage: require('../assets/images/book-covers/manga_book1.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4j',
    title: 'The Sorcerer\'s Apprentice',
    author: 'Merlin Wise',
    coverImage: require('../assets/images/book-covers/manga_book2.jpg'),
    description: 'A thrilling tale about a young man who discovers a hidden world of magic and adventure.'
  },
  {
    id: '4k',
    title: 'Realm of Shadows',
    author: 'Lily Nightshade',
    coverImage: require('../assets/images/book-covers/manga_book3.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of magic and adventure.'
  },
];

const romanceBooks: Book[] = [
  {
    id: '5',
    title: 'Whispers of Forever',
    author: 'Rebecca Rose',
    coverImage: require('../assets/images/book-covers/romance_book1.jpg'),
    description: 'A heartwarming love story that explores the concept of whispers and how they shape our reality.'
  },
  {
    id: '5a',
    title: 'Endless Summer',
    author: 'Sophia Heart',
    coverImage: require('../assets/images/book-covers/romance_book2.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of love and adventure.'
  },
  {
    id: '5b',
    title: 'Autumn\'s Embrace',
    author: 'Daniel Love',
    coverImage: require('../assets/images/book-covers/romance_book3.jpg'),
    description: 'A heartwarming love story that explores the concept of autumn and how it shapes our reality.'
  },
  {
    id: '5c',
    title: 'Chance Encounters',
    author: 'Jennifer Spark',
    coverImage: require('../assets/images/book-covers/contemporary_romance_book1.jpg'),
    description: 'A thrilling tale about a chance encounter that changes the course of two people\'s lives.'
  },
  {
    id: '5d',
    title: 'Last Dance',
    author: 'Amelia Grace',
    coverImage: require('../assets/images/book-covers/contemporary_romance_book2.jpg'),
    description: 'A heartwarming love story that explores the concept of last dance and how it shapes our reality.'
  },
  {
    id: '5e',
    title: 'Midnight Roses',
    author: 'Vincent Valentine',
    coverImage: require('../assets/images/book-covers/contemporary_romance_book3.jpg'),
    description: 'A captivating love story that explores the concept of midnight roses and how they shape our reality.'
  },
  {
    id: '5f',
    title: 'Stolen Hearts',
    author: 'Charlotte Love',
    coverImage: require('../assets/images/book-covers/historical_romance_book1.jpg'),
    description: 'A thrilling tale about a stolen heart and the consequences that follow.'
  },
  {
    id: '5g',
    title: 'Winter\'s Passion',
    author: 'Gabriel Snow',
    coverImage: require('../assets/images/book-covers/historical_romance_book2.jpg'),
    description: 'A captivating love story that explores the concept of winter and how it shapes our reality.'
  },
  {
    id: '5h',
    title: 'Sweet Surrenders',
    author: 'Olivia Bloom',
    coverImage: require('../assets/images/book-covers/historical_romance_book3.jpg'),
    description: 'A heartwarming love story that explores the concept of sweet surrender and how it shapes our reality.'
  },
  {
    id: '5i',
    title: 'Forever Yours',
    author: 'Robert Soulmate',
    coverImage: require('../assets/images/book-covers/paranormal_romance_book1.jpg'),
    description: 'A thrilling tale about a soulmate connection that lasts forever.'
  },
  {
    id: '5j',
    title: 'Whispers of Love',
    author: 'Rose Valentine',
    coverImage: require('../assets/images/book-covers/paranormal_romance_book2.jpg'),
    description: 'A heartwarming love story that explores the concept of whispers and how they shape our reality.'
  },
  {
    id: '5k',
    title: 'Ocean Hearts',
    author: 'Marina Tides',
    coverImage: require('../assets/images/book-covers/paranormal_romance_book3.jpg'),
    description: 'A captivating love story that explores the concept of ocean hearts and how they shape our reality.'
  },
];

const historicalFictionBooks: Book[] = [
  {
    id: '6',
    title: 'Echoes of Time',
    author: 'William Montgomery',
    coverImage: require('../assets/images/book-covers/history_book1.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of time travel.'
  },
  {
    id: '6a',
    title: 'The Tudor Secret',
    author: 'Elizabeth Reigns',
    coverImage: require('../assets/images/book-covers/history_book2.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of Tudor secrets.'
  },
  {
    id: '6b',
    title: 'Whispers of War',
    author: 'Colonel Richards',
    coverImage: require('../assets/images/book-covers/history_book3.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of war secrets.'
  },
  {
    id: '6c',
    title: 'Renaissance Dreams',
    author: 'Isabella Florence',
    coverImage: require('../assets/images/book-covers/biography_book1.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of Renaissance secrets.'
  },
  {
    id: '6d',
    title: 'Ancient Promises',
    author: 'Harriet Scholar',
    coverImage: require('../assets/images/book-covers/biography_book2.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of ancient promises.'
  },
  {
    id: '6e',
    title: 'The Victorian Mystery',
    author: 'Theodore Wells',
    coverImage: require('../assets/images/book-covers/biography_book3.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of Victorian secrets.'
  },
  {
    id: '6f',
    title: 'Medieval Legends',
    author: 'Arthur Knight',
    coverImage: require('../assets/images/book-covers/non_fiction_book1.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of medieval legends.'
  },
  {
    id: '6g',
    title: 'Dynasty of Kings',
    author: 'Helena Royal',
    coverImage: require('../assets/images/book-covers/non_fiction_book2.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of dynasty secrets.'
  },
  {
    id: '6h',
    title: 'Civil War Letters',
    author: 'Samuel Union',
    coverImage: require('../assets/images/book-covers/non_fiction_book3.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of Civil War secrets.'
  },
  {
    id: '6i',
    title: 'The Roaring Twenties',
    author: 'Fitzgerald Jones',
    coverImage: require('../assets/images/book-covers/historical_romance_book1.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of Roaring Twenties secrets.'
  },
  {
    id: '6j',
    title: 'Ancient Rome',
    author: 'Julius Scholar',
    coverImage: require('../assets/images/book-covers/historical_romance_book2.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of ancient Roman secrets.'
  },
  {
    id: '6k',
    title: 'The Explorer\'s Journal',
    author: 'Christopher Voyage',
    coverImage: require('../assets/images/book-covers/historical_romance_book3.jpg'),
    description: 'A thrilling tale about a young man who discovers a hidden world of explorer secrets.'
  },
];

const scienceFictionBooks: Book[] = [
  {
    id: '7',
    title: 'Beyond the Stars',
    author: 'Alexis Chen',
    coverImage: require('../assets/images/book-covers/scifi_book1.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of space travel.'
  },
  {
    id: '7a',
    title: 'Quantum Dreams',
    author: 'Dr. Neil Space',
    coverImage: require('../assets/images/book-covers/scifi_book2.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of quantum travel.'
  },
  {
    id: '7b',
    title: 'The Mars Colony',
    author: 'Astro Williams',
    coverImage: require('../assets/images/book-covers/scifi_book3.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of Mars travel.'
  },
  {
    id: '7c',
    title: 'Android Heart',
    author: 'Roberta Tech',
    coverImage: require('../assets/images/book-covers/graphic_novels_book1.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of android travel.'
  },
  {
    id: '7d',
    title: 'Galactic Empire',
    author: 'Orion Stardust',
    coverImage: require('../assets/images/book-covers/graphic_novels_book2.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of galactic travel.'
  },
  {
    id: '7e',
    title: 'Time Fracture',
    author: 'Professor Chronos',
    coverImage: require('../assets/images/book-covers/graphic_novels_book3.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of time travel.'
  },
  {
    id: '7f',
    title: 'Cyber Revolution',
    author: 'Neo Matrix',
    coverImage: require('../assets/images/book-covers/adventure_book2.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of cyber travel.'
  },
  {
    id: '7g',
    title: 'Space Station Omega',
    author: 'Commander Nova',
    coverImage: require('../assets/images/book-covers/adventure_book3.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of space travel.'
  },
  {
    id: '7h',
    title: 'AI Uprising',
    author: 'Dr. Turing',
    coverImage: require('../assets/images/book-covers/thriller_book1.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of AI travel.'
  },
  {
    id: '7i',
    title: 'Parallel Worlds',
    author: 'Quantum Jones',
    coverImage: require('../assets/images/book-covers/adventure_book2.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of parallel travel.'
  },
  {
    id: '7j',
    title: 'Virtual Worlds',
    author: 'Pixel Wright',
    coverImage: require('../assets/images/book-covers/thriller_book3.jpg'),
    description: 'A captivating story about a young woman who discovers a hidden world of virtual travel.'
  },
  {
    id: '7k',
    title: 'Quantum Paradox',
    author: 'Dr. Heisenberg',
    coverImage: require('../assets/images/book-covers/scifi_book2.jpg'),
    description: 'A thrilling tale about a young woman who discovers a hidden world of quantum travel.'
  },
];

export default function ReadingScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  // Current reading progress
  const [progress, setProgress] = useState(60);
  
  // Current selected book indices
  const [selectedWantToReadBook, setSelectedWantToReadBook] = useState(0);
  const [selectedCrimeMysteryBook, setSelectedCrimeMysteryBook] = useState(0);
  const [selectedShortStoryBook, setSelectedShortStoryBook] = useState(0);
  const [selectedFantasyBook, setSelectedFantasyBook] = useState(0);
  const [selectedRomanceBook, setSelectedRomanceBook] = useState(0);
  const [selectedHistoricalFictionBook, setSelectedHistoricalFictionBook] = useState(0);
  const [selectedSciFiBook, setSelectedSciFiBook] = useState(0);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistedBooks, setWishlistedBooks] = useState<Book[]>([]);

  // Button animation values
  const readNowAnimation = useRef(new Animated.Value(1)).current;
  const wishlistAnimation = useRef(new Animated.Value(1)).current;

  // Pagination state for each category
  const [wantToReadPage, setWantToReadPage] = useState(0);
  const [crimeMysteryPage, setCrimeMysteryPage] = useState(0);
  const [shortStoryPage, setShortStoryPage] = useState(0);
  const [fantasyPage, setFantasyPage] = useState(0);
  const [romancePage, setRomancePage] = useState(0);
  const [historicalFictionPage, setHistoricalFictionPage] = useState(0);
  const [sciFiPage, setSciFiPage] = useState(0);

  // Number of books to show per page
  const booksPerPage = 3;

  // Animation values for each section
  const fadeAnimWantToRead = useRef(new Animated.Value(0)).current;
  const fadeAnimCrimeMystery = useRef(new Animated.Value(0)).current;
  const fadeAnimShortStory = useRef(new Animated.Value(0)).current;
  const fadeAnimFantasy = useRef(new Animated.Value(0)).current;
  const fadeAnimRomance = useRef(new Animated.Value(0)).current;
  const fadeAnimHistoricalFiction = useRef(new Animated.Value(0)).current;
  const fadeAnimSciFi = useRef(new Animated.Value(0)).current;

  // ScrollView refs for smooth scrolling
  const scrollViewRef = useRef(null);
  
  // State for recommended books based on user preferences
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [selectedRecommendedBook, setSelectedRecommendedBook] = useState(0);
  const [recommendedPage, setRecommendedPage] = useState(0);
  const fadeAnimRecommended = useRef(new Animated.Value(0)).current;
  
  // Search functionality
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  
  // Animation for search modal
  const searchAnimation = useRef(new Animated.Value(0)).current;

  // Helper function to paginate books
  const paginateBooks = (books: Book[], page: number): Book[] => {
    const startIndex = page * booksPerPage;
    return books.slice(startIndex, startIndex + booksPerPage);
  };

  // Load wishlist from AsyncStorage when component mounts
  useEffect(() => {
    loadWishlistFromStorage();
  }, []);

  // Animation when component mounts
  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnimWantToRead, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimCrimeMystery, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimShortStory, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimFantasy, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimRomance, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimHistoricalFiction, {
        toValue: 1,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimSciFi, {
        toValue: 1,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
    ];
    
    Animated.parallel(animations).start();
  }, []);

  // Load user's selected genres and set up recommendations
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const selectedGenresJson = await AsyncStorage.getItem('selectedGenres');
        
        if (selectedGenresJson) {
          const selectedGenres = JSON.parse(selectedGenresJson);
          const recommendations = getRecommendedBooks(selectedGenres);
          setRecommendedBooks(recommendations);
          
          // Animate the recommendations section
          Animated.timing(fadeAnimRecommended, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    };

    loadUserPreferences();
  }, []);

  // Function to load wishlist from AsyncStorage
  const loadWishlistFromStorage = async () => {
    try {
      // Load wishlist IDs
      const wishlistJson = await AsyncStorage.getItem('wishlist');
      if (wishlistJson) {
        const savedWishlist = JSON.parse(wishlistJson);
        setWishlist(savedWishlist);
      }
      
      // Load full wishlist books data
      const wishlistedBooksJson = await AsyncStorage.getItem('wishlistedBooks');
      if (wishlistedBooksJson) {
        const savedWishlistedBooks = JSON.parse(wishlistedBooksJson);
        setWishlistedBooks(savedWishlistedBooks);
      }
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error);
    }
  };

  // Function to save wishlist to AsyncStorage
  const saveWishlistToStorage = async (newWishlist: string[], newWishlistedBooks: Book[]) => {
    try {
      // Save wishlist IDs
      await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
      
      // Save full wishlist books data
      await AsyncStorage.setItem('wishlistedBooks', JSON.stringify(newWishlistedBooks));
    } catch (error) {
      console.error('Failed to save wishlist to storage:', error);
    }
  };

  // Show toast message
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
    }
  };

  // Function to get recommended books based on selected genres
  const getRecommendedBooks = (selectedGenres: string[]): Book[] => {
    const genreToBookMap: Record<string, Book[]> = {
      'crime': crimeMysteryBooks,
      'scifi': scienceFictionBooks,
      'romance': romanceBooks,
      'contemporary_romance': romanceBooks,
      'historical_romance': romanceBooks,
      'paranormal_romance': romanceBooks,
      'fantasy': fantasyBooks,
      'history': historicalFictionBooks,
      'horror': crimeMysteryBooks, // using crime books as placeholder for horror
      'biography': historicalFictionBooks, // using historical as placeholder for biography
      'poetry': shortStoryBooks, // using short stories as placeholder for poetry
      'superhero_comics': fantasyBooks, // using fantasy as placeholder for comics
      'manga': fantasyBooks, // using fantasy as placeholder for manga
      'graphic_novels': fantasyBooks, // using fantasy as placeholder for graphic novels
      'thriller': crimeMysteryBooks,
      'mystery': crimeMysteryBooks,
      'adventure': fantasyBooks,
      'short_story': shortStoryBooks,
      'werewolf': fantasyBooks,
      'non_fiction': historicalFictionBooks
    };
    
    // Collect books from selected genres
    let allRecommendedBooks: Book[] = [];
    
    selectedGenres.forEach(genreId => {
      const genreBooks = genreToBookMap[genreId];
      if (genreBooks) {
        // Take 2 random books from each genre
        const randomBooks = [...genreBooks]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
          
        allRecommendedBooks = [...allRecommendedBooks, ...randomBooks];
      }
    });
    
    // If no genres were selected or no matching books found, return some default recommendations
    if (allRecommendedBooks.length === 0) {
      return booksToRead;
    }

    // Shuffle and return up to 12 books
    return allRecommendedBooks
      .sort(() => 0.5 - Math.random())
      .slice(0, 12);
  };

  const handleContinueReading = () => {
    // Navigate to the book reader page with current book info
    router.push({
      pathname: '/book-reader',
      params: {
        bookTitle: 'Hunting Sweetie Rose',
        bookAuthor: 'Jack Fredrickson',
        currentPage: 235,
        totalPages: 345,
        timestamp: Date.now().toString()
      }
    });
  };

  const handleReadNow = (book: Book) => {
    console.log(`Reading now: ${book.title}`);
    
    // Animate the button
    Animated.sequence([
      Animated.timing(readNowAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(readNowAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Navigate to the book reader page with selected book info
      router.push({
        pathname: '/book-reader',
        params: {
          bookTitle: book.title,
          bookAuthor: book.author,
          currentPage: 1,
          totalPages: 345, // This would be dynamic in a real app
          timestamp: Date.now().toString()
        }
      });
    });
  };

  // Function to add or remove a book from wishlist
  const toggleWishlist = (book: Book) => {
    // Animate the wishlist button
    Animated.sequence([
      Animated.timing(wishlistAnimation, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(wishlistAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    // Update wishlist state
    if (wishlist.includes(book.id)) {
      // Remove from wishlist
      const newWishlist = wishlist.filter(id => id !== book.id);
      const newWishlistedBooks = wishlistedBooks.filter(b => b.id !== book.id);
      
      setWishlist(newWishlist);
      setWishlistedBooks(newWishlistedBooks);
      
      // Save to AsyncStorage
      saveWishlistToStorage(newWishlist, newWishlistedBooks);
      
      // Show toast message
      showToast(`Removed ${book.title} from wishlist`);
    } else {
      // Add to wishlist
      const newWishlist = [...wishlist, book.id];
      
      // Format book for wishlist
      const wishlistBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        description: book.description
      };
      
      const newWishlistedBooks = [...wishlistedBooks, wishlistBook];
      
      setWishlist(newWishlist);
      setWishlistedBooks(newWishlistedBooks);
      
      // Save to AsyncStorage
      saveWishlistToStorage(newWishlist, newWishlistedBooks);
      
      // Show toast message
      showToast(`Added ${book.title} to wishlist`);
    }
  };

  const handleSearchMore = (category: string) => {
    // Initialize search results with the appropriate category books
    let categoryBooks: Book[] = [];
    
    switch(category) {
      case "Want to read":
        categoryBooks = booksToRead;
        break;
      case "Crime & Mystery":
        categoryBooks = crimeMysteryBooks;
        break;
      case "Short stories":
        categoryBooks = shortStoryBooks;
        break;
      case "Fantasy":
        categoryBooks = fantasyBooks;
        break;
      case "Romance":
        categoryBooks = romanceBooks;
        break;
      case "Historical Fiction":
        categoryBooks = historicalFictionBooks;
        break;
      case "Science Fiction":
        categoryBooks = scienceFictionBooks;
        break;
      case "Recommendations":
        categoryBooks = recommendedBooks;
        break;
      default:
        // Default to all books if category is not recognized
        categoryBooks = [
          ...booksToRead,
          ...crimeMysteryBooks,
          ...shortStoryBooks,
          ...fantasyBooks,
          ...romanceBooks,
          ...historicalFictionBooks,
          ...scienceFictionBooks
        ];
    }
    
    // Set category name in search box
    setSearchQuery(category);
    
    // Set search results to the category books
    setSearchResults(categoryBooks);
    
    // Show search modal with pre-populated results
    setSearchVisible(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  // Perform search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 1) {
      // Combine all books for searching
      const allBooks = [
        ...booksToRead,
        ...crimeMysteryBooks,
        ...shortStoryBooks,
        ...fantasyBooks,
        ...romanceBooks,
        ...historicalFictionBooks,
        ...scienceFictionBooks
      ];
      
      // Filter books based on query
      const filteredResults = allBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  // Navigate to library screen
  const navigateToLibrary = () => {
    router.replace('/library');
  };

  if (!fontsLoaded) {
    return null;
  }

  // Get paginated book lists
  const paginatedRecommended = paginateBooks(recommendedBooks, recommendedPage);
  const paginatedWantToRead = paginateBooks(booksToRead, wantToReadPage);
  const paginatedCrimeMystery = paginateBooks(crimeMysteryBooks, crimeMysteryPage);
  const paginatedShortStory = paginateBooks(shortStoryBooks, shortStoryPage);
  const paginatedFantasy = paginateBooks(fantasyBooks, fantasyPage);
  const paginatedRomance = paginateBooks(romanceBooks, romancePage);
  const paginatedHistoricalFiction = paginateBooks(historicalFictionBooks, historicalFictionPage);
  const paginatedSciFi = paginateBooks(scienceFictionBooks, sciFiPage);

  // Navigation buttons for pagination
  const renderPaginationButtons = (
    books: Book[], 
    currentPage: number, 
    setPage: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const totalPages = Math.ceil(books.length / booksPerPage);
    
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
          onPress={() => setPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentPage === 0 ? "#ccc" : "#4a4e82"} />
        </TouchableOpacity>
        
        <Text style={styles.paginationText}>{currentPage + 1}/{totalPages}</Text>
        
        <TouchableOpacity 
          style={[styles.paginationButton, currentPage === totalPages - 1 && styles.paginationButtonDisabled]}
          onPress={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          <Ionicons name="chevron-forward" size={24} color={currentPage === totalPages - 1 ? "#ccc" : "#4a4e82"} />
        </TouchableOpacity>
      </View>
    );
  };

  // Book action buttons
  const renderBookActions = (book: Book) => {
    const isInWishlist = wishlist.includes(book.id);
    
    return (
      <View style={styles.bookActions}>
        <Animated.View style={{ transform: [{ scale: readNowAnimation }] }}>
          <TouchableOpacity 
            style={styles.readNowButton}
            onPress={() => handleReadNow(book)}
            activeOpacity={0.7}
          >
            <Text style={styles.readNowButtonText}>Read Now</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: wishlistAnimation }] }}>
          <TouchableOpacity 
            style={[styles.wishlistButton, isInWishlist && styles.wishlistButtonActive]}
            onPress={() => toggleWishlist(book)}
            activeOpacity={0.7}
          >
            <AntDesign 
              name={isInWishlist ? "heart" : "hearto"} 
              size={18} 
              color={isInWishlist ? "#fff" : "#4a4e82"} 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  // Search more button for categories
  const renderSearchMoreButton = (category: string) => {
    return (
      <TouchableOpacity 
        style={styles.searchMoreButton}
        onPress={() => handleSearchMore(category)}
        activeOpacity={0.7}
      >
        <Text style={styles.searchMoreButtonText}>Search More</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.searchMoreIcon} />
      </TouchableOpacity>
    );
  };

  // Generic render function for books in horizontal scroll
  const renderBookItem = (
    item: Book, 
    index: number, 
    selectedIndex: number, 
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const isSelected = index === selectedIndex;
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.bookItem,
          isSelected ? styles.selectedBookItem : styles.nonSelectedBookItem,
          {
            transform: [
              { 
                scale: isSelected ? 1 : 0.85 
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={{ width: '100%', alignItems: 'center' }}
          onPress={() => setSelectedIndex(index)}
          activeOpacity={0.7}
        >
          <Image
            source={typeof item.coverImage === 'string' ? { uri: item.coverImage } : item.coverImage}
            style={[
              styles.bookItemCover,
              isSelected ? styles.selectedBookCover : styles.nonSelectedBookCover
            ]}
          />
          {isSelected ? (
            <View style={styles.selectedBookDetails}>
              <Text style={styles.selectedBookTitle}>{item.title}</Text>
              <Text style={styles.selectedBookAuthor}>{item.author}</Text>
              {renderBookActions(item)}
            </View>
          ) : (
            <Text style={styles.bookItemTitle} numberOfLines={2}>{item.title}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Toggle search modal
  const toggleSearch = () => {
    if (searchVisible) {
      // Animate closing
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSearchVisible(false);
        setSearchQuery('');
        setSearchResults([]);
      });
    } else {
      // Show search modal
      setSearchVisible(true);
      // Animate opening
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Vellichor</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently reading</Text>
          
          <Animated.View 
            style={[
              styles.bookCard,
              { opacity: fadeAnimWantToRead, transform: [{ translateY: fadeAnimWantToRead.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}] }
            ]}
          >
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>Hunting Sweetie Rose</Text>
              <Text style={styles.authorName}>Jack Fredrickson</Text>
              
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={18} color="#F2BB36" />
                <Text style={styles.ratingText}>4.5/5.0</Text>
              </View>
              
              <Text style={styles.progressText}>{progress}% complete</Text>
              
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
                <View style={styles.progressBarIndicator} />
              </View>
              
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinueReading}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue reading</Text>
              </TouchableOpacity>
            </View>
            
            <Image 
              source={require('../assets/images/book-covers/mystery_book1.jpg')}
              style={styles.bookCover}
            />
          </Animated.View>
        </View>
        
        {/* Recommended Books Section - only shown if user has selected genres */}
        {recommendedBooks.length > 0 && (
          <Animated.View style={[
            styles.section,
            { opacity: fadeAnimRecommended, transform: [{ translateY: fadeAnimRecommended.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}] }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              {renderSearchMoreButton("Recommendations")}
            </View>
            
            <View style={styles.bookListContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalBookList}
                decelerationRate={0.85}
                snapToInterval={width * 0.45}
                snapToAlignment="center"
              >
                {paginatedRecommended.map((book: Book, index: number) => 
                  renderBookItem(book, index, selectedRecommendedBook, setSelectedRecommendedBook)
                )}
              </ScrollView>
              
              {renderPaginationButtons(recommendedBooks, recommendedPage, setRecommendedPage)}
            </View>
            
            {selectedRecommendedBook !== null && paginatedRecommended[selectedRecommendedBook] && (
              <View style={styles.bookDescription}>
                <Text style={styles.bookDescriptionText}>
                  {paginatedRecommended[selectedRecommendedBook].description}
                </Text>
              </View>
            )}
          </Animated.View>
        )}
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimWantToRead, transform: [{ translateY: fadeAnimWantToRead.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Want to read</Text>
            {renderSearchMoreButton("Want to read")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedWantToRead.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedWantToReadBook, setSelectedWantToReadBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(booksToRead, wantToReadPage, setWantToReadPage)}
          </View>
          
          {selectedWantToReadBook !== null && paginatedWantToRead[selectedWantToReadBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedWantToRead[selectedWantToReadBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimCrimeMystery, transform: [{ translateY: fadeAnimCrimeMystery.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Crime & Mystery</Text>
            {renderSearchMoreButton("Crime & Mystery")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedCrimeMystery.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedCrimeMysteryBook, setSelectedCrimeMysteryBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(crimeMysteryBooks, crimeMysteryPage, setCrimeMysteryPage)}
          </View>
          
          {selectedCrimeMysteryBook !== null && paginatedCrimeMystery[selectedCrimeMysteryBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedCrimeMystery[selectedCrimeMysteryBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimShortStory, transform: [{ translateY: fadeAnimShortStory.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Short stories</Text>
            {renderSearchMoreButton("Short stories")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedShortStory.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedShortStoryBook, setSelectedShortStoryBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(shortStoryBooks, shortStoryPage, setShortStoryPage)}
          </View>
          
          {selectedShortStoryBook !== null && paginatedShortStory[selectedShortStoryBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedShortStory[selectedShortStoryBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimFantasy, transform: [{ translateY: fadeAnimFantasy.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Fantasy</Text>
            {renderSearchMoreButton("Fantasy")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedFantasy.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedFantasyBook, setSelectedFantasyBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(fantasyBooks, fantasyPage, setFantasyPage)}
          </View>
          
          {selectedFantasyBook !== null && paginatedFantasy[selectedFantasyBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedFantasy[selectedFantasyBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimRomance, transform: [{ translateY: fadeAnimRomance.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Romance</Text>
            {renderSearchMoreButton("Romance")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedRomance.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedRomanceBook, setSelectedRomanceBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(romanceBooks, romancePage, setRomancePage)}
          </View>
          
          {selectedRomanceBook !== null && paginatedRomance[selectedRomanceBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedRomance[selectedRomanceBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimHistoricalFiction, transform: [{ translateY: fadeAnimHistoricalFiction.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Historical Fiction</Text>
            {renderSearchMoreButton("Historical Fiction")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedHistoricalFiction.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedHistoricalFictionBook, setSelectedHistoricalFictionBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(historicalFictionBooks, historicalFictionPage, setHistoricalFictionPage)}
          </View>
          
          {selectedHistoricalFictionBook !== null && paginatedHistoricalFiction[selectedHistoricalFictionBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedHistoricalFiction[selectedHistoricalFictionBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
        
        <Animated.View style={[
          styles.section,
          { opacity: fadeAnimSciFi, transform: [{ translateY: fadeAnimSciFi.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}] }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Science Fiction</Text>
            {renderSearchMoreButton("Science Fiction")}
          </View>
          
          <View style={styles.bookListContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalBookList}
              decelerationRate={0.85}
              snapToInterval={width * 0.45}
              snapToAlignment="center"
            >
              {paginatedSciFi.map((book: Book, index: number) => 
                renderBookItem(book, index, selectedSciFiBook, setSelectedSciFiBook)
              )}
            </ScrollView>
            
            {renderPaginationButtons(scienceFictionBooks, sciFiPage, setSciFiPage)}
          </View>
          
          {selectedSciFiBook !== null && paginatedSciFi[selectedSciFiBook] && (
            <View style={styles.bookDescription}>
              <Text style={styles.bookDescriptionText}>
                {paginatedSciFi[selectedSciFiBook].description}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/library')}
        >
          <Ionicons name="bookmark-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, styles.activeTab]}
        >
          <Ionicons name="book" size={24} color="#4a4e82" />
          <Text style={styles.activeTabButtonText}>Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/browse')}
        >
          <Ionicons name="search-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.replace('/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#555" />
          <Text style={styles.tabButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Modal */}
      <Modal
        visible={searchVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleSearch}
      >
        <Animated.View 
          style={[
            styles.searchModalContainer,
            {
              opacity: searchAnimation,
              transform: [
                { 
                  translateY: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.searchModalContent}>
            <View style={styles.searchHeader}>
              <TouchableOpacity onPress={toggleSearch} style={styles.searchCloseButton}>
                <Ionicons name="arrow-back" size={24} color="#4a4e82" />
              </TouchableOpacity>
              
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search books, authors, genres..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    style={styles.searchClearButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* Search Results */}
            <ScrollView style={styles.searchResults}>
              {searchQuery && (
                <Text style={styles.searchCategoryTitle}>
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                </Text>
              )}
              
              {searchResults.length > 0 ? (
                searchResults.map((book, index) => (
                  <TouchableOpacity 
                    key={`search-${book.id}-${index}`}
                    style={styles.searchResultItem}
                    onPress={() => {
                      // Navigate to book reader
                      router.push({
                        pathname: '/book-reader',
                        params: {
                          bookTitle: book.title,
                          bookAuthor: book.author,
                          currentPage: 1,
                          totalPages: 345, // This would be dynamic in a real app
                          timestamp: Date.now().toString()
                        }
                      });
                      toggleSearch();
                    }}
                  >
                    <Image 
                      source={typeof book.coverImage === 'string' ? { uri: book.coverImage } : book.coverImage} 
                      style={styles.searchResultImage} 
                    />
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultTitle}>{book.title}</Text>
                      <Text style={styles.searchResultAuthor}>{book.author}</Text>
                      <Text style={styles.searchResultDescription} numberOfLines={2}>
                        {book.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                searchQuery.length > 1 ? (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No results found</Text>
                  </View>
                ) : (
                  <View style={styles.searchInstructionsContainer}>
                    <Ionicons name="search" size={50} color="#ddd" />
                    <Text style={styles.searchInstructionsText}>
                      Type to search for books, authors, or genres
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
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
    width: '100%',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingRight: 5,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    color: '#4a4e82',
    fontWeight: 'bold',
    marginBottom: 0,
    flex: 1,
    paddingRight: 10,
  },
  bookListContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  paginationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 10,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#4a4e82',
  },
  bookCard: {
    backgroundColor: '#faf7e7',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookInfo: {
    flex: 1,
    marginRight: 15,
  },
  bookTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#4a4e82',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  authorName: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#5C3D2F',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    marginLeft: 6,
  },
  progressText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0ddd3',
    borderRadius: 4,
    marginBottom: 20,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4a4e82',
    borderRadius: 4,
  },
  progressBarIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4a4e82',
    position: 'absolute',
    top: -4,
    left: `${60 - 2}%`, // Adjust based on progress percentage
    borderWidth: 2,
    borderColor: '#faf7e7',
  },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  continueButton: {
    backgroundColor: '#4a4e82',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  horizontalBookList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
  },
  bookItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBookItem: {
    width: 140,
    marginTop: 0,
    transform: [{scale: 1}],
  },
  nonSelectedBookItem: {
    width: 90,
    marginTop: 30,
    opacity: 0.7,
    transform: [{scale: 0.85}],
  },
  bookItemCover: {
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  selectedBookCover: {
    width: 130,
    height: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  nonSelectedBookCover: {
    width: 80,
    height: 120,
  },
  bookItemTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#4a4e82',
    textAlign: 'center',
    width: 90,
  },
  selectedBookDetails: {
    alignItems: 'center',
    width: 130,
  },
  selectedBookTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#4a4e82',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedBookAuthor: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#5C3D2F',
    textAlign: 'center',
    marginTop: 3,
  },
  bookDescription: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
  },
  bookDescriptionText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
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
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  readNowButton: {
    backgroundColor: '#4a4e82',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  readNowButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  wishlistButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a4e82',
  },
  wishlistButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  searchMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a4e82',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginLeft: 15,
  },
  searchMoreButtonText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: 'white',
    marginRight: 4,
  },
  searchMoreIcon: {
    marginLeft: 2,
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchModalContent: {
    flex: 1,
    backgroundColor: '#faf7e7',
    marginTop: 50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd3',
  },
  searchCloseButton: {
    marginRight: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#333',
  },
  searchClearButton: {
    padding: 5,
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd3',
  },
  searchResultImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
  },
  searchResultInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  searchResultTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#4a4e82',
    fontWeight: 'bold',
  },
  searchResultAuthor: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#5C3D2F',
    marginTop: 5,
  },
  searchResultDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#5C3D2F',
    marginTop: 5,
  },
  noResultsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#888',
  },
  searchInstructionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  searchInstructionsText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
  },
  searchCategoryTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#4a4e82',
    fontWeight: 'bold',
    padding: 15,
    paddingBottom: 10,
  },
}); 