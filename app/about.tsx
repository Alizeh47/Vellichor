import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
} from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

// Clickable tag component similar to FunTag in tropes.tsx
const ClickableTag = ({ text, backgroundColor, smallText = false }: { text: string, backgroundColor: string, smallText?: boolean }) => {
  const handleTagPress = async () => {
    try {
      // Save the tag text as the search query
      await AsyncStorage.setItem('search_query', text);
      // Navigate to browse screen
      router.push('/browse');
    } catch (error) {
      console.error('Failed to save search query:', error);
      router.push('/browse');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleTagPress}
      activeOpacity={0.7}
    >
      <View style={[styles.tag, { backgroundColor }]}>
        <Text style={[styles.tagText, smallText && { fontSize: 10 }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AboutScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]);

  // Check if user has chosen to skip this page
  useEffect(() => {
    const checkSkipPreference = async () => {
      try {
        const skipAboutPage = await AsyncStorage.getItem('skip_about_page');
        if (skipAboutPage === 'true') {
          // If user has chosen to always skip, redirect to reading
          router.replace('/reading');
        }
      } catch (error) {
        console.error('Failed to check preference:', error);
      }
    };
    
    checkSkipPreference();
  }, []);

  const handleClosePress = () => {
    setModalVisible(true);
  };

  const handleCloseOnce = () => {
    setModalVisible(false);
    router.replace('/reading');
  };

  const handleCloseAlways = async () => {
    try {
      // Save user preference to never show about page again
      await AsyncStorage.setItem('skip_about_page', 'true');
      setModalVisible(false);
      router.replace('/reading');
    } catch (error) {
      console.error('Failed to save preference:', error);
      router.replace('/reading');
    }
  };

  // Emotional Bookshelf tags
  const emotionalBookshelfTags = ['Soft Ache', 'Made Me Spiral', 'Felt Like Magic', 'Left Me Empty', 'Healed Something in Me'];
  
  // Moodboard Theme tags
  const moodboardThemeTags = ['Feral Fantasy', 'Candlelight Academia', 'Wholesome Pain', 'Kingdomcore', 'Liminal Romance'];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BackgroundImage />
      
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClosePress}
      >
        <Ionicons name="close" size={24} color="#5C3D2F" />
      </TouchableOpacity>

      {/* Close Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Skip About Page?</Text>
            <Text style={styles.modalText}>Would you like to skip this page now or always?</Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleCloseOnce}
            >
              <Text style={styles.modalButtonText}>Skip Once</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonAlways]}
              onPress={handleCloseAlways}
            >
              <Text style={styles.modalButtonText}>Always Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.vellichorLogo}>Vellichor</Text>
          <Text style={styles.subtitle}>— that word already carries so much magic:</Text>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"the strange wistfulness of used bookstores."</Text>
        </View>

        <Text style={styles.introText}>
          It's moody. It's nostalgic. It's for people who fall in love with pages and get lost in spines.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Description</Text>
          <Text style={styles.sectionSubtitle}>(Short Version for Stores)</Text>
          <Text style={styles.paragraph}>
            Vellichor is more than a reading tracker — it's a quiet corner for lovers of poetic fiction, 
            emotional reads, and soul-marking stories. Curate your personal library, track your reading moods, 
            and connect with others who've been wrecked (respectfully) by the same books.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is Vellichor?</Text>
          <Text style={styles.paragraph}>
            Vellichor is a sanctuary for reflective readers — those who find themselves lingering on sentences, 
            rereading passages that ache, and collecting stories that leave quiet echoes in the heart.
          </Text>
          <Text style={styles.paragraph}>
            Inspired by the wistfulness of secondhand bookstores, Vellichor blends aesthetic minimalism with emotional depth. 
            This is more than a reading app — it's a moodboard, memory keeper, and kindred community built for those who are moved by words.
          </Text>
          <Text style={styles.paragraph}>
            Whether you highlight pages at 2 a.m. with tears in your eyes or assign songs to characters no one else knows, 
            Vellichor sees you — and gives you the space to read, feel, and remember.
          </Text>
        </View>

        <View style={styles.featureSection}>
          <View style={styles.featureTitleContainer}>
            <Ionicons name="library" size={26} color="#005A74" style={styles.iconTitle} />
            <Text style={styles.featureTitle}>Core Features</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Emotional Bookshelves</Text>
            </View>
            <Text style={styles.featureText}>
              Organize your personal library not by genre, but by emotional resonance. Create custom categories like:
            </Text>
            <View style={styles.tagContainer}>
              {emotionalBookshelfTags.map((tag, index) => (
                <ClickableTag 
                  key={index} 
                  text={tag} 
                  backgroundColor={getTagColor(index)} 
                />
              ))}
            </View>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Feather name="edit-3" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Mood & Memory Tagging</Text>
            </View>
            <Text style={styles.featureText}>
              Track the emotional journey of every read. Add reflective notes like:
            </Text>
            <View style={styles.quoteList}>
              <Text style={styles.quoteItem}>"Felt like a rainy Sunday."</Text>
              <Text style={styles.quoteItem}>"Still grieving chapter seventeen."</Text>
              <Text style={styles.quoteItem}>"That goodbye shattered me."</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="moon-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Aesthetic Reading Logs</Text>
            </View>
            <Text style={styles.featureText}>
              Choose from elegant themes — parchment, candlelight, dusk mode — to reflect the vibe of your inner world. 
              Thoughtfully designed for emotional clarity and calming use.
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="images-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Visual Library Builder</Text>
            </View>
            <Text style={styles.featureText}>
              Bridge your physical and digital shelves. Upload snapshots of your book collection and 
              annotate them with quotes, memories, or feelings attached to each spine.
            </Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Kindred Reader Network</Text>
            </View>
            <Text style={styles.featureText}>
              Join a gentle, curated community space where readers connect through shared heartbreaks, 
              tender tropes, and transformative stories.
            </Text>
            <Text style={styles.dialogueText}>"You felt it too?" "Yes. Exactly that."</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="timeline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Philosophy of Reading Timeline</Text>
            </View>
            <Text style={styles.featureText}>
              A beautifully mapped archive of how your reading journey — and your inner world — have evolved over time. 
              Month by month, feeling by feeling.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.featureTitleContainer}>
            <Ionicons name="person" size={24} color="#2D484A" style={styles.iconTitle} />
            <Text style={styles.sectionTitle}>Who Is Vellichor For?</Text>
          </View>
          <Text style={styles.paragraph}>
            For the quiet reader who mourns fictional deaths like real ones.
          </Text>
          <Text style={styles.paragraph}>
            For the romantic who finds home in fantasy realms.
          </Text>
          <Text style={styles.paragraph}>
            For those who annotate margins with poetry, and carry quotes like prayers.
          </Text>
          <Text style={styles.paragraph}>
            If stories shape the way you see yourself, others, and the world — Vellichor is your space to breathe, reflect, and feel seen.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.featureTitleContainer}>
            <Ionicons name="star" size={24} color="#2D484A" style={styles.iconTitle} />
            <Text style={styles.sectionTitle}>Future Features</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="color-palette-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Moodboard Themes</Text>
            </View>
            <Text style={styles.featureText}>
              Choose from emotionally-charged aesthetics like:
            </Text>
            <View style={styles.tagContainer}>
              {moodboardThemeTags.map((tag, index) => (
                <ClickableTag 
                  key={index} 
                  text={tag} 
                  backgroundColor={getTagColor(index + 5)} 
                  smallText={true}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="search" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Emotional Discovery Engine</Text>
            </View>
            <Text style={styles.featureText}>
              Find books not by plot or author, but by what they leave behind:
            </Text>
            <View style={styles.quoteList}>
              <Text style={styles.quoteItem}>"Books that feel like goodbye."</Text>
              <Text style={styles.quoteItem}>"Stories that forgave me."</Text>
              <Text style={styles.quoteItem}>"Reads that opened old wounds gently."</Text>
            </View>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureHeaderContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="bookmark-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.featureSubtitle}>Quote Vault</Text>
            </View>
            <Text style={styles.featureText}>
              Save and savor every line that moved you. Create galleries of soul-striking sentences that felt written just for you.
            </Text>
          </View>
        </View>

        <View style={styles.finalSection}>
          <View style={styles.featureTitleContainer}>
            <Feather name="feather" size={24} color="#2D484A" style={styles.iconTitle} />
            <Text style={styles.finalTitle}>Final Note</Text>
          </View>
          <Text style={styles.finalText}>Vellichor is not a product — it's a feeling.</Text>
          <Text style={styles.finalText}>For those who fall in love with ink,</Text>
          <Text style={styles.finalText}>Who mourn in silence,</Text>
          <Text style={styles.finalText}>Who read to remember and reread to heal —</Text>
          <Text style={styles.finalText}>Vellichor is for you.</Text>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/reading')}
        >
          <Text style={styles.buttonText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

function getTagColor(index: number): string {
  const colors = [
    '#916F5E', '#2D484A', '#5C3D2F', '#005A74', '#736449', 
    '#B39285', '#5F948E', '#C78E65', '#BCC1C2', '#623D33', '#415B4A'
  ];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
    paddingTop: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  vellichorLogo: {
    fontFamily: 'Birthstone',
    fontSize: 72,
    color: '#5C3D2F',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#623D33',
    marginTop: 10,
    textAlign: 'center',
  },
  quoteContainer: {
    marginVertical: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: 'SpaceMono',
    fontStyle: 'italic',
    fontSize: 22,
    color: '#2D484A',
    textAlign: 'center',
    lineHeight: 32,
  },
  introText: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    lineHeight: 26,
    color: '#5C3D2F',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Birthstone',
    fontSize: 36,
    color: '#2D484A',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#736449',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  paragraph: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    lineHeight: 26,
    color: '#5C3D2F',
    marginBottom: 20,
  },
  featureSection: {
    marginBottom: 40,
  },
  featureTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconTitle: {
    marginRight: 10,
  },
  featureTitle: {
    fontFamily: 'Birthstone',
    fontSize: 32,
    color: '#005A74',
    marginBottom: 20,
  },
  featureHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5C3D2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  feature: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
  },
  featureSubtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C3D2F',
  },
  featureText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    lineHeight: 24,
    color: '#623D33',
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tagText: {
    color: '#fff',
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '500',
  },
  quoteList: {
    marginTop: 10,
    marginLeft: 15,
  },
  quoteItem: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#5F948E',
    marginBottom: 15,
    lineHeight: 24,
  },
  dialogueText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#5F948E',
    textAlign: 'center',
    marginTop: 15,
  },
  finalSection: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(45, 72, 74, 0.15)',
    borderRadius: 20,
  },
  finalTitle: {
    fontFamily: 'Birthstone',
    fontSize: 32,
    color: '#2D484A',
    marginBottom: 20,
  },
  finalText: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#5C3D2F',
    lineHeight: 32,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#2D484A',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 30,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Birthstone',
    fontSize: 28,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Birthstone',
    fontSize: 32,
    color: '#2D484A',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#5C3D2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2D484A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonAlways: {
    backgroundColor: '#623D33',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5C3D2F',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  modalButtonCancelText: {
    color: '#5C3D2F',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
}); 