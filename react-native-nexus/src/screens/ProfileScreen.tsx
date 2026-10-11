// src/screens/ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  VerifiedBadge,
  EditPencilIcon,
  SettingsGearIcon,
  SparkleIcon,
  MoreDotsIcon,
  ThumbsUpIcon,
  ChatBubbleIcon,
  BookmarkIcon,
  ShareIcon,
  CodeBracketsIcon,
} from '../components/SvgIcons';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenName, PostItem } from '../types';
import { useDatabase } from '../context/DatabaseContext';
import { getUserPosts, getBookmarkedPosts } from '../database/postsRepository';
import { getAvatarSource, getMediaSource } from '../utils/assets';
import { EditProfileModal } from './EditProfileModal';
import { CreatePostModal } from './CreatePostModal';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onSelectPost?: (postId: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, onSelectPost }) => {
  const { currentUser, dataVersion, resetDB } = useDatabase();

  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'audits'>('posts');
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostItem[]>([]);
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTabData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoadingTab(true);
      if (activeTab === 'posts') {
        const items = await getUserPosts(currentUser.id, currentUser.id);
        setUserPosts(items);
      } else if (activeTab === 'saved') {
        const items = await getBookmarkedPosts(currentUser.id);
        setSavedPosts(items);
      }
    } catch (err) {
      console.error('[ProfileScreen] Ошибка загрузки постов профиля:', err);
    } finally {
      setIsLoadingTab(false);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    loadTabData();
  }, [loadTabData, dataVersion]);

  const handleSettings = () => {
    Alert.alert(
      'Настройки ядра NEXUS',
      'Управление приложением и базой данных SQLite.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: '🌐 Открыть WebView (ЛР6)',
          onPress: () => onNavigate('webview'),
        },
        {
          text: 'Сбросить базу данных (Reset DB)',
          style: 'destructive',
          onPress: async () => {
            await resetDB();
            Alert.alert('Успех', 'База данных пересоздана и наполнена начальными данными.');
          },
        },
      ]
    );
  };

  const openThread = (postId: string) => {
    if (onSelectPost) {
      onSelectPost(postId);
    }
    onNavigate('thread');
  };

  const displayedPosts = activeTab === 'saved' ? savedPosts : userPosts;

  return (
    <View style={styles.container}>
      <Header
        onPressProfile={() => {}}
        onPressLogo={() => onNavigate('feed')}
        onOpenPost={openThread}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Профиль: аватар и верхние кнопки управления */}
        <View style={styles.profileHero}>
          <View style={styles.avatarWrap}>
            <Image
              source={getAvatarSource(currentUser?.avatar_key)}
              style={styles.largeAvatar}
            />
          </View>

          <View style={styles.profileActionBtns}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setShowEditModal(true)}
              activeOpacity={0.7}
            >
              <EditPencilIcon size={12} color={colors.mint} />
              <Text style={styles.editBtnText}>Редактировать</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={handleSettings}
              activeOpacity={0.7}
            >
              <SettingsGearIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Имя, тег и биография из SQLite */}
        <View style={styles.profileBioBox}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{currentUser?.name || 'Elena Rostova'}</Text>
            {currentUser?.verified && <VerifiedBadge size={16} />}
          </View>
          <Text style={styles.userHandle}>{currentUser?.handle || '@elena_dev'}</Text>
          <Text style={styles.userBio}>
            {currentUser?.bio || 'Фулстек AI-архитектор и криптоаналитик...'}
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{currentUser?.status_label || 'ONLINE'}</Text>
          </View>
        </View>

        {/* Карточка протокола кармы NEXUS */}
        <View style={styles.karmaCard}>
          <View style={styles.karmaHeader}>
            <View style={styles.karmaTagRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.karmaTagText}>ПРОТОКОЛ КАРМЫ NEXUS</Text>
            </View>

            <View style={styles.topAuthorPill}>
              <SparkleIcon size={11} color={colors.mint} />
              <Text style={styles.topAuthorText}>Узел валидатора v4.2</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreNumber}>
              {currentUser?.rep_score ? currentUser.rep_score.toLocaleString() : '48,920'}{' '}
            </Text>
            <Text style={styles.scoreUnit}>РЕП</Text>
          </View>

          <Text style={styles.scoreSubtext}>
            +14.2% за цикл • Синхронизировано с локальным блоком SQLite
          </Text>

          {/* Сетка счетчиков */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {currentUser?.audits_count ? `${(currentUser.audits_count / 1000).toFixed(1)}k` : '1.4k'}
              </Text>
              <Text style={styles.statLabel}>ПРОВЕРЕНО</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{currentUser?.bounties_count || 98}</Text>
              <Text style={styles.statLabel}>НАГРАДЫ</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {currentUser?.commits_count ? `${(currentUser.commits_count / 1000).toFixed(1)}k` : '4.8k'}
              </Text>
              <Text style={styles.statLabel}>ВКЛАДЫ</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumberMint}>{currentUser?.network_rank || '#42'}</Text>
              <Text style={styles.statLabel}>РАНГ СЕТИ</Text>
            </View>
          </View>
        </View>

        {/* Вкладки профиля */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'posts' && styles.tabBtnActive]}
            onPress={() => setActiveTab('posts')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              Трансляции
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'saved' && styles.tabBtnActive]}
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
              Закладки ({savedPosts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список постов вкладки */}
        {isLoadingTab ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color={colors.mint} />
          </View>
        ) : displayedPosts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {activeTab === 'saved'
                ? 'У вас пока нет сохраненных закладок'
                : 'Вы пока не опубликовали ни одной трансляции'}
            </Text>
          </View>
        ) : (
          displayedPosts.map((item) => (
            <View key={item.id} style={styles.profilePostCard}>
              <View style={styles.postCardHeader}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>#{item.topic_tag}</Text>
                </View>
                <Text style={styles.postDate}>
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </Text>
              </View>

              <TouchableOpacity onPress={() => openThread(item.id)} activeOpacity={0.85}>
                <Text style={styles.postCardTitle}>{item.title}</Text>
                <Text style={styles.postCardBody} numberOfLines={3}>
                  {item.content}
                </Text>
              </TouchableOpacity>

              {item.media_type === 'image' && (
                <TouchableOpacity
                  style={styles.previewImageCard}
                  onPress={() => openThread(item.id)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={getMediaSource(item.media_key) || require('../../assets/glsl-preview.png')}
                    style={styles.previewImg}
                  />
                  <View style={styles.previewOverlay}>
                    <CodeBracketsIcon size={12} color={colors.mint} />
                    <Text style={styles.previewTag}>GLSL SHADER v4.5</Text>
                  </View>
                </TouchableOpacity>
              )}

              <View style={styles.postCardFooter}>
                <View style={styles.footerVotes}>
                  <ThumbsUpIcon size={12} color={colors.mint} />
                  <Text style={styles.footerVotesCount}>+{item.upvotes}</Text>
                </View>

                <TouchableOpacity
                  style={styles.footerComments}
                  onPress={() => openThread(item.id)}
                >
                  <ChatBubbleIcon size={12} color={colors.textSecondary} />
                  <Text style={styles.footerCommentsCount}>{item.comments_count}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Нижняя навигация */}
      <BottomNav
        currentScreen="profile"
        onNavigate={onNavigate}
        onPressCreatePost={() => setShowCreateModal(true)}
      />

      {/* Модальные окна */}
      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={(newId) => openThread(newId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D13',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.mint,
    overflow: 'hidden',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  largeAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 245, 160, 0.12)',
    borderWidth: 1,
    borderColor: colors.mint,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mint,
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#181922',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBioBox: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textWhite,
  },
  userHandle: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: colors.mint,
    marginTop: 2,
    fontWeight: '600',
  },
  userBio: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
  statusText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  karmaCard: {
    marginHorizontal: 14,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#161824',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.25)',
  },
  karmaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  karmaTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
  },
  karmaTagText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  topAuthorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
  },
  topAuthorText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mint,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textWhite,
    letterSpacing: -0.5,
  },
  scoreUnit: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '800',
    color: colors.mint,
  },
  scoreSubtext: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textWhite,
  },
  statNumberMint: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.mint,
  },
  statLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 3,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    gap: 10,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#161822',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderColor: colors.mint,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.mint,
    fontWeight: '700',
  },
  loaderBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  profilePostCard: {
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  postCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.purpleBadgeBg,
    borderWidth: 1,
    borderColor: colors.purpleBadgeBorder,
  },
  tagBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.purpleLight,
  },
  postDate: {
    fontSize: 10,
    color: colors.textDim,
  },
  postCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: 4,
  },
  postCardBody: {
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  previewImageCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  previewImg: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(15, 16, 21, 0.85)',
  },
  previewTag: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.mint,
  },
  postCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 4,
  },
  footerVotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerVotesCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.mint,
  },
  footerComments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerCommentsCount: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
