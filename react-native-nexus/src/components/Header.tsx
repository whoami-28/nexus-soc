// src/components/Header.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { BellIcon, ChatBubbleIcon } from './SvgIcons';
import { useDatabase } from '../context/DatabaseContext';
import { getAvatarSource } from '../utils/assets';
import { NotificationsModal } from '../screens/NotificationsModal';

interface HeaderProps {
  onPressProfile?: () => void;
  onPressLogo?: () => void;
  onOpenPost?: (postId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onPressProfile, onPressLogo, onOpenPost }) => {
  const { currentUser, unreadCount } = useDatabase();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.brand} onPress={onPressLogo} activeOpacity={0.7}>
          <View style={styles.logoBox}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImg} />
          </View>
          <Text style={styles.brandText}>NEXUS</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          {/* Колокольчик уведомлений */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowNotifications(true)}
            activeOpacity={0.7}
          >
            <BellIcon size={18} color={colors.textSecondary} />
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            ) : (
              <View style={[styles.dot, styles.dotMint]} />
            )}
          </TouchableOpacity>

          {/* Иконка чата / сети */}
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.7}
            onPress={() => setShowNotifications(true)}
          >
            <ChatBubbleIcon size={17} color={colors.textSecondary} />
            <View style={[styles.dot, styles.dotPurple]} />
          </TouchableOpacity>

          {/* Аватар профиля */}
          <TouchableOpacity style={styles.avatarBtn} onPress={onPressProfile} activeOpacity={0.7}>
            <Image
              source={getAvatarSource(currentUser?.avatar_key)}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        onOpenPost={onOpenPost}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(18, 19, 26, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    zIndex: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#060709',
    borderWidth: 1,
    borderColor: colors.borderCard,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  brandText: {
    fontFamily: 'Space Grotesk, sans-serif, -apple-system',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.textWhite,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.iconBtnBg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotMint: {
    backgroundColor: colors.mint,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  dotPurple: {
    backgroundColor: colors.purpleLight,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.mint,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  unreadBadgeText: {
    color: '#041E13',
    fontSize: 8,
    fontWeight: '800',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.mint,
    overflow: 'hidden',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
