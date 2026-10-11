// src/screens/ThreadScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import { ScreenName, PostItem, CommentItemData } from '../types';
import { useDatabase } from '../context/DatabaseContext';
import {
  getPostById,
  togglePostVote,
  togglePostBookmark,
} from '../database/postsRepository';
import {
  getCommentsByPostId,
  createComment,
  toggleCommentVote,
} from '../database/commentsRepository';
import { getAvatarSource } from '../utils/assets';

interface ThreadScreenProps {
  postId?: string;
  onNavigate: (screen: ScreenName) => void;
}

export const ThreadScreen: React.FC<ThreadScreenProps> = ({
  postId = 'post_kira_telemetry',
  onNavigate,
}) => {
  const { currentUser, dataVersion, notifyDataChanged } = useDatabase();

  const [post, setPost] = useState<PostItem | null>(null);
  const [comments, setComments] = useState<CommentItemData[]>([]);
  const [commentFilter, setCommentFilter] = useState<'best' | 'new'>('best');
  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  const loadThreadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const postData = await getPostById(postId, currentUser?.id);
      setPost(postData);
      const commentItems = await getCommentsByPostId(postId, commentFilter, currentUser?.id);
      setComments(commentItems);
    } catch (err) {
      console.error('[ThreadScreen] Ошибка загрузки треда:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, commentFilter, currentUser?.id]);

  useEffect(() => {
    loadThreadData();
  }, [loadThreadData, dataVersion]);

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostVote = async (delta: 1 | -1) => {
    if (!currentUser || !post) return;
    try {
      await togglePostVote(post.id, currentUser.id, delta);
      notifyDataChanged();
    } catch (err) {
      console.error('[ThreadScreen] Ошибка голосования:', err);
    }
  };

  const handlePostBookmark = async () => {
    if (!currentUser || !post) return;
    try {
      await togglePostBookmark(post.id, currentUser.id);
      notifyDataChanged();
    } catch (err) {
      console.error('[ThreadScreen] Ошибка закладки:', err);
    }
  };

  const handleSendComment = async () => {
    if (!replyText.trim() || !currentUser || !post) return;
    try {
      setIsSending(true);
      await createComment(currentUser.id, {
        post_id: post.id,
        parent_id: replyingToCommentId,
        content: replyText.trim(),
        depth: replyingToCommentId ? 1 : 0,
      });
      setReplyText('');
      setReplyingToCommentId(null);
      notifyDataChanged();
    } catch (err) {
      console.error('[ThreadScreen] Ошибка отправки комментария:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCommentVote = async (commentId: string) => {
    if (!currentUser) return;
    try {
      await toggleCommentVote(commentId, currentUser.id);
      notifyDataChanged();
    } catch (err) {
      console.error('[ThreadScreen] Ошибка голосования за комментарий:', err);
    }
  };

  const formatUpvotes = (num: number) => {
    if (num >= 1000) return `+${(num / 1000).toFixed(1)}k`;
    return `+${num}`;
  };

  if (isLoading && !post) {
    return (
      <View style={[styles.container, styles.centerBox]}>
        <ActivityIndicator size="large" color={colors.mint} />
        <Text style={styles.loadingText}>Загрузка ветки обсуждения...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, styles.centerBox]}>
        <Text style={styles.errorText}>Публикация не найдена в SQLite</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => onNavigate('feed')}>
          <Text style={styles.backHomeBtnText}>Вернуться в ленту</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Шапка ветки */}
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
            <Image
              source={getAvatarSource(currentUser?.avatar_key)}
              style={styles.avatarImg}
            />
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
            <Image
              source={getAvatarSource(post.author.avatar_key)}
              style={styles.authorAvatar}
            />
          </View>
          <View style={styles.authorInfo}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              {post.author.verified && <VerifiedBadge size={14} />}
            </View>
            <Text style={styles.authorHandle}>{post.author.handle}</Text>
          </View>
        </View>

        {/* Заголовок и текст поста */}
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postBody}>{post.content}</Text>

        {/* Терминальный блок кода (если есть сниппет) */}
        {post.code_snippet && (
          <View style={styles.codeBlock}>
            <View style={styles.codeHeader}>
              <View style={styles.dotsRow}>
                <View style={[styles.cDot, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.cDot, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.cDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.codeFilename}>
                  {post.code_filename || 'MESH_DISPATCHER.PY'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.copyBtn}
                onPress={handleCopyCode}
                activeOpacity={0.7}
              >
                <CopyIcon size={14} color={copied ? colors.mint : colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.codeBody}>
              <Text style={styles.codeText}>{post.code_snippet}</Text>
            </View>
          </View>
        )}

        {/* Панель реакций на пост */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.votePill, post.isUpvoted && styles.votePillActive]}
            onPress={() => handlePostVote(1)}
            activeOpacity={0.7}
          >
            <ArrowUpVoteIcon size={13} color={colors.mintTextDark} />
            <Text style={styles.voteCountText}>{formatUpvotes(post.upvotes)}</Text>
            <ArrowDownVoteIcon size={13} color={colors.mintTextDark} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <RepostIcon size={14} color={colors.textSecondary} />
            <Text style={styles.actionBtnText}>{post.reposts_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, post.isBookmarked && styles.actionBtnSaved]}
            onPress={handlePostBookmark}
            activeOpacity={0.7}
          >
            <BookmarkIcon
              size={14}
              color={post.isBookmarked ? colors.purpleLight : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <ShareIcon size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Разделитель */}
        <View style={styles.divider} />

        {/* Шапка секции комментариев */}
        <View style={styles.commentsHeader}>
          <View style={styles.commentsCountRow}>
            <Text style={styles.commentsTitle}>Комментарии</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{comments.length}</Text>
            </View>
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterBtn, commentFilter === 'best' && styles.filterBtnActive]}
              onPress={() => setCommentFilter('best')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  commentFilter === 'best' && styles.filterBtnTextActive,
                ]}
              >
                Лучшие
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, commentFilter === 'new' && styles.filterBtnActive]}
              onPress={() => setCommentFilter('new')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  commentFilter === 'new' && styles.filterBtnTextActive,
                ]}
              >
                Новые
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Дерево комментариев из SQLite */}
        {comments.length === 0 ? (
          <View style={styles.emptyCommentsBox}>
            <Text style={styles.emptyCommentsText}>
              Пока нет комментариев. Оставьте первый ответ в сети!
            </Text>
          </View>
        ) : (
          comments.map((comment) => {
            const isOP = comment.author_id === post.author_id;
            const isIndented = comment.depth > 0;

            return (
              <View
                key={comment.id}
                style={[
                  styles.commentCard,
                  isIndented && {
                    marginLeft: 22 * comment.depth,
                    borderLeftColor: isOP ? colors.mint : colors.purple,
                    borderLeftWidth: 2,
                    paddingLeft: 12,
                  },
                ]}
              >
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatarBox}>
                    <Image
                      source={getAvatarSource(comment.author.avatar_key)}
                      style={styles.commentAvatar}
                    />
                  </View>

                  <View style={styles.commentAuthorMeta}>
                    <View style={styles.cNameRow}>
                      <Text style={styles.commentAuthorName}>{comment.author.name}</Text>
                      {comment.author.verified && <VerifiedBadge size={12} />}
                      {isOP && (
                        <View style={styles.opBadge}>
                          <Text style={styles.opBadgeText}>OP</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.commentHandle}>{comment.author.handle}</Text>
                  </View>

                  <TouchableOpacity style={styles.commentMoreBtn}>
                    <MoreDotsIcon size={14} color={colors.textDim} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.commentContent}>{comment.content}</Text>

                <View style={styles.commentFooter}>
                  <TouchableOpacity
                    style={[styles.cVotePill, comment.isUpvoted && styles.cVotePillActive]}
                    onPress={() => handleCommentVote(comment.id)}
                    activeOpacity={0.7}
                  >
                    <ArrowUpVoteIcon
                      size={11}
                      color={comment.isUpvoted ? colors.mint : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.cVoteCount,
                        comment.isUpvoted && { color: colors.mint, fontWeight: '700' },
                      ]}
                    >
                      {formatUpvotes(comment.upvotes)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.replyBtn}
                    onPress={() => {
                      setReplyingToCommentId(comment.id);
                      setReplyText(`@${comment.author.handle.replace('@', '')} `);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.replyBtnText}>Ответить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Фиксированная нижняя панель ввода ответа */}
      <View style={styles.bottomBar}>
        {replyingToCommentId && (
          <View style={styles.replyingBar}>
            <Text style={styles.replyingText}>Ответ на комментарий</Text>
            <TouchableOpacity onPress={() => setReplyingToCommentId(null)}>
              <Text style={styles.replyingCancel}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.replyInput}
            placeholder={`Ответить в ветку...`}
            placeholderTextColor={colors.textMuted}
            value={replyText}
            onChangeText={setReplyText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendBtn, (!replyText.trim() || isSending) && styles.sendBtnDisabled]}
            onPress={handleSendComment}
            disabled={!replyText.trim() || isSending}
            activeOpacity={0.8}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#041E13" />
            ) : (
              <PaperPlaneIcon size={16} color="#041E13" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.mediaToolbar}>
          <TouchableOpacity style={styles.toolIconBtn}>
            <ImageIcon size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIconBtn}>
            <CodeBracketsIcon size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIconBtn}>
            <ChartBarIcon size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolIconBtn}>
            <SmileIcon size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D13',
  },
  centerBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  backHomeBtn: {
    backgroundColor: colors.mint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  backHomeBtnText: {
    color: '#041E13',
    fontWeight: '700',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(18, 19, 26, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    zIndex: 10,
  },
  backBtn: {
    padding: 6,
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
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.iconBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.mint,
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    color: colors.textWhite,
    marginBottom: 10,
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDim,
    marginLeft: 6,
  },
  copyBtn: {
    padding: 3,
  },
  codeBody: {
    padding: 12,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    lineHeight: 17,
    color: '#E2E8F0',
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: colors.mintTextDark,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#181922',
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  actionBtnSaved: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: colors.purple,
  },
  actionBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  commentsCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#202330',
  },
  countBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: colors.mint,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#181922',
  },
  filterBtnActive: {
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderWidth: 1,
    borderColor: colors.mint,
  },
  filterBtnText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: colors.mint,
  },
  emptyCommentsBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyCommentsText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  commentCard: {
    backgroundColor: '#141620',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  commentAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  commentAvatar: {
    width: '100%',
    height: '100%',
  },
  commentAuthorMeta: {
    flex: 1,
  },
  cNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
  },
  opBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderWidth: 1,
    borderColor: colors.mint,
  },
  opBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.mint,
  },
  commentHandle: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    color: colors.textMuted,
  },
  commentMoreBtn: {
    padding: 4,
  },
  commentContent: {
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cVotePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1B1E2A',
  },
  cVotePillActive: {
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderWidth: 1,
    borderColor: colors.mint,
  },
  cVoteCount: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    color: colors.textSecondary,
  },
  replyBtn: {
    paddingVertical: 4,
  },
  replyBtnText: {
    fontSize: 11,
    color: colors.mint,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#12141C',
    borderTopWidth: 1,
    borderTopColor: colors.borderCard,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  replyingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
  },
  replyingText: {
    fontSize: 11,
    color: colors.mint,
    fontWeight: '600',
  },
  replyingCancel: {
    fontSize: 12,
    color: colors.textMuted,
    paddingHorizontal: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#181A24',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: colors.textWhite,
    fontSize: 13,
    maxHeight: 80,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  mediaToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  toolIconBtn: {
    padding: 2,
  },
});
