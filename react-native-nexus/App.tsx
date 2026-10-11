// App.tsx
import React, { useState } from 'react';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';
import { ScreenName } from './src/types';
import { DatabaseProvider } from './src/context/DatabaseContext';
import { FeedScreen } from './src/screens/FeedScreen';
import { ThreadScreen } from './src/screens/ThreadScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { WebViewScreen } from './src/screens/WebViewScreen';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('feed');
  const [selectedPostId, setSelectedPostId] = useState<string>('post_kira_telemetry');

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'feed':
        return (
          <FeedScreen
            onNavigate={setCurrentScreen}
            onSelectPost={handleSelectPost}
          />
        );
      case 'thread':
        return (
          <ThreadScreen
            postId={selectedPostId}
            onNavigate={setCurrentScreen}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={setCurrentScreen}
            onSelectPost={handleSelectPost}
          />
        );
      case 'webview':
        return <WebViewScreen />;
      default:
        return (
          <FeedScreen
            onNavigate={setCurrentScreen}
            onSelectPost={handleSelectPost}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0D13" />

      {/* Верхняя навигационная панель переключения экранов */}
      <View style={styles.topSwitcher}>
        <View style={styles.screenButtons}>
          <TouchableOpacity
            style={[styles.switchBtn, currentScreen === 'feed' && styles.switchBtnActive]}
            onPress={() => setCurrentScreen('feed')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switchText, currentScreen === 'feed' && styles.switchTextActive]}>
              📱 Лента (SQLite)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchBtn, currentScreen === 'thread' && styles.switchBtnActive]}
            onPress={() => setCurrentScreen('thread')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switchText, currentScreen === 'thread' && styles.switchTextActive]}>
              💬 Ветка
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchBtn, currentScreen === 'profile' && styles.switchBtnActive]}
            onPress={() => setCurrentScreen('profile')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switchText, currentScreen === 'profile' && styles.switchTextActive]}>
              👤 Профиль
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchBtn, currentScreen === 'webview' && styles.switchBtnActive]}
            onPress={() => setCurrentScreen('webview')}
            activeOpacity={0.7}
          >
            <Text style={[styles.switchText, currentScreen === 'webview' && styles.switchTextActive]}>
              🌐 WebView (ЛР6)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.screenContainer}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0D13',
  },
  topSwitcher: {
    backgroundColor: '#141620',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 100,
  },
  screenButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  switchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#1E212E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  switchBtnActive: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  switchText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  switchTextActive: {
    color: colors.mintTextDark,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0C0D13',
  },
});
