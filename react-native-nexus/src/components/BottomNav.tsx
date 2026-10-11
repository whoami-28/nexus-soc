// src/components/BottomNav.tsx
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { FeedLayersIcon, PlusIcon } from './SvgIcons';
import { ScreenName } from '../types';
import { useDatabase } from '../context/DatabaseContext';
import { getAvatarSource } from '../utils/assets';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onPressCreatePost?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onPressCreatePost,
}) => {
  const { currentUser } = useDatabase();

  return (
    <View style={styles.container}>
      {/* 1. Иконка ленты */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('feed')}
        activeOpacity={0.7}
      >
        <FeedLayersIcon size={22} active={currentScreen === 'feed'} />
        {currentScreen === 'feed' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* 2. Кнопка + (FAB) создания нового поста */}
      <TouchableOpacity
        style={styles.fabBtn}
        onPress={onPressCreatePost || (() => onNavigate('thread'))}
        activeOpacity={0.85}
      >
        <PlusIcon size={24} color={colors.mintTextDark} />
      </TouchableOpacity>

      {/* 3. Аватар профиля */}
      <TouchableOpacity
        style={[
          styles.profileItem,
          currentScreen === 'profile' && styles.profileItemActive,
        ]}
        onPress={() => onNavigate('profile')}
        activeOpacity={0.7}
      >
        <Image
          source={getAvatarSource(currentUser?.avatar_key)}
          style={styles.avatarImg}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(18, 20, 28, 0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.borderCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.mint,
    marginTop: 3,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  fabBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -16,
  },
  profileItem: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  profileItemActive: {
    borderColor: colors.mint,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
