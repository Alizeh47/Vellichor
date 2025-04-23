import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

export default function BackgroundImage() {
  // Calculate image dimensions to ensure bottom is prioritized
  const [imageSize, setImageSize] = useState({ width: width, height: height * 1.2 });
  
  useEffect(() => {
    // Get the actual image dimensions to calculate proper scaling
    Image.getSize(
      require('../assets/images/backgrounds/bg_readium.jpg'), 
      (imgWidth, imgHeight) => {
        // Calculate the aspect ratio
        const imageAspectRatio = imgWidth / imgHeight;
        
        // Calculate the best fit height to ensure width is covered
        // while prioritizing the bottom part
        const calculatedHeight = width / imageAspectRatio;
        
        // Use a height that's higher than needed to ensure bottom is visible
        // and top gets cropped if needed
        setImageSize({ 
          width: width, 
          height: Math.max(calculatedHeight, height) 
        });
      },
      () => {
        // Fallback if image info can't be retrieved
        setImageSize({ width: width, height: height * 1.2 });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Using Image instead of ImageBackground for more control */}
      <Image 
        source={require('../assets/images/backgrounds/bg_readium.jpg')}
        style={[
          styles.backgroundImage,
          {
            width: imageSize.width,
            height: imageSize.height,
          }
        ]}
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