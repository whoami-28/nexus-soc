// src/screens/FeedScreen.tsx
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
  MoreDotsIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChatBubbleIcon,
  RepostIcon,
  ShareIcon,
  BookmarkIcon,
  LatencyCurveSvg,
  SparkleIcon,
} from '../components/SvgIcons';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenName } from '../types';

interface FeedScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'subs' | 'all' | 'tech'>('trending');
  const [post1Voted, setPost1Voted] = useState(true);
  const [post2Voted, setPost2Voted] = useState(false);
  const [post2Saved, setPost2Saved] = useState(true);

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
        {/* Панель фильтров */}
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
            <Text style={styles.nodeText}>УЗЕЛ #882</Text>
          </View>
          <Text style={styles.broadcastBody}>
            Развертывание Nexus Kernel 4.19 сегодня ночью. Низколатентная синхронизация векторов по всем узлам.
          </Text>
        </View>

        {/* Карточка поста 1: @kira_valkyrie (кликабельна — ведет в ThreadScreen) */}
        <TouchableOpacity
          style={styles.postCard}
          onPress={() => onNavigate('thread')}
          activeOpacity={0.92}
        >
          <View style={styles.postHeader}>
            <View style={styles.authorAvatarBox}>
              <Image source={require('../../assets/avatar-kira.png')} style={styles.authorAvatar} />
            </View>

            <View style={styles.authorInfo}>
              <View style={styles.authorTitleRow}>
                <Text style={styles.authorHandle}>@kira_valkyri</Text>
                <VerifiedBadge size={14} />
              </View>
              <View style={styles.authorMetaRow}>
                <Text style={styles.postTimeText}>12 мин{'\n'}назад</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.rankPurple}>SysOp{'\n'}Уровень 5</Text>
              </View>
            </View>

            <View style={styles.topicBadge}>
              <Text style={styles.topicBadgeText}>C/NEURAL-NET</Text>
            </View>

            <TouchableOpacity style={styles.moreBtn}>
              <MoreDotsIcon size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.postBody}>
            Утекли бенчмарки квантового синтеза GPT-5. Имеем ли мы дело с автономной субъектностью или масштабированным вероятностным выводом? График задержки ниже 👇
          </Text>

          {/* Виджет телеметрии */}
          <View style={styles.telemetryBox}>
            <View style={styles.telemetryTop}>
              <View style={styles.dotsRow}>
                <View style={[styles.tDot, { backgroundColor: '#C084FC' }]} />
                <View style={[styles.tDot, { backgroundColor: '#FBBF24' }]} />
                <View style={[styles.tDot, { backgroundColor: '#34D399' }]} />
                <Text style={styles.telemetryTitle}>ЛОГ_ТЕЛЕМЕТРИИ</Text>
              </View>
              <Text style={styles.liveTag}>ПРЯМОЙ_ЭФИР</Text>
            </View>
            <Text style={styles.codeLineMint}>
              latency_ms: 1.4 // throughput: 240 t/s // co
            </Text>
            <View style={styles.codeLineSub}>
              <Text style={styles.codeKey}>&gt; delta_compression: </Text>
              <Text style={styles.codeVal}>0.0031ns [OPTIMAL]</Text>
            </View>
          </View>

          {/* Виджет графика затухания задержки */}
          <View style={styles.chartBox}>
            <View style={styles.chartTop}>
              <Text style={styles.chartTitle}>ЗАТУХАНИЕ ЗАДЕРЖКИ</Text>
              <Text style={styles.chartDelta}>-42% по сравнению с SOTA</Text>
            </View>
            <View style={styles.chartSvgWrap}>
              <LatencyCurveSvg width={295} height={55} />
            </View>
          </View>

          {/* Панель действий поста */}
          <View style={styles.postFooter}>
            <View style={styles.footerLeft}>
              <TouchableOpacity
                style={[styles.votePill, post1Voted && styles.votePillActive]}
                onPress={() => setPost1Voted(!post1Voted)}
                activeOpacity={0.7}
              >
                <ThumbsUpIcon size={14} color={post1Voted ? colors.mint : colors.textSecondary} filled={post1Voted} />
                <Text style={[styles.voteCountText, post1Voted && styles.voteCountActive]}>
                  +2.4k
                </Text>
                <View style={styles.voteDivider} />
                <ThumbsDownIcon size={14} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => onNavigate('thread')}
                activeOpacity={0.7}
              >
                <ChatBubbleIcon size={13} color={colors.textMuted} />
                <Text style={styles.actionPillText}>342</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionPill} activeOpacity={0.7}>
                <RepostIcon size={13} color={colors.textMuted} />
                <Text style={styles.actionPillText}>89</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerRight}>
              <TouchableOpacity style={styles.plainBtn}>
                <ShareIcon size={15} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.plainBtn}>
                <BookmarkIcon size={15} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Карточка поста 2: @zeno_flux */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={[styles.authorAvatarBox, { borderColor: colors.mint }]}>
              <Image source={require('../../assets/avatar-zeno.png')} style={styles.authorAvatar} />
            </View>

            <View style={styles.authorInfo}>
              <View style={styles.authorTitleRow}>
                <Text style={styles.authorHandle}>@zeno_flux</Text>
              </View>
              <View style={styles.authorMetaRow}>
                <Text style={styles.postTimeText}>45 мин{'\n'}назад</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.rankMint}>Ключевой{'\n'}участник</Text>
              </View>
            </View>

            <View style={styles.topicBadge}>
              <Text style={styles.topicBadgeText}>C/CYBERPUNK-DEV</Text>
            </View>

            <TouchableOpacity style={styles.moreBtn}>
              <MoreDotsIcon size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.postBody}>
            Чистый темный UI со стеклянными карточками и неоново-мятными акцентами — пик эстетики для обсуждений разработчиков. Как вам наш новый интерфейс форума?
          </Text>

          {/* Медиа-превью */}
          <View style={styles.mediaBox}>
            <Image source={require('../../assets/nexus-preview.png')} style={styles.mediaImg} />
            <View style={styles.mediaOverlay}>
              <View style={styles.specPill}>
                <Text style={styles.specPillText}>Спецификация Nexus Engine v2.4</Text>
              </View>
              <View style={styles.fpsPill}>
                <Text style={styles.fpsPillText}>120 FPS</Text>
              </View>
            </View>
          </View>

          {/* Панель действий поста 2 */}
          <View style={styles.postFooter}>
            <View style={styles.footerLeft}>
              <TouchableOpacity
                style={styles.votePill}
                onPress={() => setPost2Voted(!post2Voted)}
                activeOpacity={0.7}
              >
                <ThumbsUpIcon size={14} color={post2Voted ? colors.mint : colors.textSecondary} filled={post2Voted} />
                <Text style={[styles.voteCountText, post2Voted && styles.voteCountActive]}>
                  {post2Voted ? '+1.9k' : '+1.8k'}
                </Text>
                <View style={styles.voteDivider} />
                <ThumbsDownIcon size={14} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionPill}>
                <ChatBubbleIcon size={13} color={colors.textMuted} />
                <Text style={styles.actionPillText}>128</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionPill}>
                <RepostIcon size={13} color={colors.textMuted} />
                <Text style={styles.actionPillText}>41</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerRight}>
              <TouchableOpacity style={styles.plainBtn}>
                <ShareIcon size={15} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookmarkFab, post2Saved && styles.bookmarkFabActive]}
                onPress={() => setPost2Saved(!post2Saved)}
                activeOpacity={0.7}
              >
                <BookmarkIcon size={15} color={post2Saved ? '#D8B4FE' : colors.textMuted} filled={post2Saved} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Баннер «Награда подпространства» */}
        <View style={styles.bountyCard}>
          <View style={styles.bountyIconBox}>
            <SparkleIcon size={18} color="#E9D5FF" />
          </View>
          <View style={styles.bountyTextBox}>
            <Text style={styles.bountyTitle} numberOfLines={1}>Награда подпространст...</Text>
            <Text style={styles.bountyDesc} numberOfLines={1}>Устранить состояние гонки памят...</Text>
          </View>
          <TouchableOpacity style={styles.bountyBtn} activeOpacity={0.8}>
            <Text style={styles.bountyBtnText}>Обзор</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav currentScreen="feed" onNavigate={onNavigate} />
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
    paddingBottom: 20,
  },
  filterScroll: {
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1A1C25',
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  filterPillActive: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  filterText: {
    fontFamily: 'Inter, sans-serif, -apple-system',
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTextActive: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.mintTextDark,
  },
  broadcastBanner: {
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 13,
    borderRadius: 16,
    backgroundColor: '#171923',
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
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  broadcastTagText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.textSecondary,
  },
  nodeText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: colors.textDim,
  },
  broadcastBody: {
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
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
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    lineHeight: 11,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: 9,
    color: colors.textDim,
  },
  rankPurple: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    lineHeight: 11,
    fontWeight: '600',
    color: colors.purpleLight,
  },
  rankMint: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    lineHeight: 11,
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
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9,
    fontWeight: '600',
    color: colors.purpleLight,
  },
  moreBtn: {
    padding: 3,
  },
  postBody: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  telemetryBox: {
    backgroundColor: colors.bgTerminal,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 10,
    padding: 10,
    marginBottom: 9,
  },
  telemetryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  telemetryTitle: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    color: colors.textDim,
    marginLeft: 4,
  },
  liveTag: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9,
    fontWeight: '700',
    color: colors.mint,
  },
  codeLineMint: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5,
    color: colors.mint,
    marginBottom: 3,
  },
  codeLineSub: {
    flexDirection: 'row',
  },
  codeKey: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5,
    fontWeight: '600',
    color: '#C084FC',
  },
  codeVal: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5,
    color: colors.textMuted,
  },
  chartBox: {
    backgroundColor: '#12141C',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  chartTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartTitle: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    color: colors.textDim,
  },
  chartDelta: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '600',
    color: colors.mint,
  },
  chartSvgWrap: {
    marginTop: -8,
  },
  mediaBox: {
    height: 165,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  mediaImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaOverlay: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specPill: {
    backgroundColor: 'rgba(18, 20, 28, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  specPillText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    color: colors.textSecondary,
  },
  fpsPill: {
    backgroundColor: 'rgba(4, 38, 26, 0.88)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.35)',
  },
  fpsPillText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.mint,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.actionPillBg,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  votePillActive: {
    borderColor: 'rgba(0, 245, 160, 0.3)',
  },
  voteCountText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  voteCountActive: {
    color: colors.mint,
  },
  voteDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.actionPillBg,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  actionPillText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10.5,
    color: colors.textMuted,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plainBtn: {
    padding: 4,
  },
  bookmarkFab: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1C1628',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.25)',
  },
  bookmarkFabActive: {
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  bountyCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#14151E',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bountyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#351962',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bountyTextBox: {
    flex: 1,
  },
  bountyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textWhite,
  },
  bountyDesc: {
    fontSize: 11,
    color: colors.textDim,
  },
  bountyBtn: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#222430',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bountyBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
