
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'https://erm5magsz6azuge4mtdkxhsmzj7uqr45.app.specular.dev';

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
      console.log('[Welcome] Starting video generation...');
      console.log('[Welcome] Backend URL:', BACKEND_URL);
      
      // Generate video
      const generateResponse = await fetch(`${BACKEND_URL}/api/video/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A young couple on a romantic date in the evening in New York City, cinematic, warm lighting, urban background'
        })
      });

      console.log('[Welcome] Generate response status:', generateResponse.status);

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error('[Welcome] Generate error:', errorText);
        throw new Error(`Video generation failed: ${generateResponse.status}`);
      }

      const generateData = await generateResponse.json();
      console.log('[Welcome] Generate response:', generateData);
      
      const videoId = generateData.videoId || generateData.id;
      
      if (!videoId) {
        throw new Error('No video ID returned from server');
      }

      console.log('[Welcome] Video ID:', videoId);

      // Poll for video status
      await pollVideoStatus(videoId);
    } catch (err) {
      console.error('[Welcome] Error loading video:', err);
      setError(err instanceof Error ? err.message : 'Failed to load video');
      setLoading(false);
      // Skip to application after 3 seconds on error
      setTimeout(() => {
        console.log('[Welcome] Navigating to application due to error');
        router.replace('/waitlist/application');
      }, 3000);
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    const maxAttempts = 60; // 60 attempts = 1 minute
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        console.log(`[Welcome] Polling video status (attempt ${attempts + 1}/${maxAttempts})...`);
        
        const response = await fetch(`${BACKEND_URL}/api/video/status/${videoId}`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log('[Welcome] Status response:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Welcome] Status error:', errorText);
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('[Welcome] Video status:', data.status, data);

        if (data.status === 'completed' && data.url) {
          console.log('[Welcome] Video ready:', data.url);
          setVideoUrl(data.url);
          setLoading(false);
          return;
        }

        if (data.status === 'failed') {
          throw new Error('Video generation failed on server');
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(() => poll(), 2000); // Poll every 2 seconds
        } else {
          throw new Error('Video generation timeout - taking too long');
        }
      } catch (err) {
        console.error('[Welcome] Polling error:', err);
        setError(err instanceof Error ? err.message : 'Failed to check video status');
        setLoading(false);
        setTimeout(() => {
          console.log('[Welcome] Navigating to application due to polling error');
          router.replace('/waitlist/application');
        }, 2000);
      }
    };

    poll();
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log('[Welcome] Video playback status:', {
        isPlaying: status.isPlaying,
        didJustFinish: status.didJustFinish,
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis,
      });
      
      if (status.didJustFinish) {
        console.log('[Welcome] Video finished, navigating to application');
        router.replace('/waitlist/application');
      }
    } else {
      console.log('[Welcome] Video not loaded:', status);
    }
  };

  const handleVideoError = (error: string) => {
    console.error('[Welcome] Video playback error:', error);
    setError('Video playback failed');
    setTimeout(() => {
      console.log('[Welcome] Navigating to application due to playback error');
      router.replace('/waitlist/application');
    }, 2000);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.errorText}>Loading your experience...</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        <Text style={styles.skipText}>Continuing to application...</Text>
      </View>
    );
  }

  if (loading || !videoUrl) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Preparing your experience...</Text>
        <Text style={styles.loadingSubtext}>Generating welcome video</Text>
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
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={handleVideoError}
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
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  skipText: {
    color: '#666',
    fontSize: 12,
    marginTop: 20,
  },
});
