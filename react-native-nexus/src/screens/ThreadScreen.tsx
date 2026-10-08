// src/screens/ThreadScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  BackArrowIcon,
  ShareIcon,
  VerifiedBadge,
  CopyIcon,
  ArrowUpVoteIcon,
  ArrowDownVoteIcon,
  RepostIcon,
  BookmarkIcon,
  MoreDotsIcon,
  PaperPlaneIcon,
  ImageIcon,
  CodeBracketsIcon,
  ChartBarIcon,
  SmileIcon,
} from '../components/SvgIcons';
import { ScreenName } from '../types';

interface ThreadScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const ThreadScreen: React.FC<ThreadScreenProps> = ({ onNavigate }) => {
  const [commentFilter, setCommentFilter] = useState<'best' | 'new'>('best');
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [postUpvoted, setPostUpvoted] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* Шапка ветки обсуждения */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => onNavigate('feed')}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={20} color={colors.textWhite} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.miniLogoBox}>
            <Image source={require('../../assets/logo.png')} style={styles.miniLogoImg} />
          </View>
          <Text style={styles.headerTitle}>Ветка обсуждения</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <ShareIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => onNavigate('profile')}
            activeOpacity={0.7}
          >
            <Image source={require('../../assets/avatar-user.png')} style={styles.avatarImg} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Автор основного поста */}
        <View style={styles.authorRow}>
          <View style={styles.authorAvatarBox}>
            <Image source={require('../../assets/avatar-kira-thread.png')} style={styles.authorAvatar} />
          </View>
          <View style={styles.authorInfo}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>Kira Vance</Text>
              <VerifiedBadge size={14} />
            </View>
            <Text style={styles.authorHandle}>@kira_valkyrie • 2ч назад</Text>
          </View>
        </View>

        {/* Заголовок поста */}
        <Text style={styles.postTitle}>
          Автономная субъектность против масштабированного вероятностного вывода
        </Text>

        {/* Текст поста */}
        <Text style={styles.postBody}>
          После изучения квантовых сред выполнения LLM задержка снизилась с 45мс до 1.4мс, что фундаментально меняет мультиагентную оркестрацию. Ниже приведена архитектура:
        </Text>

        {/* Терминальный блок с кодом Python */}
        <View style={styles.codeBlock}>
          <View style={styles.codeHeader}>
            <View style={styles.dotsRow}>
              <View style={[styles.cDot, { backgroundColor: '#C084FC' }]} />
              <View style={[styles.cDot, { backgroundColor: '#FBBF24' }]} />
              <View style={[styles.cDot, { backgroundColor: '#34D399' }]} />
              <Text style={styles.codeFilename}>MESH_DISPATCHER.PY</Text>
            </View>

            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
              <CopyIcon size={13} color={copied ? colors.mint : colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.codeBody}>
            <Text style={styles.codeLine}>
              <Text style={styles.cKeyword}>async def </Text>
              <Text style={styles.cFunc}>dispatch_neural_mesh</Text>
              <Text style={styles.cPlain}>(cluster: NodeGrid):</Text>
            </Text>

            <Text style={styles.codeLine}>
              <Text style={styles.cIndent}>  runtime_nodes = </Text>
              <Text style={styles.cKeyword}>await </Text>
              <Text style={styles.cPlain}>cluster.resolve_active_q</Text>
            </Text>

            <Text style={styles.codeLine}>
              <Text style={styles.cIndent}>  sync_frame = runtime_nodes.build_vector_stream(</Text>
            </Text>

            <Text style={styles.codeLine}>
              <Text style={styles.cIndent}>    mode=</Text>
              <Text style={styles.cString}>"speculative_v4"</Text>
              <Text style={styles.cPlain}>,</Text>
            </Text>

            <Text style={styles.codeLine}>
              <Text style={styles.cIndent}>    latency_budget_ms=</Text>
              <Text style={styles.cNumber}>1.4</Text>
            </Text>

            <Text style={styles.codeLine}>
              <Text style={styles.cIndent}>  )</Text>
            </Text>

            <Text style={styles.codeLine}>
              <Text style={styles.cIndent}>  </Text>
              <Text style={styles.cKeyword}>return await </Text>
              <Text style={styles.cPlain}>sync_frame.commit_state_pulse()</Text>
            </Text>
          </View>
        </View>

        {/* Панель реакций на пост */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.votePill, postUpvoted && styles.votePillActive]}
            onPress={() => setPostUpvoted(!postUpvoted)}
            activeOpacity={0.7}
          >
            <ArrowUpVoteIcon size={14} color={postUpvoted ? colors.mintTextDark : colors.textMuted} />
            <Text style={[styles.voteCountText, postUpvoted && styles.voteCountActive]}>
              {postUpvoted ? '4.2k' : '4.1k'}
            </Text>
            <ArrowDownVoteIcon size={14} color={postUpvoted ? colors.mintTextDark : colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <RepostIcon size={14} color={colors.textSecondary} />
            <Text style={styles.actionBtnText}>Репост</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={() => setBookmarked(!bookmarked)}
            activeOpacity={0.7}
          >
            <BookmarkIcon size={16} color={bookmarked ? colors.purpleLight : colors.textSecondary} filled={bookmarked} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconActionBtn} activeOpacity={0.7}>
            <ShareIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Разделитель и шапка комментариев */}
        <View style={styles.commentsHeaderRow}>
          <View style={styles.commentsTitleGroup}>
            <Text style={styles.commentsTitle}>Ветка комментариев</Text>
            <View style={styles.commentsBadge}>
              <Text style={styles.commentsBadgeText}>582</Text>
            </View>
          </View>

          <View style={styles.filterPillsGroup}>
            <TouchableOpacity
              style={[styles.sortPill, commentFilter === 'best' && styles.sortPillActive]}
              onPress={() => setCommentFilter('best')}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortPillText, commentFilter === 'best' && styles.sortPillTextActive]}>
                Лучшие
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortPill, commentFilter === 'new' && styles.sortPillActive]}
              onPress={() => setCommentFilter('new')}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortPillText, commentFilter === 'new' && styles.sortPillTextActive]}>
                Новые
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Дерево комментариев */}
        <View style={styles.commentsList}>

          {/* Комментарий 1: Marx Cyber */}
          <View style={styles.commentItem}>
            <View style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Image source={require('../../assets/avatar-marx.png')} style={styles.cAvatar} />
                <View style={styles.cAuthorInfo}>
                  <Text style={styles.cAuthorName}>Marx Cyber</Text>
                  <Text style={styles.cAuthorMeta}>@marx_cyber • 1ч назад</Text>
                </View>
                <TouchableOpacity style={styles.cMoreBtn}>
                  <MoreDotsIcon size={14} color={colors.textMuted} horizontal />
                </TouchableOpacity>
              </View>

              <Text style={styles.commentText}>
                Больше всего меня удивляет объем используемой памяти. Запуск на периферийных устройствах раньше был невозможен.
              </Text>

              <View style={styles.commentFooter}>
                <TouchableOpacity style={styles.cVoteBtn} activeOpacity={0.7}>
                  <ArrowUpVoteIcon size={12} color={colors.mint} />
                  <Text style={styles.cVoteText}>+428</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cReplyBtn} activeOpacity={0.7}>
                  <Text style={styles.cReplyText}>↩ Ответить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Вложенная ветка: Комментарий 2 (Nova) и Комментарий 3 (Kira Vance OP) */}
          <View style={styles.nestedThread}>
            {/* Вертикальная направляющая линия ветки */}
            <View style={styles.threadLinePurple} />

            <View style={styles.nestedCardsColumn}>
              {/* Комментарий 2: Nova */}
              <View style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Image source={require('../../assets/avatar-nova.png')} style={styles.cAvatar} />
                  <View style={styles.cAuthorInfo}>
                    <Text style={styles.cAuthorName}>Nova</Text>
                    <Text style={styles.cAuthorMeta}>@dev_nova • 42м назад</Text>
                  </View>
                </View>

                <Text style={styles.commentText}>
                  Именно. Выполнение тензоров на устройстве быстрее 2 мс открывает пайплайны "голос-логика" в реальном времени.
                </Text>

                <View style={styles.commentFooter}>
                  <TouchableOpacity style={styles.cVoteBtn} activeOpacity={0.7}>
                    <ArrowUpVoteIcon size={12} color={colors.mint} />
                    <Text style={styles.cVoteText}>+154</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cReplyBtn} activeOpacity={0.7}>
                    <Text style={styles.cReplyText}>↩ Ответить</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Комментарий 3 (глубже вложенный, ответ автора OP) */}
              <View style={styles.subNestedThread}>
                <View style={styles.threadLineMint} />

                <View style={[styles.commentCard, styles.commentCardOP]}>
                  <View style={styles.commentHeader}>
                    <Image source={require('../../assets/avatar-kira-small.png')} style={styles.cAvatar} />
                    <View style={styles.cAuthorInfo}>
                      <View style={styles.opHeaderRow}>
                        <Text style={styles.cAuthorName}>Kira Vance</Text>
                        <View style={styles.opBadge}>
                          <Text style={styles.opBadgeText}>OP</Text>
                        </View>
                        <Text style={styles.cAuthorMeta}>18м назад</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.commentText}>
                    Вчера тестировали пограничные узлы, бенчмарки подтвердились. Таблица логов уже в git.
                  </Text>

                  <View style={styles.commentFooter}>
                    <TouchableOpacity style={styles.cVoteBtn} activeOpacity={0.7}>
                      <ArrowUpVoteIcon size={12} color={colors.mint} />
                      <Text style={styles.cVoteText}>+89</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cReplyBtn} activeOpacity={0.7}>
                      <Text style={styles.cReplyText}>↩ Ответить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>
          </View>

        </View>
      </ScrollView>

      {/* Фиксированная нижняя панель ввода ответа */}
      <View style={styles.bottomBar}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ответить @kira_valkyrie..."
            placeholderTextColor={colors.textDim}
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity style={styles.smileBtn} activeOpacity={0.7}>
            <SmileIcon size={17} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendFab} activeOpacity={0.85}>
          <PaperPlaneIcon size={16} color={colors.mintTextDark} />
        </TouchableOpacity>
      </View>

      {/* Вспомогательные иконки вложений под инпутом */}
      <View style={styles.attachBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <ImageIcon size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachBtn}>
          <CodeBracketsIcon size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachBtn}>
          <ChartBarIcon size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(18, 19, 26, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniLogoBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#060709',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniLogoImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.purpleLight,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  authorAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.purple,
  },
  authorAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
  },
  authorHandle: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 25,
    color: colors.textWhite,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  postBody: {
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  codeBlock: {
    backgroundColor: colors.bgTerminal,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    marginBottom: 16,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  codeFilename: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDim,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  copyBtn: {
    padding: 3,
  },
  codeBody: {
    padding: 12,
  },
  codeLine: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    lineHeight: 18,
  },
  cKeyword: {
    color: '#C084FC',
    fontWeight: '700',
  },
  cFunc: {
    color: colors.mint,
    fontWeight: '600',
  },
  cPlain: {
    color: colors.textSecondary,
  },
  cIndent: {
    color: colors.textSecondary,
  },
  cString: {
    color: colors.mint,
  },
  cNumber: {
    color: '#60A5FA',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.mint,
  },
  votePillActive: {
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  voteCountText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
    fontWeight: '700',
    color: colors.mintTextDark,
  },
  voteCountActive: {
    color: colors.mintTextDark,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.actionPillBg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.actionPillBg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  commentsTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  commentsTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textWhite,
  },
  commentsBadge: {
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.3)',
  },
  commentsBadgeText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.mint,
  },
  filterPillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#181A24',
  },
  sortPillActive: {
    backgroundColor: '#262836',
  },
  sortPillText: {
    fontSize: 11,
    color: colors.textDim,
  },
  sortPillTextActive: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    marginBottom: 4,
  },
  commentCard: {
    backgroundColor: '#161822',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  cAuthorInfo: {
    flex: 1,
  },
  cAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
  },
  cAuthorMeta: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9.5,
    color: colors.textDim,
  },
  cMoreBtn: {
    padding: 3,
  },
  commentText: {
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cVoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1C202C',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cVoteText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.mint,
  },
  cReplyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  cReplyBtn: {
    padding: 3,
  },
  nestedThread: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  threadLinePurple: {
    width: 2,
    backgroundColor: '#A855F7',
    borderRadius: 1,
    marginLeft: 14,
  },
  nestedCardsColumn: {
    flex: 1,
    gap: 10,
  },
  subNestedThread: {
    flexDirection: 'row',
    gap: 10,
  },
  threadLineMint: {
    width: 2,
    backgroundColor: colors.mint,
    borderRadius: 1,
    marginLeft: 10,
  },
  commentCardOP: {
    flex: 1,
    borderColor: 'rgba(0, 245, 160, 0.15)',
  },
  opHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  opBadge: {
    backgroundColor: colors.mint,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  opBadgeText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.mintTextDark,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#12141C',
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1C26',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  textInput: {
    flex: 1,
    color: colors.textWhite,
    fontSize: 12,
    padding: 0,
  },
  smileBtn: {
    padding: 2,
  },
  sendFab: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  attachBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 8,
    backgroundColor: '#12141C',
    gap: 12,
  },
  attachBtn: {
    padding: 4,
  },
});
