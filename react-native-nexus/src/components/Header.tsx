// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { BellIcon, ChatBubbleIcon } from './SvgIcons';

interface HeaderProps {
  onPressProfile?: () => void;
  onPressLogo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPressProfile, onPressLogo }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.brand} onPress={onPressLogo} activeOpacity={0.7}>
        <View style={styles.logoBox}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImg} />
        </View>
        <Text style={styles.brandText}>NEXUS</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <BellIcon size={18} color={colors.textSecondary} />
          <View style={[styles.dot, styles.dotMint]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <ChatBubbleIcon size={17} color={colors.textSecondary} />
          <View style={[styles.dot, styles.dotPurple]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarBtn} onPress={onPressProfile} activeOpacity={0.7}>
          <Image source={require('../../assets/avatar-user.png')} style={styles.avatarImg} />
        </TouchableOpacity>
      </View>
    </View>
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
    gap: 9,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.iconBtnBg,
    borderWidth: 1,
    borderColor: colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotMint: {
    backgroundColor: colors.mint,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  dotPurple: {
    backgroundColor: '#C084FC',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 1.5,
    borderWidth: 1.5,
    borderColor: colors.purpleLight,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
});
