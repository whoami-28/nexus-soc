// App.tsx
import React, { useState } from 'react';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';
import { ScreenName } from './src/types';
import { FeedScreen } from './src/screens/FeedScreen';
import { ThreadScreen } from './src/screens/ThreadScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { WebViewScreen } from './src/screens/WebViewScreen';
import { PhoneSimulator } from './src/components/PhoneSimulator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('webview');
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(true);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'webview':
        return <WebViewScreen />;
      case 'feed':
        return <FeedScreen onNavigate={setCurrentScreen} />;
      case 'thread':
        return <ThreadScreen onNavigate={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen onNavigate={setCurrentScreen} />;
      default:
        return <WebViewScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#12131A" />

        {/* Панель навигации между экранами (для ЛР 6 и предыдущих макетов) */}
        <View style={styles.topSwitcher}>
          <View style={styles.screenButtons}>
            <TouchableOpacity
              style={[styles.switchBtn, currentScreen === 'webview' && styles.switchBtnActive]}
              onPress={() => setCurrentScreen('webview')}
              activeOpacity={0.7}
            >
              <Text style={[styles.switchText, currentScreen === 'webview' && styles.switchTextActive]}>
                🌐 ЛР 6: WebView (GitHub Pages)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switchBtn, currentScreen === 'feed' && styles.switchBtnActive]}
              onPress={() => setCurrentScreen('feed')}
              activeOpacity={0.7}
            >
              <Text style={[styles.switchText, currentScreen === 'feed' && styles.switchTextActive]}>
                📱 1. Лента
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switchBtn, currentScreen === 'thread' && styles.switchBtnActive]}
              onPress={() => setCurrentScreen('thread')}
              activeOpacity={0.7}
            >
              <Text style={[styles.switchText, currentScreen === 'thread' && styles.switchTextActive]}>
                💬 2. Ветка
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switchBtn, currentScreen === 'profile' && styles.switchBtnActive]}
              onPress={() => setCurrentScreen('profile')}
              activeOpacity={0.7}
            >
              <Text style={[styles.switchText, currentScreen === 'profile' && styles.switchTextActive]}>
                👤 3. Профиль
              </Text>
            </TouchableOpacity>
          </View>

          {Platform.OS === 'web' && (
            <TouchableOpacity
              style={[styles.frameToggleBtn, usePhoneFrame && styles.frameToggleBtnActive]}
              onPress={() => setUsePhoneFrame(!usePhoneFrame)}
              activeOpacity={0.7}
            >
              <Text style={styles.frameToggleText}>
                {usePhoneFrame ? '📲 Рамка телефона: ВКЛ' : '🖥️ Рамка: ВЫКЛ'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Обертка симулятора смартфона */}
        <PhoneSimulator enabled={usePhoneFrame}>
          {renderScreen()}
        </PhoneSimulator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F1016',
  },
  topSwitcher: {
    backgroundColor: '#161822',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 100,
  },
  screenButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  switchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#202330',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  switchBtnActive: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  switchTextActive: {
    color: colors.mintTextDark,
    fontWeight: '700',
  },
  frameToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#292B3A',
  },
  frameToggleBtnActive: {
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 160, 0.4)',
  },
  frameToggleText: {
    fontSize: 11,
    color: '#D1D5DB',
    fontWeight: '600',
  },
});
