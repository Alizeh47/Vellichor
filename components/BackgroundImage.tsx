import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Platform } from 'react-native';
import Colors from '../constants/Colors';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Background image path
const BACKGROUND_IMAGE = require('../assets/images/backgrounds/bg_readium.jpg');

export default function BackgroundImage() {
  // Calculate image dimensions to ensure bottom is prioritized
  const [imageSize, setImageSize] = useState({ width: width, height: height * 1.2 });
  
  useEffect(() => {
    // For Image.getSize, we need to use a URI string format
    // First, set default dimensions in case we can't get the image size
    setImageSize({ width: width, height: height * 1.2 });
    
    // Skip the getSize call which is causing the error
    // This will use our default dimensions
  }, []);

  return (
    <View style={styles.container}>
      {/* Using Image instead of ImageBackground for more control */}
      <Image 
        source={BACKGROUND_IMAGE}
        style={[
          styles.backgroundImage,
          {
            width: imageSize.width,
            height: imageSize.height,
          }
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    zIndex: -1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0, // Anchor to bottom
    left: 0,
    right: 0,
  }
}); 