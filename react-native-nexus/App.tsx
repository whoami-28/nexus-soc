// App.tsx
import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
        return <WebViewScreen onBack={() => setCurrentScreen('feed')} />;
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
  screenContainer: {
    flex: 1,
    backgroundColor: '#0C0D13',
  },
});
