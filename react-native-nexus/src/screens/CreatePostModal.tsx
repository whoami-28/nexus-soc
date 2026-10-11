// src/screens/CreatePostModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { useDatabase } from '../context/DatabaseContext';
import { createPost } from '../database/postsRepository';
import { CodeBracketsIcon, ChartBarIcon, SparkleIcon } from '../components/SvgIcons';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated?: (postId: string) => void;
}

const TOPIC_TAGS = ['КВАНТОВЫЙ_СИНТЕЗ', 'ВЕБ-ГПУ', 'СЕТИ_AI', 'АРХИТЕКТУРА', 'КИБЕРБЕЗОПАСНОСТЬ'];
const CATEGORIES: Array<{ key: 'trending' | 'subs' | 'all' | 'tech'; label: string }> = [
  { key: 'trending', label: 'В тренде' },
  { key: 'tech', label: 'Технологии' },
  { key: 'subs', label: 'Подписки' },
  { key: 'all', label: 'Все' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onPostCreated,
}) => {
  const { currentUser, notifyDataChanged } = useDatabase();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicTag, setTopicTag] = useState(TOPIC_TAGS[0]);
  const [category, setCategory] = useState<'trending' | 'subs' | 'all' | 'tech'>('trending');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeFilename, setCodeFilename] = useState('DISPATCHER.PY');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [attachTelemetry, setAttachTelemetry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Пожалуйста, введите заголовок и текст публикации');
      return;
    }

    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const newPost = await createPost(currentUser.id, {
        title: title.trim(),
        content: content.trim(),
        topic_tag: topicTag,
        category,
        code_snippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
        code_filename: showCodeInput && codeSnippet.trim() ? codeFilename.trim() : undefined,
        media_type: attachTelemetry ? 'telemetry_chart' : 'none',
        spec_badge: attachTelemetry ? 'LATENCY // SOTA -42%' : undefined,
        fps_badge: attachTelemetry ? '120 FPS // STABLE' : undefined,
      });

      notifyDataChanged();
      // Очистка формы
      setTitle('');
      setContent('');
      setCodeSnippet('');
      setShowCodeInput(false);
      setAttachTelemetry(false);
      onClose();

      if (onPostCreated) {
        onPostCreated(newPost.id);
      }
    } catch (err: any) {
      console.error('[CreatePostModal] Ошибка публикации:', err);
      setErrorMsg('Не удалось сохранить пост в SQLite');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheetContainer}>
          {/* Заголовок модального окна */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.headerTitle}>НОВАЯ ТРАНСЛЯЦИЯ В УЗЕЛ</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            )}

            {/* Выбор тега темы */}
            <Text style={styles.inputLabel}>ТЕГ СПЕЦИФИКАЦИИ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
              {TOPIC_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, topicTag === tag && styles.tagPillActive]}
                  onPress={() => setTopicTag(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagPillText, topicTag === tag && styles.tagPillTextActive]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Выбор категории */}
            <Text style={styles.inputLabel}>КАТЕГОРИЯ ЛЕНТЫ</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.catBtn, category === cat.key && styles.catBtnActive]}
                  onPress={() => setCategory(cat.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.catBtnText, category === cat.key && styles.catBtnTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Заголовок поста */}
            <Text style={styles.inputLabel}>ЗАГОЛОВОК ПУБЛИКАЦИИ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Например: Квантовая диспетчеризация узлов v4..."
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Текст поста */}
            <Text style={styles.inputLabel}>ТЕКСТ И ОПИСАНИЕ СЕТЕВОГО РЕЛИЗА</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Опишите бенчмарки, архитектурные решения или проблему..."
              placeholderTextColor={colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
            />

            {/* Дополнительные киберпанк-опции (Код и График) */}
            <Text style={styles.inputLabel}>КИБЕРПАНК-ВЛОЖЕНИЯ</Text>
            <View style={styles.attachmentRow}>
              <TouchableOpacity
                style={[styles.attachBtn, showCodeInput && styles.attachBtnActive]}
                onPress={() => setShowCodeInput(!showCodeInput)}
                activeOpacity={0.7}
              >
                <CodeBracketsIcon size={16} color={showCodeInput ? colors.mint : colors.textSecondary} />
                <Text style={[styles.attachBtnText, showCodeInput && styles.attachBtnTextActive]}>
                  {showCodeInput ? 'Скрыть терминал' : 'Добавить код'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.attachBtn, attachTelemetry && styles.attachBtnActive]}
                onPress={() => setAttachTelemetry(!attachTelemetry)}
                activeOpacity={0.7}
              >
                <ChartBarIcon size={16} color={attachTelemetry ? colors.mint : colors.textSecondary} />
                <Text style={[styles.attachBtnText, attachTelemetry && styles.attachBtnTextActive]}>
                  {attachTelemetry ? 'График SOTA добавлен' : 'График телеметрии'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Блок ввода кода */}
            {showCodeInput && (
              <View style={styles.codeTerminalBox}>
                <View style={styles.codeHeader}>
                  <View style={styles.macDots}>
                    <View style={[styles.macDot, { backgroundColor: '#EF4444' }]} />
                    <View style={[styles.macDot, { backgroundColor: '#F59E0B' }]} />
                    <View style={[styles.macDot, { backgroundColor: '#10B981' }]} />
                  </View>
                  <TextInput
                    style={styles.codeFilenameInput}
                    value={codeFilename}
                    onChangeText={setCodeFilename}
                    placeholder="FILENAME.PY"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <TextInput
                  style={styles.codeInput}
                  placeholder={`async def dispatch():\n    return await nexus.execute()`}
                  placeholderTextColor={colors.textMuted}
                  value={codeSnippet}
                  onChangeText={setCodeSnippet}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Кнопка отправки */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#041E13" />
              ) : (
                <>
                  <SparkleIcon size={16} color="#041E13" />
                  <Text style={styles.submitBtnText}>ОПУБЛИКОВАТЬ В УЗЕЛ (SQLITE)</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#12141D',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.25)',
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mint,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.mint,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  tagScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#1B1E2B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
  },
  tagPillActive: {
    backgroundColor: 'rgba(0, 245, 160, 0.15)',
    borderColor: colors.mint,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tagPillTextActive: {
    color: colors.mint,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  catBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1B1E2B',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  catBtnActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: colors.purple,
  },
  catBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  catBtnTextActive: {
    color: colors.purpleLight,
  },
  textInput: {
    backgroundColor: '#181A24',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textWhite,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  attachBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#181A24',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  attachBtnActive: {
    borderColor: colors.mint,
    backgroundColor: 'rgba(0, 245, 160, 0.1)',
  },
  attachBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  attachBtnTextActive: {
    color: colors.mint,
  },
  codeTerminalBox: {
    backgroundColor: '#090A0F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 6,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#12141C',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  macDots: {
    flexDirection: 'row',
    gap: 6,
  },
  macDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  codeFilenameInput: {
    fontSize: 11,
    color: colors.mint,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    padding: 0,
  },
  codeInput: {
    padding: 12,
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  submitBtn: {
    backgroundColor: colors.mint,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#041E13',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
