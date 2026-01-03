
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';

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
});

export default function WelcomeScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Video
        ref={videoRef}
        source={require('@/assets/videos/intro.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            router.replace('/waitlist/application');
          }
        }}
      />
      <Image
        source={require('@/assets/images/ab20ad44-8729-4a6f-86c6-a7356bbf7036.png')}
        style={styles.logoOverlay}
        resizeMode="contain"
      />
    </View>
  );
}
