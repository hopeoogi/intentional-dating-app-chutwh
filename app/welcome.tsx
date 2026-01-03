
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BACKEND_URL } from '@/utils/api';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Welcome] Requesting AI-generated video from backend...');
      
      // Call the backend video generation endpoint
      const response = await fetch(`${BACKEND_URL}/api/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A young couple on a romantic evening date in New York City, cinematic lighting, warm atmosphere, evening ambiance, professional cinematography',
          duration: 3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const data = await response.json();
      console.log('[Welcome] Video generation response:', data);
      
      // If video is still processing, poll for status
      if (data.status === 'processing' && data.videoId) {
        console.log('[Welcome] Video is processing, polling for status...');
        await pollVideoStatus(data.videoId);
      } else if (data.url) {
        // Video is ready immediately
        setVideoUrl(data.url);
        setLoading(false);

        // Auto-advance after video plays (3 seconds + 500ms buffer)
        setTimeout(() => {
          router.replace('/waitlist/application');
        }, 3500);
      } else {
        throw new Error('Invalid response from video generation endpoint');
      }
    } catch (err: any) {
      console.error('[Welcome] Error loading video:', err);
      setError(err.message || 'Failed to load video');
      setLoading(false);
      
      // Still advance to application after 3 seconds even if video fails
      // This ensures users aren't stuck on the welcome screen
      setTimeout(() => {
        router.replace('/waitlist/application');
      }, 3000);
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    const maxAttempts = 30; // Poll for up to 30 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        console.log(`[Welcome] Polling video status (attempt ${attempts}/${maxAttempts})...`);
        
        const response = await fetch(`${BACKEND_URL}/api/video/status/${videoId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check video status');
        }

        const data = await response.json();
        console.log('[Welcome] Video status:', data);

        if (data.status === 'completed' && data.url) {
          // Video is ready
          setVideoUrl(data.url);
          setLoading(false);

          // Auto-advance after video plays
          setTimeout(() => {
            router.replace('/waitlist/application');
          }, 3500);
        } else if (data.status === 'failed') {
          throw new Error('Video generation failed');
        } else if (attempts < maxAttempts) {
          // Still processing, poll again in 1 second
          setTimeout(poll, 1000);
        } else {
          // Timeout - give up and show fallback
          throw new Error('Video generation timed out');
        }
      } catch (err: any) {
        console.error('[Welcome] Error polling video status:', err);
        setError(err.message || 'Failed to load video');
        setLoading(false);
        
        // Advance to application even on error
        setTimeout(() => {
          router.replace('/waitlist/application');
        }, 3000);
      }
    };

    poll();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Creating your experience...</Text>
      </View>
    );
  }

  if (error || !videoUrl) {
    // Fallback: Show a simple loading screen if video fails
    // User will still be redirected to application after timeout
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.fallbackContent}>
          <Text style={styles.appName}>Intentional</Text>
          <Text style={styles.tagline}>Meaningful connections start here</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        isMuted
        onError={(error) => {
          console.error('Video playback error:', error);
          setError('Video playback failed');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width,
    height,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  fallbackContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: 2,
    marginBottom: 16,
  },
  tagline: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
