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
  Pressable,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();
const { width, height } = Dimensions.get('window');

// Categories data with image URLs and titles
type Category = {
  id: string;
  title: string;
  image: any;
  icon: string;
  color: string;
};

type RecentSearch = {
  id: string;
  query: string;
  count: number;
  color: string;
};

// Books data
type Book = {
  id: string;
  title: string;
  author: string;
  coverImage: any;
  description: string;
  tags: string[];
  tropes: string[];
};

// Sample books for search results
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'The Shadow Within',
    author: 'Eleanor Grey',
    coverImage: require('../assets/images/book-covers/mystery_book1.jpg'),
    description: 'A thrilling tale of mystery and intrigue in a world of shadows.',
    tags: ['mystery', 'fantasy', 'dark', 'main character meltdowns', 'angst but make it pretty'],
    tropes: ['Tragic Backstory', 'Morally Grey Love Interest', 'Found Family']
  },
  {
    id: '2',
    title: 'Lost Horizons',
    author: 'Marcus Wells',
    coverImage: require('../assets/images/book-covers/adventure_book2.jpg'),
    description: 'An adventure across dimensions in search of a forgotten world.',
    tags: ['adventure', 'fantasy', 'soft magic & sharp morals', 'thrones made of longing'],
    tropes: ['Quest with a Motley Crew', 'Found Family', 'Time Travel or Parallel Worlds', 'The Chosen One']
  },
  {
    id: '3',
    title: 'Whispers in the Dark',
    author: 'Sophia Night',
    coverImage: require('../assets/images/book-covers/horror_book1.jpg'),
    description: 'The darkness holds secrets that are about to be revealed.',
    tags: ['horror', 'thriller', 'whispers between pages', 'armor on, emotions off'],
    tropes: ['Psychological Horror', 'Gothic Mansion', 'Unreliable Narrator', 'Secret Society']
  },
  {
    id: '4',
    title: 'Heart of the Storm',
    author: 'Alexander Thunder',
    coverImage: require('../assets/images/book-covers/romance_book1.jpg'),
    description: 'A romance that blossoms in the midst of chaos and destruction.',
    tags: ['romance', 'drama', 'read this with a blanket and tea', 'soft spells & secret swords'],
    tropes: ['Enemies to Lovers', 'Forced Proximity', 'Tragic Backstory', 'Possessive Protector']
  },
  {
    id: '5',
    title: 'The Last Guardian',
    author: 'Diana Shield',
    coverImage: require('../assets/images/book-covers/fantasy_book1.jpg'),
    description: 'The final protector of an ancient power must choose between duty and desire.',
    tags: ['fantasy', 'adventure', 'heir of heartache', 'cursed, crowned & complicated'],
    tropes: ['Heir to the Throne', 'Forbidden Love', 'Ancient Prophecy', 'Tournament Arc']
  },
  {
    id: '6',
    title: 'Starlight Odyssey',
    author: 'Neil Cosmos',
    coverImage: require('../assets/images/book-covers/scifi_book1.jpg'),
    description: 'A journey through the stars that will test the limits of humanity.',
    tags: ['sci-fi', 'adventure', 'magic in the margins', 'still soft, still here'],
    tropes: ['Found Family', 'Quest with a Motley Crew', 'Time Travel or Parallel Worlds']
  },
  {
    id: '7',
    title: 'Echoes of Yesterday',
    author: 'Olivia Timeline',
    coverImage: require('../assets/images/book-covers/thriller_book1.jpg'),
    description: 'The past refuses to stay buried in this time-bending thriller.',
    tags: ['thriller', 'mystery', 'a little bit lost, a lot in love', 'ghosts in the garden of kings'],
    tropes: ['Unreliable Narrator', 'Time Travel or Parallel Worlds', 'The Guilt of Survival']
  },
  {
    id: '8',
    title: 'The Forgotten Spell',
    author: 'Merlin Wise',
    coverImage: require('../assets/images/book-covers/fantasy_book2.jpg'),
    description: 'An ancient magic rediscovered could save the world—or destroy it.',
    tags: ['fantasy', 'magic', 'magic that knows your name', 'moonlit crowns & quiet courage'],
    tropes: ['Magic School / Academy', 'Ancient Prophecy', 'Magical Artifact', 'The Chosen One']
  },
  {
    id: '9',
    title: 'Crimson Ties',
    author: 'Victoria Blood',
    coverImage: require('../assets/images/book-covers/paranormal_romance_book1.jpg'),
    description: 'In a world of vampires, love is the most dangerous addiction.',
    tags: ['paranormal', 'romance', 'loyalty, laced in lavender', 'soft magic & sharp morals'],
    tropes: ['Forbidden Love', 'Enemies to Lovers', 'Slow Burn', 'Beast & Beauty']
  },
  {
    id: '10',
    title: 'Silent Witness',
    author: 'Thomas Observer',
    coverImage: require('../assets/images/book-covers/crime_book1.jpg'),
    description: "The only witness to the crime can't speak, but the truth will be heard.",
    tags: ['mystery', 'thriller', 'candlelight reads & cloudy thoughts', 'waltzing through warzones'],
    tropes: ['Unreliable Narrator', 'Psychological Horror', 'The Betrayer']
  },
  {
    id: '11',
    title: 'Midnight Embrace',
    author: 'Raven Nightshade',
    coverImage: require('../assets/images/book-covers/paranormal_romance_book2.jpg'),
    description: 'When darkness falls, their forbidden romance ignites.',
    tags: ['romance', 'paranormal', 'read with chocolate', 'moonlight confessions'],
    tropes: ['Enemies to Lovers', 'Forbidden Love', 'Slow Burn', 'Grumpy x Sunshine']
  },
  {
    id: '12',
    title: 'Kingdom of Glass',
    author: 'Crystal Shard',
    coverImage: require('../assets/images/book-covers/fantasy_book3.jpg'),
    description: 'In a realm where power is as fragile as glass, betrayal shatters everything.',
    tags: ['fantasy', 'royal intrigue', 'crowns of sorrow', 'glittering dangers'],
    tropes: ['Heir to the Throne', 'Tournament Arc', 'The Betrayer', 'Enemies Forced to Work Together']
  },
  {
    id: '13',
    title: 'One Bed, Two Hearts',
    author: 'Rose Thornfield',
    coverImage: require('../assets/images/book-covers/contemporary_romance_book1.jpg'),
    description: 'A snowstorm, a booking error, and undeniable chemistry.',
    tags: ['romance', 'contemporary', 'cozy vibes', 'winter romance'],
    tropes: ['One Bed', 'Forced Proximity', 'Enemies to Lovers', 'Fake Dating']
  },
  {
    id: '14',
    title: 'The Royal Deception',
    author: 'Crown Secrets',
    coverImage: require('../assets/images/book-covers/historical_romance_book1.jpg'),
    description: 'She never expected the gardener to be the crown prince in disguise.',
    tags: ['romance', 'royalty', 'secret identities', 'palace intrigue'],
    tropes: ['Secret Royal / Hidden Identity', 'Fake Dating', 'Slow Burn', 'Opposites Attract']
  },
  {
    id: '15',
    title: 'Academy of Elemental Magic',
    author: 'Spell Caster',
    coverImage: require('../assets/images/book-covers/fantasy_book3.jpg'),
    description: 'Four students with extraordinary powers. One academy with dangerous secrets.',
    tags: ['fantasy', 'magic school', 'elemental powers', 'friendship'],
    tropes: ['Magic School / Academy', 'Found Family', 'Tournament Arc', 'Mysterious Powers Awaken']
  },
  {
    id: '16',
    title: 'The Marriage Contract',
    author: 'Vow Breaker',
    coverImage: require('../assets/images/book-covers/contemporary_romance_book2.jpg'),
    description: 'Their marriage was supposed to be just business. Their hearts had other plans.',
    tags: ['romance', 'billionaire', 'contract marriage', 'business arrangement'],
    tropes: ['Marriage of Convenience', 'Slow Burn', 'Enemies to Lovers', 'Grumpy x Sunshine']
  },
  {
    id: '17',
    title: 'Dragon Rider\'s Promise',
    author: 'Flame Tamer',
    coverImage: require('../assets/images/book-covers/fantasy_book1.jpg'),
    description: 'The bond between dragon and rider transcends the war that divides them.',
    tags: ['fantasy', 'dragons', 'war', 'magical bond'],
    tropes: ['Dragons & Their Riders', 'Forbidden Love', 'Ancient Prophecy', 'Lovers on Opposite Sides of a War']
  },
  {
    id: '18',
    title: 'Small Town Secrets',
    author: 'Maple Grove',
    coverImage: require('../assets/images/book-covers/mystery_book2.jpg'),
    description: 'Returning to her hometown uncovers secrets she never expected to find.',
    tags: ['romance', 'mystery', 'homecoming', 'small town charm'],
    tropes: ['Small Town Romance', 'Second Chance Romance', 'Secret Society', 'Breaking Family Patterns']
  },
  {
    id: '19',
    title: 'Age of Wisdom',
    author: 'Time Weaver',
    coverImage: require('../assets/images/book-covers/historical_romance_book2.jpg'),
    description: 'The decades between them couldn\'t keep their hearts apart.',
    tags: ['romance', 'age gap', 'wisdom', 'life experience'],
    tropes: ['Age Gap Romance', 'Slow Burn', 'Making Peace with the Person You Were at 19']
  },
  {
    id: '20',
    title: 'The Mind\'s Labyrinth',
    author: 'Psyche Wanderer',
    coverImage: require('../assets/images/book-covers/thriller_book3.jpg'),
    description: 'Inside his fractured mind lies the truth that could save them all.',
    tags: ['psychological', 'thriller', 'mind games', 'reality bending'],
    tropes: ['Psychological Horror', 'The Quiet Breakdown of a Once Strong Mind', 'Unreliable Narrator']
  }
];

const categories: Category[] = [
  { id: '1', title: 'Romance', image: require('../assets/images/genres/romance.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '2', title: 'Fanfiction', image: require('../assets/images/genres/fanfiction.jpg'), icon: 'sparkles', color: '#4ECDC4' },
  { id: '3', title: 'LGBTQ+', image: require('../assets/images/genres/lgbtq.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '4', title: 'Vellichor Originals', image: require('../assets/images/genres/vellichor_originals.jpg'), icon: 'sparkles', color: '#4ECDC4' },
  { id: '5', title: 'Werewolf', image: require('../assets/images/genres/werewolf.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '6', title: 'New Adult', image: require('../assets/images/genres/new_adult.jpg'), icon: 'sparkles', color: '#4ECDC4' },
  { id: '7', title: 'Fantasy', image: require('../assets/images/genres/fantasy.jpg'), icon: 'sparkles', color: '#4ECDC4' },
  { id: '8', title: 'Short Story', image: require('../assets/images/genres/short_story.jpg'), icon: 'search', color: '#45B7D1' },
  { id: '9', title: 'Teen Fiction', image: require('../assets/images/genres/teen_fiction.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '10', title: 'Historical Fiction', image: require('../assets/images/genres/historical_fiction.jpg'), icon: 'time', color: '#D7A774' },
  { id: '11', title: 'Paranormal', image: require('../assets/images/genres/paranormal.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '12', title: 'Editor\'s Picks', image: require('../assets/images/genres/editors_picks.jpg'), icon: 'sparkles', color: '#4ECDC4' },
  { id: '13', title: 'Humor', image: require('../assets/images/genres/humor.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '14', title: 'Horror', image: require('../assets/images/genres/horror.jpg'), icon: 'skull', color: '#6B5B95' },
  { id: '15', title: 'Contemporary Lit', image: require('../assets/images/genres/contemporary.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '16', title: 'Diverse Lit', image: require('../assets/images/genres/diverse.jpg'), icon: 'sparkles', color: '#4ECDC4' },
  { id: '17', title: 'Mystery', image: require('../assets/images/genres/mystery.jpg'), icon: 'search', color: '#45B7D1' },
  { id: '18', title: 'Thriller', image: require('../assets/images/genres/thriller.jpg'), icon: 'flash', color: '#FF9671' },
  { id: '19', title: 'Science Fiction', image: require('../assets/images/genres/scifi.jpg'), icon: 'rocket', color: '#845EC2' },
  { id: '20', title: 'Vellors', image: require('../assets/images/genres/vellors.jpg'), icon: 'heart', color: '#FF6B6B' },
  { id: '21', title: 'Adventure', image: require('../assets/images/genres/adventure.jpg'), icon: 'compass', color: '#88B04B' },
  { id: '22', title: 'Non-Fiction', image: require('../assets/images/genres/non_fiction.jpg'), icon: 'book', color: '#FF6B6B' },
  { id: '23', title: 'Poetry', image: require('../assets/images/genres/poetry.jpg'), icon: 'sparkles', color: '#4ECDC4' },
];

// Recent searches data with color variety
const recentSearches: RecentSearch[] = [
  { id: '1', query: 'Fantasy Adventure', count: 247, color: '#4a4e82' },
  { id: '2', query: 'Mystery Novels', count: 182, color: '#3a7ca5' },
  { id: '3', query: 'Romance', count: 156, color: '#d25a7e' },
  { id: '4', query: 'Horror Stories', count: 133, color: '#947e5d' },
  { id: '5', query: 'Science Fiction', count: 201, color: '#3d7068' },
];

// Add tag-to-book mapping for About page tags
const aboutPageTagMapping: Record<string, string[]> = {
  // Emotional Bookshelf tags
  'Soft Ache': ['2', '4', '11', '13', '19'],
  'Made Me Spiral': ['3', '7', '10', '20'],
  'Felt Like Magic': ['1', '5', '8', '15', '17'],
  'Left Me Empty': ['3', '7', '10', '20'],
  'Healed Something in Me': ['4', '9', '13', '16', '18'],
  
  // Moodboard Theme tags
  'Feral Fantasy': ['5', '8', '12', '15', '17'],
  'Candlelight Academia': ['2', '7', '14', '15', '20'],
  'Wholesome Pain': ['4', '9', '11', '13', '19'],
  'Kingdomcore': ['1', '5', '12', '14', '17'],
  'Liminal Romance': ['4', '9', '11', '13', '16']
};

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
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for category-specific books
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);
  const [showCategoryBooks, setShowCategoryBooks] = useState(false);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  
  // Add state for managing recent searches
  const [localRecentSearches, setLocalRecentSearches] = useState<RecentSearch[]>(recentSearches);
  
  // Load search query if coming from tropes screen
  useEffect(() => {
    const loadSearchQuery = async () => {
      try {
        const savedQuery = await AsyncStorage.getItem('search_query');
        if (savedQuery) {
          setSearchText(savedQuery);
          // Perform search with the loaded query
          performSearch(savedQuery);
          // Clear the saved query after loading it
          await AsyncStorage.removeItem('search_query');
        }
      } catch (error) {
        console.error('Failed to load search query:', error);
      }
    };
    
    loadSearchQuery();
  }, []);
  
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

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let results: Book[] = [];
      
      // Check if query exactly matches one of our About page tags (case insensitive)
      const exactTag = Object.keys(aboutPageTagMapping).find(
        tag => tag.toLowerCase() === query.toLowerCase()
      );
      
      if (exactTag) {
        // Get the book IDs for this tag
        const bookIds = aboutPageTagMapping[exactTag];
        // Filter books by these IDs
        results = sampleBooks.filter(book => bookIds.includes(book.id));
      } 
      // Handle hashtag searches (from trope cards)
      else if (lowerQuery.startsWith('#')) {
        // Remove the # symbol and get the trope name
        const tropeName = lowerQuery.substring(1);
        
        // Search for books that specifically match this trope
        results = sampleBooks.filter(book => 
          book.tropes.some(trope => 
            trope.toLowerCase() === tropeName.toLowerCase() ||
            trope.toLowerCase().includes(tropeName.toLowerCase())
          )
        );
        
        // If no exact trope matches, do a more general search
        if (results.length === 0) {
          const searchTerms = tropeName.replace(/[-_]/g, ' ');
          results = sampleBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerms) || 
            book.author.toLowerCase().includes(searchTerms) || 
            book.description.toLowerCase().includes(searchTerms) ||
            book.tags.some(tag => tag.toLowerCase().includes(searchTerms))
          );
        }
      } else {
        // Regular search (not a hashtag)
        results = sampleBooks.filter(book => 
          book.title.toLowerCase().includes(lowerQuery) || 
          book.author.toLowerCase().includes(lowerQuery) || 
          book.description.toLowerCase().includes(lowerQuery) ||
          book.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          book.tropes.some(trope => trope.toLowerCase().includes(lowerQuery))
        );
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500); // Simulate network delay
  };

  // Handle search input changes with recent searches update
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    performSearch(text);
  };

  // Handle category selection
  const handleCategoryPress = (categoryId: string) => {
    // If same category selected, toggle off
    if (categoryId === selectedCategory) {
      setSelectedCategory(null);
      setShowCategoryBooks(false);
      setCategoryBooks([]);
      return;
    }
    
    setSelectedCategory(categoryId);
    
    // Find the category title
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    setSelectedCategoryTitle(category.title);
    
    // Filter books based on category
    let filteredBooks: Book[] = [];
    
    switch(category.title.toLowerCase()) {
      case 'romance':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('romance')) ||
          book.title.toLowerCase().includes('romance') ||
          book.description.toLowerCase().includes('romance') ||
          book.tropes.some(trope => 
            trope.toLowerCase().includes('lover') || 
            trope.toLowerCase().includes('romance')
          )
        );
        break;
      case 'fantasy':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('fantasy')) ||
          book.title.toLowerCase().includes('fantasy') ||
          book.description.toLowerCase().includes('fantasy') ||
          book.tropes.some(trope => 
            trope.toLowerCase().includes('magic') || 
            trope.toLowerCase().includes('dragon') ||
            trope.toLowerCase().includes('ancient') ||
            trope.toLowerCase().includes('throne')
          )
        );
        break;
      case 'mystery':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('mystery')) ||
          book.title.toLowerCase().includes('mystery') ||
          book.description.toLowerCase().includes('mystery')
        );
        break;
      case 'thriller':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('thriller')) ||
          book.title.toLowerCase().includes('thriller') ||
          book.description.toLowerCase().includes('thriller')
        );
        break;
      case 'horror':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('horror')) ||
          book.title.toLowerCase().includes('horror') ||
          book.description.toLowerCase().includes('horror')
        );
        break;
      case 'science fiction':
      case 'sci-fi':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => 
            tag.toLowerCase().includes('sci-fi') || 
            tag.toLowerCase().includes('science fiction')
          ) ||
          book.title.toLowerCase().includes('star') ||
          book.description.toLowerCase().includes('space') ||
          book.description.toLowerCase().includes('future')
        );
        break;
      case 'werewolf':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('werewolf')) ||
          book.title.toLowerCase().includes('wolf') ||
          book.description.toLowerCase().includes('werewolf') ||
          book.description.toLowerCase().includes('wolf')
        );
        break;
      case 'paranormal':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('paranormal')) ||
          book.title.toLowerCase().includes('paranormal') ||
          book.description.toLowerCase().includes('paranormal') ||
          book.description.toLowerCase().includes('ghost') ||
          book.description.toLowerCase().includes('vampire')
        );
        break;
      case 'adventure':
        filteredBooks = sampleBooks.filter(book => 
          book.tags.some(tag => tag.toLowerCase().includes('adventure')) ||
          book.title.toLowerCase().includes('adventure') ||
          book.description.toLowerCase().includes('adventure') ||
          book.description.toLowerCase().includes('journey')
        );
        break;
      // For other categories, show some books that might be relevant based on tags
      default:
        filteredBooks = sampleBooks.filter((book, index) => 
          // Use category title as a potential keyword
          book.tags.some(tag => tag.toLowerCase().includes(category.title.toLowerCase())) ||
          book.title.toLowerCase().includes(category.title.toLowerCase()) ||
          book.description.toLowerCase().includes(category.title.toLowerCase()) ||
          // Otherwise just show some random books (5 max)
          index % 4 === 0
        ).slice(0, 8);
        break;
    }
    
    setCategoryBooks(filteredBooks);
    setShowCategoryBooks(true);
  };
  
  // Handle recent search item click
  const handleRecentSearchClick = (query: string) => {
    setSearchText(query);
    
    // Handle specific search terms directly
    if (query === "Horror Stories") {
      // Directly show horror books
      const horrorBooks = sampleBooks.filter(book => 
        book.tags.some(tag => tag.toLowerCase().includes('horror')) ||
        book.title.toLowerCase().includes('horror') ||
        book.description.toLowerCase().includes('horror') ||
        book.tropes.some(trope => 
          trope.toLowerCase().includes('horror') || 
          trope.toLowerCase().includes('gothic') || 
          trope.toLowerCase().includes('psychological horror')
        )
      );
      setSearchResults(horrorBooks);
      return;
    } else if (query === "Fantasy Adventure") {
      // Directly show fantasy/adventure books
      const fantasyBooks = sampleBooks.filter(book => 
        book.tags.some(tag => tag.toLowerCase().includes('fantasy') || tag.toLowerCase().includes('adventure')) ||
        book.title.toLowerCase().includes('fantasy') || book.title.toLowerCase().includes('adventure') ||
        book.description.toLowerCase().includes('fantasy') || book.description.toLowerCase().includes('adventure') ||
        book.tropes.some(trope => 
          trope.toLowerCase().includes('quest') || 
          trope.toLowerCase().includes('magic') || 
          trope.toLowerCase().includes('adventure')
        )
      );
      setSearchResults(fantasyBooks);
      return;
    } else if (query === "Mystery Novels") {
      // Directly show mystery books
      const mysteryBooks = sampleBooks.filter(book => 
        book.tags.some(tag => tag.toLowerCase().includes('mystery')) ||
        book.title.toLowerCase().includes('mystery') ||
        book.description.toLowerCase().includes('mystery') ||
        book.tropes.some(trope => 
          trope.toLowerCase().includes('mystery') || 
          trope.toLowerCase().includes('detective') || 
          trope.toLowerCase().includes('crime')
        )
      );
      setSearchResults(mysteryBooks);
      return;
    } else if (query === "Romance") {
      // Directly show romance books
      const romanceBooks = sampleBooks.filter(book => 
        book.tags.some(tag => tag.toLowerCase().includes('romance')) ||
        book.title.toLowerCase().includes('romance') ||
        book.description.toLowerCase().includes('romance') ||
        book.tropes.some(trope => 
          trope.toLowerCase().includes('love') || 
          trope.toLowerCase().includes('romance') || 
          trope.toLowerCase().includes('relationship')
        )
      );
      setSearchResults(romanceBooks);
      return;
    } else if (query === "Science Fiction") {
      // Directly show sci-fi books
      const scifiBooks = sampleBooks.filter(book => 
        book.tags.some(tag => tag.toLowerCase().includes('sci-fi') || tag.toLowerCase().includes('science fiction')) ||
        book.title.toLowerCase().includes('sci-fi') || book.title.toLowerCase().includes('science fiction') ||
        book.description.toLowerCase().includes('sci-fi') || book.description.toLowerCase().includes('science fiction') ||
        book.tropes.some(trope => 
          trope.toLowerCase().includes('space') || 
          trope.toLowerCase().includes('future') || 
          trope.toLowerCase().includes('technology')
        )
      );
      setSearchResults(scifiBooks);
      return;
    }
    
    // Fall back to normal search for other queries
    performSearch(query);
  };

  // Navigate to reading screen
  const navigateToReading = () => {
    router.replace('/reading');
  };

  // Add a function to navigate to book reader
  const navigateToBookReader = (book: Book) => {
    router.replace({
      pathname: '/book-reader',
      params: {
        bookTitle: book.title,
        bookAuthor: book.author,
        currentPage: Math.floor(Math.random() * 100) + 1, // Random current page (1-100)
        totalPages: Math.floor(Math.random() * 300) + 150, // Random total pages (150-450)
      }
    });
  };

  // Navigate to profile screen
  const navigateToProfile = () => {
    router.replace('/profile');
  };

  // Handle removing a recent search item
  const handleRemoveRecentSearch = (id: string) => {
    // Filter out the search with the given ID
    const updatedSearches = localRecentSearches.filter(search => search.id !== id);
    setLocalRecentSearches(updatedSearches);
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
        onPress={() => handleRecentSearchClick(item.query)}
        activeOpacity={0.7}
      >
        <View style={[styles.recentSearchIconContainer, { backgroundColor: item.color }]}>
          {getRecentSearchIcon(item.query)}
        </View>
        <View style={styles.recentSearchContent}>
          <Text style={styles.recentSearchText}>{item.query}</Text>
          <Text style={styles.recentSearchCount}>{item.count} stories</Text>
        </View>
        <TouchableOpacity 
          style={styles.recentSearchRemoveButton}
          onPress={() => handleRemoveRecentSearch(item.id)}
        >
          <Ionicons name="close" size={16} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  // Helper function to determine icon for recent search
  const getRecentSearchIcon = (query: string) => {
    if (query.toLowerCase().includes('fantasy') || query.toLowerCase().includes('adventure')) {
      return <Ionicons name="planet-outline" size={16} color="#fff" />;
    } else if (query.toLowerCase().includes('mystery') || query.toLowerCase().includes('novels')) {
      return <Ionicons name="search-outline" size={16} color="#fff" />;
    } else if (query.toLowerCase().includes('romance')) {
      return <Ionicons name="heart-outline" size={16} color="#fff" />;
    } else if (query.toLowerCase().includes('horror') || query.toLowerCase().includes('stories')) {
      return <Ionicons name="skull-outline" size={16} color="#fff" />;
    } else if (query.toLowerCase().includes('science fiction')) {
      return <Ionicons name="rocket-outline" size={16} color="#fff" />;
    } else {
      return <Ionicons name="book-outline" size={16} color="#fff" />;
    }
  };

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
          source={item.image} 
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

  // Render book item in search results
  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => navigateToBookReader(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={item.coverImage}
        style={styles.bookCover}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.bookTags}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.bookTag}>
              <Text style={styles.bookTagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 2 && (
            <Text style={styles.moreTags}>+{item.tags.length - 2} more</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
                onChangeText={handleSearchChange}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchText('');
                  setSearchResults([]);
                }}>
                  <Ionicons name="close-circle" size={18} color="#888" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {/* Search Results */}
          {searchText.length > 0 && (
            <View style={styles.searchResultsContainer}>
              {isSearching ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4a4e82" />
                </View>
              ) : searchResults.length > 0 ? (
                <View>
                  <Text style={styles.searchResultsTitle}>
                    {searchText.startsWith('#') ? 
                      `Trope: "${searchText.substring(1)}" (${searchResults.length})` : 
                      `Search Results (${searchResults.length})`
                    }
                  </Text>
                  <FlatList
                    data={searchResults}
                    renderItem={renderBookItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.searchResultsList}
                    scrollEnabled={false}
                  />
                </View>
              ) : (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={50} color="#ddd" />
                  <Text style={styles.noResultsText}>
                    No results found for "{searchText}"
                  </Text>
                  <Text style={styles.noResultsSubText}>
                    Try different keywords or check for typos
                  </Text>
                </View>
              )}
            </View>
          )}

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
                  data={localRecentSearches}
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

          {/* Category Results Section */}
          {searchText.length === 0 && showCategoryBooks && categoryBooks.length > 0 && (
            <View style={styles.categoryResultsContainer}>
              <View style={styles.categoryResultsHeader}>
                <Text style={styles.categoryResultsTitle}>
                  {selectedCategoryTitle} Books ({categoryBooks.length})
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setSelectedCategory(null);
                    setShowCategoryBooks(false);
                    setCategoryBooks([]);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#4a4e82" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={categoryBooks}
                renderItem={renderBookItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.categoryBooksList}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Rest of the component with categories */}
          {searchText.length === 0 && (
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
                      source={item.image} 
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
          )}
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
          onPress={() => router.replace('/profile')}
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
  // New styles for search results
  searchResultsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  searchResultsTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  searchResultsList: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bookCover: {
    width: 90,
    height: 130,
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  bookDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
    lineHeight: 18,
  },
  bookTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  bookTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  bookTagText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: '#555',
  },
  moreTags: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: '#888',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#555',
    marginTop: 15,
    textAlign: 'center',
  },
  noResultsSubText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  categoryResultsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryResultsTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  categoryBooksList: {
    paddingBottom: 10,
  },
});