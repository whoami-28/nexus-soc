// src/screens/NotificationsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { useDatabase } from '../context/DatabaseContext';
import {
  getNotifications,
  markNotificationsAsRead,
} from '../database/notificationsRepository';
import { NotificationItem } from '../types';
import { getAvatarSource } from '../utils/assets';
import { BellIcon, SparkleIcon, ThumbsUpIcon, ChatBubbleIcon } from '../components/SvgIcons';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenPost?: (postId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  onOpenPost,
}) => {
  const { currentUser, refreshCurrentUser } = useDatabase();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifs = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const items = await getNotifications(currentUser.id);
      setNotifications(items);
    } catch (err) {
      console.error('[NotificationsModal] Ошибка загрузки:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadNotifs();
    }
  }, [visible, currentUser]);

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    try {
      await markNotificationsAsRead(currentUser.id);
      await refreshCurrentUser();
      await loadNotifs();
    } catch (err) {
      console.error('[NotificationsModal] Ошибка:', err);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'upvote':
        return <ThumbsUpIcon size={12} color={colors.mint} />;
      case 'comment':
        return <ChatBubbleIcon size={12} color={colors.purpleLight} />;
      case 'bounty':
        return <SparkleIcon size={12} color={colors.mint} />;
      default:
        return <BellIcon size={12} color={colors.mint} />;
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <BellIcon size={16} color={colors.mint} />
              <Text style={styles.headerTitle}>СЕТЕВЫЕ УВЕДОМЛЕНИЯ</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleMarkAllRead} style={styles.readAllBtn}>
                <Text style={styles.readAllText}>Прочитать все</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color={colors.mint} />
            </View>
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>Уведомлений пока нет</Text>
                </View>
              ) : (
                notifications.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemCard, !item.is_read && styles.itemUnread]}
                    activeOpacity={item.target_post_id ? 0.7 : 1}
                    onPress={() => {
                      if (item.target_post_id && onOpenPost) {
                        onClose();
                        onOpenPost(item.target_post_id);
                      }
                    }}
                  >
                    <View style={styles.avatarBox}>
                      <Image
                        source={getAvatarSource(item.actor?.avatar_key)}
                        style={styles.avatarImg}
                      />
                      <View style={styles.typeBadge}>{renderIcon(item.type)}</View>
                    </View>

                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemBody}>{item.body}</Text>
                    </View>

                    {!item.is_read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))
              )}
              <View style={{ height: 16 }} />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sheetContainer: {
    backgroundColor: '#12141D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.25)',
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.mint,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  readAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  readAllText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  loaderBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 12,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#161924',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  itemUnread: {
    borderColor: 'rgba(0, 245, 160, 0.3)',
    backgroundColor: '#181C2A',
  },
  avatarBox: {
    position: 'relative',
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#202330',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F1015',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textWhite,
    marginBottom: 2,
  },
  itemBody: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
});
