
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    width: 120,
    height: 120,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});

export default function WelcomeScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (isLoading) {
        setIsLoading(false);
      }
      if (status.didJustFinish) {
        console.log('Video finished, navigating to application');
        router.replace('/waitlist/application');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Using a stock video URL from Pexels - couple on a date in NYC evening */}
      <Video
        ref={videoRef}
        source={{ uri: 'https://videos.pexels.com/video-files/5473821/5473821-uhd_2560_1440_25fps.mp4' }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error) => {
          console.error('Video error:', error);
          // If video fails to load, navigate after 3 seconds
          setTimeout(() => {
            router.replace('/waitlist/application');
          }, 3000);
        }}
      />
      
      {/* Logo Overlay */}
      <Image
        source={require('@/assets/images/ab20ad44-8729-4a6f-86c6-a7356bbf7036.png')}
        style={styles.logoOverlay}
        resizeMode="contain"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Preparing your experience...</Text>
        </View>
      )}
    </View>
  );
}
