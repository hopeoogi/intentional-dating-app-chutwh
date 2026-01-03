
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  matchId: string;
  otherUser: {
    id: string;
    name: string;
    age: number;
    photo: string;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  requiresAction: boolean; // User needs to reply, end, or snooze
  status: 'active' | 'snoozed' | 'ended';
}

export default function ConversationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingActionsCount, setPendingActionsCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadConversations();
      loadPendingActions();
    }
  }, [user]);

  // Reload conversations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadConversations();
        loadPendingActions();
      }
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadConversations(), loadPendingActions()]);
    setRefreshing(false);
  };

  const loadPendingActions = async () => {
    try {
      const { authenticatedGet } = await import('@/utils/api');
      
      const data = await authenticatedGet<{ count: number }>('/api/conversations/pending-actions');
      console.log('[Conversations] Pending actions:', data);
      setPendingActionsCount(data.count || 0);
    } catch (error) {
      console.error('[Conversations] Failed to load pending actions:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { authenticatedGet } = await import('@/utils/api');
      
      const data = await authenticatedGet<{ conversations: Conversation[] }>('/api/conversations');
      console.log('[Conversations] Loaded conversations:', data);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('[Conversations] Failed to load conversations:', error);
      // Show empty state on error
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.otherUser.photo }} style={styles.avatar} />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.name}>
            {item.otherUser.name}, {item.otherUser.age}
          </Text>
          {item.lastMessageTime && (
            <Text style={styles.time}>{item.lastMessageTime}</Text>
          )}
        </View>
        
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        )}
        
        {item.requiresAction && (
          <View style={styles.actionRequired}>
            <IconSymbol
              ios_icon_name="exclamationmark.circle.fill"
              android_material_icon_name="error"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.actionText}>Action required</Text>
          </View>
        )}
      </View>
      
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
      
      <IconSymbol
        ios_icon_name="chevron.right"
        android_material_icon_name="arrow-forward"
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol
        ios_icon_name="message.fill"
        android_material_icon_name="chat"
        size={64}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>No Conversations Yet</Text>
      <Text style={styles.emptyText}>
        Start a conversation with your matches to connect
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        {pendingActionsCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>
              {pendingActionsCount} action{pendingActionsCount > 1 ? 's' : ''} needed
            </Text>
          </View>
        )}
      </View>
      
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  pendingBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  pendingBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.background,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  actionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  actionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
