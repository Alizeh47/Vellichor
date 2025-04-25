import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  FlatList,
  Image
} from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import Colors from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

interface FunTagProps {
  text: string;
  color: string;
  icon: string;
}

interface TropeCardProps {
  title: string;
  description: string;
  color: string;
  delay?: number;
}

interface TropeItem {
  title: string;
  description: string;
  color: string;
}

interface TagItem {
  text: string;
  color: string;
  icon: string;
}

// Fun tag component
const FunTag = ({ text, color, icon }: FunTagProps) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay: Math.random() * 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay: Math.random() * 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.funTag, 
        { backgroundColor: color, transform: [{ translateY }], opacity }
      ]}
    >
      {icon && <FontAwesome5 name={icon} size={14} color="#fff" style={styles.tagIcon} />}
      <Text style={styles.funTagText}>{text}</Text>
    </Animated.View>
  );
};

// Trope card component
const TropeCard = ({ title, description, color, delay = 0 }: TropeCardProps) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.tropeCard, 
        { backgroundColor: color, transform: [{ scale }], opacity }
      ]}
    >
      <Text style={styles.tropeTitle}>{title}</Text>
      <Text style={styles.tropeDescription}>{description}</Text>
    </Animated.View>
  );
};

export default function TropesScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Birthstone': require('../assets/fonts/Birthstone-Regular.ttf'),
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Fun tags with icons and colors
  const funTags: TagItem[] = [
    { text: 'Main Character Meltdowns', color: '#916F5E', icon: 'heart-broken' },
    { text: 'Angst But Make It Pretty', color: '#25323A', icon: 'band-aid' },
    { text: 'Cursed, Crowned & Complicated', color: '#623D33', icon: 'knife-kitchen' },
    { text: 'Soft Magic & Sharp Morals', color: '#B39285', icon: 'book-dead' },
    { text: 'Armor On, Emotions Off', color: '#C78E65', icon: 'fire' },
    { text: 'Smells Like Vanilla, Feels Like Home', color: '#5C3D2F', icon: 'crown' },
    { text: 'Read This With a Blanket and Tea', color: '#25323A', icon: 'swords' },
    { text: 'Chapters That Feel Like Hugs', color: '#896E51', icon: 'crown' },
    { text: 'Whispers Between Pages', color: '#917E78', icon: 'wolf-pack-battalion' },
    { text: 'Tea-Warmed Soul Reads', color: '#623D33', icon: 'shield-alt' },
    { text: 'Books That Breathe With You', color: '#916F5E', icon: 'hat-wizard' },
    { text: 'Smiles With a Side of Sad', color: '#B8A174', icon: 'magic' },
    { text: 'Still Soft, Still Here', color: '#E0AC80', icon: 'home' },
    { text: 'A Little Bit Lost, A Lot in Love', color: '#C78E65', icon: 'mug-hot' },
    { text: 'Candlelight Reads & Cloudy Thoughts', color: '#948370', icon: 'pepper-hot' },
    { text: 'Moonlit Crowns & Quiet Courage', color: '#B39285', icon: 'map-marker-alt' },
    { text: 'Thrones Made of Longing', color: '#5C3D2F', icon: 'crown' },
    { text: 'Magic in the Margins', color: '#896E51', icon: 'magic' },
    { text: 'Soft Spells & Secret Swords', color: '#25323A', icon: 'swords' },
    { text: 'Heir of Heartache', color: '#916F5E', icon: 'crown' },
    { text: 'Loyalty, Laced in Lavender', color: '#B8A174', icon: 'hat-wizard' },
    { text: 'Waltzing Through Warzones', color: '#623D33', icon: 'shield-alt' },
    { text: 'Ghosts in the Garden of Kings', color: '#917E78', icon: 'wolf-pack-battalion' },
    { text: 'Magic That Knows Your Name', color: '#C78E65', icon: 'fire' },
    { text: 'A Crown Too Heavy for Kindness', color: '#B39285', icon: 'crown' },
  ];

  // Romance tropes
  const romanceTropes: TropeItem[] = [
    { 
      title: 'Enemies to Lovers', 
      description: 'They hate each other... until they don\'t', 
      color: '#916F5E' 
    },
    { 
      title: 'Grumpy x Sunshine', 
      description: 'One\'s a raincloud, the other\'s a ball of light.', 
      color: '#005A74' 
    },
    { 
      title: 'Friends to Lovers', 
      description: 'They\'ve always been there. Maybe too close?', 
      color: '#B39285' 
    },
    { 
      title: 'Forced Proximity', 
      description: 'Trapped in an elevator, fake honeymoon, snowed in... oops.', 
      color: '#2D484A' 
    },
    { 
      title: 'Fake Dating', 
      description: 'This is just for show. Narrator: It wasn\'t.', 
      color: '#C78E65' 
    },
    { 
      title: 'One Bed', 
      description: 'Just one. Bed. What could go wrong?', 
      color: '#736449' 
    },
    { 
      title: 'Second Chance Romance', 
      description: 'Exes with history. And unresolved sparks.', 
      color: '#623D33' 
    },
    { 
      title: 'Secret Royal / Hidden Identity', 
      description: 'Surprise! He\'s a prince / she\'s undercover.', 
      color: '#B8A174' 
    },
    { 
      title: 'Slow Burn', 
      description: 'They take 300 pages to finally kiss, and you love every second.', 
      color: '#415B4A' 
    },
    { 
      title: 'Forbidden Love', 
      description: 'Enemies, rival houses, forbidden by law or fate.', 
      color: '#5F948E' 
    },
    { 
      title: 'Marriage of Convenience', 
      description: 'A logical arrangement turns into unexpected feelings.', 
      color: '#916F5E' 
    },
    { 
      title: 'Age Gap Romance', 
      description: 'Years apart, hearts together. Experience meets enthusiasm.', 
      color: '#BCC1C2' 
    },
    { 
      title: 'Small Town Romance', 
      description: 'Everybody knows your name, your business, and your crush.', 
      color: '#B39285' 
    },
    { 
      title: 'Opposites Attract', 
      description: 'She\'s chaos, he\'s order. Somehow, they work.', 
      color: '#C78E65' 
    },
    { 
      title: 'Love Triangle', 
      description: 'Three hearts, complicated feelings, one final choice.', 
      color: '#5C3D2F' 
    },
  ];

  // Fantasy tropes
  const fantasyTropes: TropeItem[] = [
    { 
      title: 'The Chosen One', 
      description: 'They didn\'t ask for this, but destiny chose them.', 
      color: '#2D484A' 
    },
    { 
      title: 'Found Family', 
      description: 'They started alone, but now they\'d die for each other.', 
      color: '#896E51' 
    },
    { 
      title: 'Magic School / Academy', 
      description: 'Hogwarts, but make it edgy, romantic, and cursed.', 
      color: '#005A74' 
    },
    { 
      title: 'Heir to the Throne', 
      description: 'They\'re next in line… but the crown comes with blood.', 
      color: '#916F5E' 
    },
    { 
      title: 'Quest with a Motley Crew', 
      description: 'A team of misfits on a dangerous journey.', 
      color: '#736449' 
    },
    { 
      title: 'Enemies Forced to Work Together', 
      description: 'Sparks fly while saving the world.', 
      color: '#623D33' 
    },
    { 
      title: 'The Betrayer', 
      description: 'Someone on the inside will turn — you just don\'t know who.', 
      color: '#415B4A' 
    },
    { 
      title: 'Beast & Beauty', 
      description: 'A monstrous curse, and someone brave enough to love through it.', 
      color: '#C78E65' 
    },
    { 
      title: 'Time Travel or Parallel Worlds', 
      description: 'Past, future, or somewhere that doesn\'t follow time at all.', 
      color: '#5F948E' 
    },
    { 
      title: 'Mysterious Powers Awaken', 
      description: 'Wait... what just happened to me?', 
      color: '#B39285' 
    },
    { 
      title: 'Hidden World', 
      description: 'A secret magical realm exists alongside our own.', 
      color: '#BCC1C2' 
    },
    { 
      title: 'Ancient Prophecy', 
      description: 'Written centuries ago, coming true today.', 
      color: '#B8A174' 
    },
    { 
      title: 'Magical Artifact', 
      description: 'The key to everything is this mysterious object of power.', 
      color: '#896E51' 
    },
    { 
      title: 'Tournament Arc', 
      description: 'Competitors gather to prove their worth. Stakes are life or death.', 
      color: '#5C3D2F' 
    },
    { 
      title: 'Dragons & Their Riders', 
      description: 'A bond beyond species, a partnership of sky and earth.', 
      color: '#623D33' 
    },
  ];

  // Dark tropes
  const darkTropes: TropeItem[] = [
    { 
      title: 'Morally Grey Love Interest', 
      description: 'He\'s dangerous. He\'s hot. He\'s... questionable.', 
      color: '#2D484A' 
    },
    { 
      title: 'Tragic Backstory', 
      description: 'Trauma that shapes every move they make.', 
      color: '#5C3D2F' 
    },
    { 
      title: 'Lovers on Opposite Sides of a War', 
      description: 'Their love might cost them everything.', 
      color: '#623D33' 
    },
    { 
      title: 'Possessive Protector', 
      description: 'I\'ll destroy the world before I let them hurt you.', 
      color: '#005A74' 
    },
    { 
      title: 'Redemption Arc', 
      description: 'The villain... wants to be better. Maybe.', 
      color: '#736449' 
    },
    { 
      title: 'Unreliable Narrator', 
      description: 'Can you trust what they\'re telling you? Spoiler: no.', 
      color: '#415B4A' 
    },
    { 
      title: 'Gothic Mansion', 
      description: 'Old house, older secrets. Something watches from the shadows.', 
      color: '#5C3D2F' 
    },
    { 
      title: 'Descent Into Madness', 
      description: 'Sanity slips away, one page at a time.', 
      color: '#5F948E' 
    },
    { 
      title: 'Secret Society', 
      description: 'Behind closed doors, the elite practice forbidden rituals.', 
      color: '#BCC1C2' 
    },
    { 
      title: 'Psychological Horror', 
      description: 'The worst monsters live inside your mind.', 
      color: '#623D33' 
    },
  ];

  // Psychological / Literary Depth tropes
  const psychologicalTropes: TropeItem[] = [
    { 
      title: 'The Weight of Unspoken Generational Trauma', 
      description: 'The pain that passes silently between generations.', 
      color: '#2D484A' 
    },
    { 
      title: 'Estranged Parent, Absent Closure', 
      description: 'When reconciliation is impossible, but the wound remains.', 
      color: '#623D33' 
    },
    { 
      title: 'The Quiet Breakdown of a Once Strong Mind', 
      description: 'Watching someone slowly lose themselves to time or illness.', 
      color: '#5F948E' 
    },
    { 
      title: 'Loving Someone Through Their Self-Destruction', 
      description: 'When your love isn\'t enough to save them.', 
      color: '#005A74' 
    },
    { 
      title: 'Healing Isn\'t Linear (and Sometimes You Don\'t)', 
      description: 'The messy, non-Instagram-worthy truth about trauma recovery.', 
      color: '#B39285' 
    },
    { 
      title: 'Mourning Someone Who\'s Still Alive', 
      description: 'The grief of loving someone who\'s changed beyond recognition.', 
      color: '#736449' 
    },
    { 
      title: 'Being the Caretaker When You\'re Breaking Too', 
      description: 'The invisible burden of those who care for others.', 
      color: '#B8A174' 
    },
    { 
      title: 'The Guilt of Survival', 
      description: 'Living with the question of why you made it when others didn\'t.', 
      color: '#415B4A' 
    },
    { 
      title: 'Loneliness Inside a Marriage', 
      description: 'The quiet devastation of emotional disconnection.', 
      color: '#C78E65' 
    },
    { 
      title: 'The Cost of Silence in a Loud World', 
      description: 'What happens when truth remains unspoken for too long.', 
      color: '#BCC1C2' 
    },
  ];

  // Real-World Parallels / Non-Fiction Tone tropes
  const realWorldTropes: TropeItem[] = [
    { 
      title: 'The Myth of the Strong Woman', 
      description: 'Emotional labor, burnout, and the price of resilience.', 
      color: '#2D484A' 
    },
    { 
      title: 'Navigating Identity in a World That Won\'t See You', 
      description: 'The struggle of self when others impose their perceptions.', 
      color: '#5C3D2F' 
    },
    { 
      title: 'Coming of Age in a Time of Collapse', 
      description: 'Growing up when the future feels increasingly uncertain.', 
      color: '#415B4A' 
    },
    { 
      title: 'Faith in the Face of Hypocrisy', 
      description: 'Holding onto belief when institutions fail their values.', 
      color: '#005A74' 
    },
    { 
      title: 'The Unseen Lives of Caregivers', 
      description: 'The invisible work that holds communities together.', 
      color: '#736449' 
    },
    { 
      title: 'How Grief Changes Language', 
      description: 'When words fail to capture the depth of loss.', 
      color: '#5F948E' 
    },
    { 
      title: 'Women Who Are "Too Much" and "Not Enough"', 
      description: 'The impossible standards and contradictory expectations.', 
      color: '#B8A174' 
    },
    { 
      title: 'Breaking Family Patterns', 
      description: 'Ending cycles you were never meant to carry.', 
      color: '#B39285' 
    },
    { 
      title: 'Learning to Live Without a Map', 
      description: 'Finding your way when traditional paths disappear.', 
      color: '#BCC1C2' 
    },
    { 
      title: 'Making Peace with the Person You Were at 19', 
      description: 'Reconciling your past self with who you\'ve become.', 
      color: '#C78E65' 
    },
  ];

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]);

  const handleBackPress = () => {
    router.back();
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderTropeItem = ({ item, index }: { item: TropeItem; index: number }) => (
    <TropeCard 
      title={item.title} 
      description={item.description} 
      color={item.color} 
      delay={index * 100}
    />
  );

  return (
    <View style={styles.container}>
      <BackgroundImage />
      
      <View style={styles.topButtonContainer}>
        <TouchableOpacity 
          style={styles.topBackButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#5C3D2F" />
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim, marginTop: 20 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              Discover Tropes with{' '}
              <Text style={styles.vellichorText}>Vellichor</Text>
            </Text>
          </View>
          
          {/* Fun tags */}
          <View style={styles.tagsContainer}>
            {funTags.map((tag, index) => (
              <FunTag 
                key={index} 
                text={tag.text} 
                color={tag.color} 
                icon={tag.icon}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={24} color="#916F5E" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Romance Tropes</Text>
            <Text style={styles.sectionSubtitle}>(BookTok Favorites)</Text>
          </View>
          
          <FlatList
            data={romanceTropes}
            renderItem={renderTropeItem}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tropesList}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={24} color="#B8A174" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Fantasy / Adventure Tropes</Text>
          </View>
          
          <FlatList
            data={fantasyTropes}
            renderItem={renderTropeItem}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tropesList}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="moon" size={24} color="#25323A" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Dark / Emotional Tropes</Text>
          </View>
          
          <FlatList
            data={darkTropes}
            renderItem={renderTropeItem}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tropesList}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={24} color="#5C3D2F" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Psychological / Literary Depth</Text>
          </View>
          
          <FlatList
            data={psychologicalTropes}
            renderItem={renderTropeItem}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tropesList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe" size={24} color="#B8A174" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Real-World Parallels</Text>
          </View>
          
          <FlatList
            data={realWorldTropes}
            renderItem={renderTropeItem}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tropesList}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Find your next favorite story</Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.buttonText}>Discover the Vellichor Experience</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 10,
    backgroundColor: 'rgba(249, 231, 176, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0AC80',
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
  headerTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    color: '#5C3D2F',
    marginLeft: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    marginTop: 90,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  titleText: {
    fontFamily: 'SpaceMono',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C3D2F',
    textAlign: 'center',
  },
  vellichorText: {
    fontFamily: 'Birthstone',
    fontSize: 62,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#5C3D2F',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  funTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tagIcon: {
    marginRight: 6,
  },
  funTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C3D2F',
  },
  sectionSubtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#917E78',
    marginLeft: 5,
    alignSelf: 'flex-end',
  },
  tropesList: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingRight: 20,
  },
  tropeCard: {
    width: 250,
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tropeTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tropeDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  footerText: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    color: '#5C3D2F',
    marginBottom: 20,
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: '#2D484A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: '600',
  },
  topButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
  },
}); 