// src/screens/EditProfileModal.tsx
import React, { useState, useEffect } from 'react';
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
import { updateUserProfile } from '../database/usersRepository';
import { EditPencilIcon } from '../components/SvgIcons';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const { currentUser, refreshCurrentUser, notifyDataChanged } = useDatabase();

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [statusLabel, setStatusLabel] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [matrixUrl, setMatrixUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setHandle(currentUser.handle);
      setBio(currentUser.bio);
      setStatusLabel(currentUser.status_label);
      setGithubUrl(currentUser.github_url);
      setMatrixUrl(currentUser.matrix_url);
    }
  }, [currentUser, visible]);

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      setIsSaving(true);
      await updateUserProfile(currentUser.id, {
        name: name.trim() || currentUser.name,
        handle: handle.trim() || currentUser.handle,
        bio: bio.trim(),
        status_label: statusLabel.trim() || 'ONLINE',
        github_url: githubUrl.trim(),
        matrix_url: matrixUrl.trim(),
      });
      await refreshCurrentUser();
      notifyDataChanged();
      onClose();
    } catch (err) {
      console.error('[EditProfileModal] Ошибка сохранения профиля:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <EditPencilIcon size={14} color={colors.mint} />
              <Text style={styles.headerTitle}>РЕДАКТИРОВАНИЕ ПРОФИЛЯ</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>ОТОБРАЖАЕМОЕ ИМЯ</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Elena Rostova"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>СЕТЕВОЙ ХЭНДЛ</Text>
            <TextInput
              style={styles.textInput}
              value={handle}
              onChangeText={setHandle}
              placeholder="@elena_dev"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>СТАТУС ДОСТУПНОСТИ</Text>
            <TextInput
              style={styles.textInput}
              value={statusLabel}
              onChangeText={setStatusLabel}
              placeholder="AVAILABLE FOR AUDITS"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>БИОГРАФИЯ И СПЕЦИАЛИЗАЦИЯ</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Фулстек AI-архитектор..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>GITHUB РЕПОЗИТОРИЙ</Text>
            <TextInput
              style={styles.textInput}
              value={githubUrl}
              onChangeText={setGithubUrl}
              placeholder="github.com/elena-core"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>MATRIX УЗЕЛ</Text>
            <TextInput
              style={styles.textInput}
              value={matrixUrl}
              onChangeText={setMatrixUrl}
              placeholder="elena.nexus/matrix"
              placeholderTextColor={colors.textMuted}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#041E13" />
              ) : (
                <Text style={styles.saveBtnText}>СОХРАНИТЬ В SQLITE</Text>
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
    maxHeight: '88%',
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
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#181A24',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textWhite,
    fontSize: 13,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  saveBtn: {
    backgroundColor: colors.mint,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#041E13',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
