// src/components/PhoneSimulator.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { colors } from '../theme/colors';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ children, enabled = true }) => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const handler = ({ window }: { window: { width: number } }) => {
      setWindowWidth(window.width);
    };
    const sub = Dimensions.addEventListener('change', handler);
    return () => sub?.remove?.();
  }, []);

  // Если открыто прямо на реальном телефоне (ширина < 500px) или рамка отключена
  const isRealMobileDevice = windowWidth < 500;

  if (!enabled || Platform.OS !== 'web' || isRealMobileDevice) {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  return (
    <View style={styles.webStage}>
      {/* Фоновые декоративные сферы из макета */}
      <View style={[styles.ambientOrb, styles.orbLeft]} />
      <View style={[styles.ambientOrb, styles.orbRight]} />

      {/* Корпус смартфона */}
      <View style={styles.phoneChassis}>
        {/* Аппаратные боковые кнопки */}
        <View style={[styles.hwBtn, styles.hwBtnMute]} />
        <View style={[styles.hwBtn, styles.hwBtnVolUp]} />
        <View style={[styles.hwBtn, styles.hwBtnVolDown]} />
        <View style={[styles.hwBtn, styles.hwBtnPower]} />

        {/* Верхний динамик и фронтальная камера */}
        <View style={styles.phoneNotch}>
          <View style={styles.speakerGrill} />
          <View style={styles.cameraLens} />
        </View>

        {/* Экран смартфона с содержимым приложения */}
        <View style={styles.phoneScreen}>
          {children}
        </View>

        {/* Нижний индикатор Home Bar */}
        <View style={styles.homeBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: colors.bgApp,
    width: '100%',
    height: '100%',
  },
  webStage: {
    minHeight: '100vh' as any,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F6',
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbLeft: {
    width: 170,
    height: 170,
    left: '50%',
    marginLeft: -260,
    top: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: -10, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
  },
  orbRight: {
    width: 160,
    height: 160,
    left: '50%',
    marginLeft: 110,
    top: '38%',
    backgroundColor: 'rgba(236, 253, 245, 0.95)',
    shadowColor: colors.mint,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 35,
  },
  phoneChassis: {
    width: 390,
    height: 844,
    borderRadius: 48,
    backgroundColor: '#1E2028',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 50,
    borderWidth: 2,
    borderColor: '#2F3342',
    position: 'relative',
  },
  hwBtn: {
    position: 'absolute',
    backgroundColor: '#2D303E',
    borderRadius: 2,
  },
  hwBtnMute: {
    left: -4,
    top: 110,
    width: 3,
    height: 24,
  },
  hwBtnVolUp: {
    left: -4,
    top: 155,
    width: 3,
    height: 48,
  },
  hwBtnVolDown: {
    left: -4,
    top: 215,
    width: 3,
    height: 48,
  },
  hwBtnPower: {
    right: -4,
    top: 180,
    width: 3,
    height: 68,
  },
  phoneNotch: {
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  speakerGrill: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F1015',
  },
  cameraLens: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0A1220',
    borderWidth: 1,
    borderColor: '#1C2E4A',
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: colors.bgApp,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  homeBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
});
