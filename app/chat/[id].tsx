
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  photo: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadConversation();
  }, [id]);

  // Reload messages when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadConversation(true);
      
      // Poll for new messages every 5 seconds while chat is active (without loading state)
      const interval = setInterval(() => {
        loadConversation(false);
      }, 5000);
      
      return () => clearInterval(interval);
    }, [id])
  );

  const loadConversation = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const { authenticatedGet } = await import('@/utils/api');
      
      const data = await authenticatedGet<{
        messages: Message[];
        otherUser: ChatUser;
      }>(`/api/conversations/${id}/messages`);
      
      console.log('[Chat] Loaded conversation:', data);
      setMessages(data.messages || []);
      setOtherUser(data.otherUser || null);
    } catch (error) {
      console.error('[Chat] Failed to load conversation:', error);
      if (messages.length === 0) {
        setMessages([]);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleSend = async () => {
    if (inputText.trim().length === 0) return;

    const messageText = inputText.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'me',
      text: messageText,
      timestamp: 'Just now',
      read: false,
    };

    // Optimistically add message to UI
    setMessages([...messages, newMessage]);
    setInputText('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const { authenticatedPost } = await import('@/utils/api');
      
      await authenticatedPost(`/api/conversations/${id}/message`, {
        text: messageText
      });
      
      console.log('[Chat] Message sent successfully');
    } catch (error) {
      console.error('[Chat] Failed to send message:', error);
      // TODO: Show error toast or retry option
    }
  };

  const handleEndConversation = async () => {
    try {
      const { authenticatedPost } = await import('@/utils/api');
      
      await authenticatedPost(`/api/conversations/${id}/end`, {});
      console.log('[Chat] Conversation ended');
      router.back();
    } catch (error) {
      console.error('[Chat] Failed to end conversation:', error);
      // Still navigate back even if API call fails
      router.back();
    }
  };

  const handleSnooze = async () => {
    try {
      const { authenticatedPost } = await import('@/utils/api');
      
      await authenticatedPost(`/api/conversations/${id}/snooze`, {});
      console.log('[Chat] Conversation snoozed');
      router.back();
    } catch (error) {
      console.error('[Chat] Failed to snooze conversation:', error);
      // Still navigate back even if API call fails
      router.back();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id || item.senderId === 'me';
    
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        {!isMe && (
          <Image source={{ uri: otherUser?.photo }} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          <Text style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: otherUser?.name || 'Chat',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleSnooze} style={styles.headerButton}>
                <IconSymbol
                  ios_icon_name="moon.fill"
                  android_material_icon_name="notifications-off"
                  size={22}
                  color={colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEndConversation} style={styles.headerButton}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={22}
                  color={colors.error}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <IconSymbol
                ios_icon_name="arrow.up.circle.fill"
                android_material_icon_name="send"
                size={32}
                color={inputText.trim() ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  myMessageText: {
    color: colors.background,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(0,0,0,0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
