// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  VerifiedBadge,
  EditPencilIcon,
  SettingsGearIcon,
  SparkleIcon,
  MoreDotsIcon,
  ArrowUpVoteIcon,
  ArrowDownVoteIcon,
  ChatBubbleIcon,
  BookmarkIcon,
  ShareIcon,
  CodeBracketsIcon,
} from '../components/SvgIcons';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenName } from '../types';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'threads' | 'replies' | 'media' | 'upvotes' | 'saved'>('threads');
  const [post1Voted, setPost1Voted] = useState(false);
  const [post2Voted, setPost2Voted] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        onPressProfile={() => onNavigate('profile')}
        onPressLogo={() => onNavigate('feed')}
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
              source={require('../../assets/avatar-elena-large.png')}
              style={styles.largeAvatar}
            />
          </View>

          <View style={styles.profileActionBtns}>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
              <EditPencilIcon size={12} color={colors.mint} />
              <Text style={styles.editBtnText}>Редактировать</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
              <SettingsGearIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Имя, тег и биография */}
        <View style={styles.profileBioBox}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>Elena Rostova</Text>
            <VerifiedBadge size={16} />
          </View>
          <Text style={styles.userHandle}>@elena_dev</Text>
          <Text style={styles.userBio}>
            Фулстек AI-архитектор и дизайнер кибер-минималистичных интерфейсов. Создаю децентрализованные нейрофорумы
          </Text>
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
              <Text style={styles.topAuthorText}>Топ 1% авторов</Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreNumber}>48,920 </Text>
            <Text style={styles.scoreUnit}>РЕП</Text>
          </View>

          {/* 3 под-метрики */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.mLabel}>Апвоуты</Text>
              <Text style={styles.mValue}>124.5k</Text>
              <Text style={styles.mDelta}>📈 +12%</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.mLabel}>Решения</Text>
              <Text style={styles.mValue}>86</Text>
              <Text style={styles.mSubMuted}>✔ 98.2%</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.mLabel}>Влияние</Text>
              <Text style={styles.mValue}>Мастер</Text>
              <Text style={styles.mRank}>Ранг IV</Text>
            </View>
          </View>
        </View>

        {/* Счетчики активности: Подписки, Подписчики, Ветки, Значки */}
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statCount}>1,420</Text>
            <Text style={styles.statLabel}>Подписки</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statCount}>18.6k</Text>
            <Text style={styles.statLabel}>Подписчики</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statCount}>248</Text>
            <Text style={styles.statLabel}>Ветки</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={[styles.statCount, { color: colors.purpleLight }]}>14</Text>
            <Text style={styles.statLabel}>Значки</Text>
          </View>
        </View>

        {/* Вкладки профиля */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'threads' && styles.tabBtnActive]}
            onPress={() => setActiveTab('threads')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'threads' && styles.tabBtnTextActive]}>
              Ветки
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'replies' && styles.tabBtnActive]}
            onPress={() => setActiveTab('replies')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'replies' && styles.tabBtnTextActive]}>
              Ответы
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'media' && styles.tabBtnActive]}
            onPress={() => setActiveTab('media')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'media' && styles.tabBtnTextActive]}>
              Медиа
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'upvotes' && styles.tabBtnActive]}
            onPress={() => setActiveTab('upvotes')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'upvotes' && styles.tabBtnTextActive]}>
              Оценки
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'saved' && styles.tabBtnActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'saved' && styles.tabBtnTextActive]}>
              Сохранено
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Посты профиля */}
        <View style={styles.postsList}>

          {/* Пост 1: Проектирование UI-пайплайнов */}
          <View style={styles.profilePostCard}>
            <View style={styles.pHeader}>
              <View style={styles.pTagPurple}>
                <Text style={styles.pTagPurpleText}>c/neural-net</Text>
              </View>
              <Text style={styles.pMetaTime}>• 3 дня назад</Text>
              <TouchableOpacity style={styles.pMoreBtn}>
                <MoreDotsIcon size={14} color={colors.textMuted} horizontal />
              </TouchableOpacity>
            </View>

            <Text style={styles.pTitle}>
              Проектирование UI-пайплайнов с нулевой задержкой для пространственного аудио на Rust & WebAudio API
            </Text>

            <Text style={styles.pSnippet}>
              Мы устранили проблемы межпоточной синхронизации в распределенных голосовых...
            </Text>

            <View style={styles.pFooter}>
              <View style={styles.pFooterLeft}>
                <TouchableOpacity
                  style={[styles.pVotePill, post1Voted && styles.pVotePillActive]}
                  onPress={() => setPost1Voted(!post1Voted)}
                >
                  <ArrowUpVoteIcon size={12} color={colors.mint} />
                  <Text style={styles.pVoteText}>{post1Voted ? '3.2k' : '3.1k'}</Text>
                  <ArrowDownVoteIcon size={12} color={colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.pCommentBtn}>
                  <ChatBubbleIcon size={13} color={colors.textMuted} />
                  <Text style={styles.pCommentCount}>214</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pFooterRight}>
                <TouchableOpacity style={styles.pIconBtn}>
                  <BookmarkIcon size={15} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.pIconBtn}>
                  <ShareIcon size={15} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Пост 2: WebGL-шейдеры темной темы */}
          <View style={styles.profilePostCard}>
            <View style={styles.pHeader}>
              <View style={styles.pTagMint}>
                <Text style={styles.pTagMintText}>c/cyberpunk-dev</Text>
              </View>
              <Text style={styles.pMetaTime}>• 1 нед. назад</Text>
              <TouchableOpacity style={styles.pMoreBtn}>
                <MoreDotsIcon size={14} color={colors.textMuted} horizontal />
              </TouchableOpacity>
            </View>

            <Text style={styles.pTitle}>
              Опубликовали в опенсорс тулкит WebGL-шейдеров темной темы для высокочастотных мобильных форумов
            </Text>

            <Text style={styles.pSnippet}>
              Включает калиброванное неоновое свечение, фильтры шума и слои дисперсии стекла,...
            </Text>

            {/* Изображение шейдеров с ссылкой на github */}
            <View style={styles.pMediaBox}>
              <Image source={require('../../assets/glsl-preview.png')} style={styles.pMediaImg} />
              <View style={styles.githubPill}>
                <CodeBracketsIcon size={13} color={colors.mint} />
                <Text style={styles.githubText}>github.com/nexus/glsl-neon-kit</Text>
              </View>
            </View>

            <View style={styles.pFooter}>
              <View style={styles.pFooterLeft}>
                <TouchableOpacity
                  style={[styles.pVotePill, post2Voted && styles.pVotePillActive]}
                  onPress={() => setPost2Voted(!post2Voted)}
                >
                  <ArrowUpVoteIcon size={12} color={colors.mint} />
                  <Text style={styles.pVoteText}>{post2Voted ? '5.9k' : '5.8k'}</Text>
                  <ArrowDownVoteIcon size={12} color={colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.pCommentBtn}>
                  <ChatBubbleIcon size={13} color={colors.textMuted} />
                  <Text style={styles.pCommentCount}>480</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pFooterRight}>
                <TouchableOpacity style={styles.pIconBtn}>
                  <BookmarkIcon size={15} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.pIconBtn}>
                  <ShareIcon size={15} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      <BottomNav currentScreen="profile" onNavigate={onNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHero: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  avatarWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.mint,
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
    marginTop: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E222D',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  editBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E222D',
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBioBox: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
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
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    color: colors.purpleLight,
    marginTop: 2,
  },
  userBio: {
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginTop: 8,
  },
  karmaCard: {
    marginHorizontal: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#141722',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.2)',
    marginBottom: 16,
  },
  karmaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  topAuthorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 245, 160, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  topAuthorText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.mint,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreNumber: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 24,
    fontWeight: '800',
    color: colors.textWhite,
  },
  scoreUnit: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
    fontWeight: '700',
    color: colors.mint,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#0E1017',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  mLabel: {
    fontSize: 10,
    color: colors.textDim,
    marginBottom: 4,
  },
  mValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textWhite,
    marginBottom: 2,
  },
  mDelta: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '600',
    color: colors.mint,
  },
  mSubMuted: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: colors.textMuted,
  },
  mRank: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '600',
    color: colors.mint,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  statCol: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
  },
  statLabel: {
    fontSize: 10.5,
    color: colors.textDim,
    marginTop: 2,
  },
  tabsScroll: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    marginBottom: 14,
  },
  tabsContent: {
    paddingHorizontal: 14,
    gap: 18,
  },
  tabBtn: {
    paddingVertical: 10,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.mint,
  },
  tabBtnText: {
    fontSize: 12.5,
    color: colors.textDim,
    fontWeight: '500',
  },
  tabBtnTextActive: {
    color: colors.mint,
    fontWeight: '700',
  },
  postsList: {
    paddingHorizontal: 14,
    gap: 14,
  },
  profilePostCard: {
    backgroundColor: '#161822',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  pHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pTagPurple: {
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  pTagPurpleText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.purpleLight,
  },
  pTagMint: {
    backgroundColor: 'rgba(0, 245, 160, 0.14)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.3)',
  },
  pTagMintText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.mint,
  },
  pMetaTime: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    color: colors.textDim,
    marginLeft: 6,
  },
  pMoreBtn: {
    marginLeft: 'auto',
    padding: 2,
  },
  pTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
    color: colors.textWhite,
    marginBottom: 6,
  },
  pSnippet: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
    marginBottom: 10,
  },
  pMediaBox: {
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  pMediaImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  githubPill: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 12, 18, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  githubText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    color: colors.textWhite,
  },
  pFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pVotePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#111218',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pVotePillActive: {
    backgroundColor: '#0E241B',
  },
  pVoteText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.mint,
  },
  pCommentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#111218',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pCommentCount: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5,
    color: colors.textMuted,
  },
  pFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pIconBtn: {
    padding: 4,
  },
});
