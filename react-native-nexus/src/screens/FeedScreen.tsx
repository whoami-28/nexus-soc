// src/screens/FeedScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  VerifiedBadge,
  MoreDotsIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChatBubbleIcon,
  RepostIcon,
  ShareIcon,
  BookmarkIcon,
  LatencyCurveSvg,
  SparkleIcon,
  PlusIcon,
} from '../components/SvgIcons';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenName, PostItem } from '../types';
import { useDatabase } from '../context/DatabaseContext';
import {
  getPosts,
  togglePostVote,
  togglePostBookmark,
  deletePost,
} from '../database/postsRepository';
import { getAvatarSource, getMediaSource } from '../utils/assets';
import { CreatePostModal } from './CreatePostModal';

interface FeedScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onSelectPost?: (postId: string) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ onNavigate, onSelectPost }) => {
  const { currentUser, dataVersion, notifyDataChanged } = useDatabase();

  const [activeTab, setActiveTab] = useState<'trending' | 'subs' | 'all' | 'tech'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await getPosts(activeTab, searchQuery, currentUser?.id);
      setPosts(items);
    } catch (err) {
      console.error('[FeedScreen] Ошибка загрузки постов:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, currentUser?.id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, dataVersion]);

  const handleVote = async (postId: string, delta: 1 | -1) => {
    if (!currentUser) return;
    try {
      await togglePostVote(postId, currentUser.id, delta);
      notifyDataChanged();
    } catch (err) {
      console.error('[FeedScreen] Ошибка голосования:', err);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!currentUser) return;
    try {
      await togglePostBookmark(postId, currentUser.id);
      notifyDataChanged();
    } catch (err) {
      console.error('[FeedScreen] Ошибка добавления в закладки:', err);
    }
  };

  const handlePostMenu = (post: PostItem) => {
    if (currentUser?.id === post.author_id) {
      Alert.alert(
        'Управление публикацией',
        'Вы являетесь автором этого сообщения.',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Удалить из SQLite',
            style: 'destructive',
            onPress: async () => {
              await deletePost(post.id);
              notifyDataChanged();
            },
          },
        ]
      );
    } else {
      Alert.alert('NEXUS Node', `Публикация автора ${post.author.name}`);
    }
  };

  const openThread = (postId: string) => {
    if (onSelectPost) {
      onSelectPost(postId);
    }
    onNavigate('thread');
  };

  const formatUpvotes = (num: number) => {
    if (num >= 1000) return `+${(num / 1000).toFixed(1)}k`;
    return `+${num}`;
  };

  return (
    <View style={styles.container}>
      <Header
        onPressProfile={() => onNavigate('profile')}
        onPressLogo={() => onNavigate('feed')}
        onOpenPost={openThread}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Поисковая строка по узлу SQLite */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по публикациям, тегам и коду..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Панель фильтров категорий */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'trending' && styles.filterPillActive]}
            onPress={() => setActiveTab('trending')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeTab === 'trending' && styles.filterTextActive]}>
              ⚡ В тренде
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'subs' && styles.filterPillActive]}
            onPress={() => setActiveTab('subs')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeTab === 'subs' && styles.filterTextActive]}>
              👥 Подписки
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'all' && styles.filterPillActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeTab === 'all' && styles.filterTextActive]}>
              🌐 Все
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'tech' && styles.filterPillActive]}
            onPress={() => setActiveTab('tech')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeTab === 'tech' && styles.filterTextActive]}>
              📓 Технологии
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Баннер трансляции подпространства */}
        <View style={styles.broadcastBanner}>
          <View style={styles.broadcastHeader}>
            <View style={styles.broadcastTagRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.broadcastTagText}>ТРАНСЛЯЦИЯ ПОДПРОСТРАНСТВА</Text>
            </View>
            <Text style={styles.nodeText}>SQLITE // УЗЕЛ #882</Text>
          </View>
          <Text style={styles.broadcastBody}>
            Ядро NEXUS v4.19 синхронизировано. Локальная база данных SQLite активна: все публикации, ветки и карма сохраняются на устройстве.
          </Text>
        </View>

        {/* Индикатор загрузки */}
        {isLoading && (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color={colors.mint} />
          </View>
        )}

        {/* Список постов из SQLite */}
        {!isLoading && posts.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>В этой категории пока нет публикаций</Text>
            <TouchableOpacity
              style={styles.emptyCreateBtn}
              onPress={() => setShowCreateModal(true)}
              activeOpacity={0.7}
            >
              <PlusIcon size={16} color="#041E13" />
              <Text style={styles.emptyCreateBtnText}>Создать первую публикацию</Text>
            </TouchableOpacity>
          </View>
        )}

        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Шапка поста */}
            <View style={styles.postHeader}>
              <TouchableOpacity
                style={styles.authorAvatarBox}
                onPress={() => onNavigate('profile')}
                activeOpacity={0.7}
              >
                <Image
                  source={getAvatarSource(post.author.avatar_key)}
                  style={styles.authorAvatar}
                />
              </TouchableOpacity>

              <View style={styles.authorInfo}>
                <View style={styles.authorTitleRow}>
                  <Text style={styles.authorHandle}>{post.author.name}</Text>
                  {post.author.verified && <VerifiedBadge size={14} />}
                </View>

                <View style={styles.authorMetaRow}>
                  <Text style={styles.postTimeText}>{post.author.handle}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.rankMint}>{post.author.network_rank || '#УЗЕЛ'}</Text>
                </View>
              </View>

              <View style={styles.topicBadge}>
                <Text style={styles.topicBadgeText}>#{post.topic_tag}</Text>
              </View>

              <TouchableOpacity
                style={styles.moreBtn}
                onPress={() => handlePostMenu(post)}
                activeOpacity={0.7}
              >
                <MoreDotsIcon size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Заголовок и кликабельный контент (переход в тред) */}
            <TouchableOpacity onPress={() => openThread(post.id)} activeOpacity={0.85}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
            </TouchableOpacity>

            {/* Вложение: График затухания телеметрии */}
            {post.media_type === 'telemetry_chart' && (
              <TouchableOpacity
                style={styles.chartWidget}
                onPress={() => openThread(post.id)}
                activeOpacity={0.85}
              >
                <View style={styles.chartHeader}>
                  <View style={styles.chartTitleBox}>
                    <Text style={styles.chartTitle}>ЗАТУХАНИЕ ЗАДЕРЖКИ</Text>
                    <Text style={styles.chartSubtitle}>-42% ПО СРАВНЕНИЮ С SOTA</Text>
                  </View>
                  <View style={styles.sotaBadge}>
                    <Text style={styles.sotaBadgeText}>SOTA</Text>
                  </View>
                </View>
                <View style={styles.chartCanvas}>
                  <LatencyCurveSvg width={280} height={46} />
                </View>
              </TouchableOpacity>
            )}

            {/* Вложение: Медиа-изображение */}
            {post.media_type === 'image' && (
              <TouchableOpacity
                style={styles.mediaCard}
                onPress={() => openThread(post.id)}
                activeOpacity={0.85}
              >
                <Image
                  source={getMediaSource(post.media_key) || require('../../assets/nexus-preview.png')}
                  style={styles.mediaImg}
                />
                <View style={styles.mediaOverlayBottom}>
                  {post.spec_badge && (
                    <View style={styles.specPill}>
                      <Text style={styles.specText}>{post.spec_badge}</Text>
                    </View>
                  )}
                  {post.fps_badge && (
                    <View style={styles.fpsPill}>
                      <Text style={styles.fpsText}>{post.fps_badge}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {/* Вложение: Превью кода (если есть сниппет) */}
            {post.code_snippet && (
              <TouchableOpacity
                style={styles.codeSnippetCard}
                onPress={() => openThread(post.id)}
                activeOpacity={0.85}
              >
                <View style={styles.codeSnippetHeader}>
                  <Text style={styles.codeSnippetFilename}>
                    {post.code_filename || 'SNIPPET.PY'}
                  </Text>
                  <Text style={styles.codeSnippetTag}>PYTHON 3.12</Text>
                </View>
                <Text style={styles.codeSnippetText} numberOfLines={3}>
                  {post.code_snippet}
                </Text>
              </TouchableOpacity>
            )}

            {/* Панель реакций и действий */}
            <View style={styles.actionsBar}>
              <View style={styles.leftActions}>
                {/* Голосование: Апвоут */}
                <TouchableOpacity
                  style={[styles.actionPill, post.isUpvoted && styles.actionPillMint]}
                  onPress={() => handleVote(post.id, 1)}
                  activeOpacity={0.7}
                >
                  <ThumbsUpIcon
                    size={13}
                    color={post.isUpvoted ? colors.mint : colors.textSecondary}
                  />
                  <Text style={[styles.actionCount, post.isUpvoted && styles.actionCountMint]}>
                    {formatUpvotes(post.upvotes)}
                  </Text>
                </TouchableOpacity>

                {/* Голосование: Дизвоут */}
                <TouchableOpacity
                  style={[styles.actionPill, post.isDownvoted && styles.actionPillRed]}
                  onPress={() => handleVote(post.id, -1)}
                  activeOpacity={0.7}
                >
                  <ThumbsDownIcon
                    size={13}
                    color={post.isDownvoted ? '#EF4444' : colors.textSecondary}
                  />
                </TouchableOpacity>

                {/* Комментарии */}
                <TouchableOpacity
                  style={styles.actionPill}
                  onPress={() => openThread(post.id)}
                  activeOpacity={0.7}
                >
                  <ChatBubbleIcon size={13} color={colors.textSecondary} />
                  <Text style={styles.actionCount}>{post.comments_count}</Text>
                </TouchableOpacity>

                {/* Репост */}
                <TouchableOpacity style={styles.actionPill} activeOpacity={0.7}>
                  <RepostIcon size={13} color={colors.textSecondary} />
                  <Text style={styles.actionCount}>{post.reposts_count}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rightActions}>
                <TouchableOpacity style={styles.iconActionBtn} activeOpacity={0.7}>
                  <ShareIcon size={14} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Закладка */}
                <TouchableOpacity
                  style={[styles.bookmarkBtn, post.isBookmarked && styles.bookmarkBtnSaved]}
                  onPress={() => handleBookmark(post.id)}
                  activeOpacity={0.7}
                >
                  <BookmarkIcon
                    size={14}
                    color={post.isBookmarked ? colors.purpleLight : colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Карточка задания подпространства (Bounty) */}
        <View style={styles.bountyCard}>
          <View style={styles.bountyIconBox}>
            <SparkleIcon size={18} color={colors.mint} />
          </View>
          <View style={styles.bountyInfo}>
            <Text style={styles.bountyTitle}>Устранение состояния гонки памяти</Text>
            <Text style={styles.bountySub}>Награда: 2,500 NEX // Высокая сложность</Text>
          </View>
          <TouchableOpacity style={styles.bountyActionBtn} activeOpacity={0.8}>
            <Text style={styles.bountyActionText}>Обзор</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Нижняя навигация */}
      <BottomNav
        currentScreen="feed"
        onNavigate={onNavigate}
        onPressCreatePost={() => setShowCreateModal(true)}
      />

      {/* Модальное окно создания поста */}
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
  searchBarContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchInput: {
    backgroundColor: '#161822',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textWhite,
  },
  filterScroll: {
    marginTop: 6,
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#181922',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterPillActive: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  filterTextActive: {
    color: colors.mintTextDark,
    fontWeight: '700',
  },
  broadcastBanner: {
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#161426',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
  },
  broadcastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  broadcastTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.mint,
  },
  broadcastTagText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  nodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    color: colors.textDim,
  },
  broadcastBody: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  loaderBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyCard: {
    marginHorizontal: 14,
    padding: 30,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    gap: 14,
  },
  emptyTitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyCreateBtn: {
    backgroundColor: colors.mint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyCreateBtnText: {
    color: '#041E13',
    fontWeight: '700',
    fontSize: 12,
  },
  postCard: {
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  authorAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.purple,
    overflow: 'hidden',
  },
  authorAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  authorInfo: {
    flex: 1,
  },
  authorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorHandle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
  authorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  postTimeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9.5,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: 9,
    color: colors.textDim,
  },
  rankMint: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.mint,
  },
  topicBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 6,
    backgroundColor: colors.purpleBadgeBg,
    borderWidth: 1,
    borderColor: colors.purpleBadgeBorder,
  },
  topicBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.purpleLight,
  },
  moreBtn: {
    padding: 4,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: 6,
    lineHeight: 20,
  },
  postContent: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  chartWidget: {
    borderRadius: 14,
    backgroundColor: '#090A0E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chartTitleBox: {},
  chartTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  chartSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: colors.mint,
    marginTop: 2,
  },
  sotaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.4)',
  },
  sotaBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.mint,
  },
  chartCanvas: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  mediaCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#090A0E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  mediaImg: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  mediaOverlayBottom: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(15, 16, 21, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  specText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  fpsPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 245, 160, 0.2)',
    borderWidth: 1,
    borderColor: colors.mint,
  },
  fpsText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    color: colors.mint,
    fontWeight: '700',
  },
  codeSnippetCard: {
    backgroundColor: '#090A0F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    marginBottom: 12,
  },
  codeSnippetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  codeSnippetFilename: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.mint,
  },
  codeSnippetTag: {
    fontSize: 9,
    color: colors.textMuted,
  },
  codeSnippetText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#1F2230',
  },
  actionPillMint: {
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderWidth: 1,
    borderColor: colors.mint,
  },
  actionPillRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  actionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionCountMint: {
    color: colors.mint,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    padding: 6,
  },
  bookmarkBtn: {
    padding: 6,
    borderRadius: 8,
  },
  bookmarkBtnSaved: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  bountyCard: {
    marginHorizontal: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#141724',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bountyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 245, 160, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bountyInfo: {
    flex: 1,
  },
  bountyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
  },
  bountySub: {
    fontSize: 11,
    color: colors.mint,
    marginTop: 2,
  },
  bountyActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  bountyActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textWhite,
  },
});
