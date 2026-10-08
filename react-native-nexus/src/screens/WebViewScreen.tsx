// src/screens/WebViewScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme/colors';

interface WebViewScreenProps {
  url?: string;
  onRefresh?: () => void;
}

export const GITHUB_PAGES_URL = 'https://whoami-28.github.io/nexus-soc/';

export const WebViewScreen: React.FC<WebViewScreenProps> = ({
  url = GITHUB_PAGES_URL,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  const reloadPage = () => {
    setLoading(true);
    setLoadError(false);
    setKey((prev) => prev + 1);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarMock}>
          <Text style={styles.statusBadge}>🌐 GITHUB PAGES WEBVIEW</Text>
          <Text style={styles.statusUrl} numberOfLines={1}>{url}</Text>
        </View>
        <iframe
          src={url}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#0F1015',
          }}
          title="NEXUS Web View"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBarMock}>
        <Text style={styles.statusBadge}>🌐 GITHUB PAGES WEBVIEW</Text>
        <Text style={styles.statusUrl} numberOfLines={1}>{url}</Text>
        <TouchableOpacity onPress={reloadPage} style={styles.reloadBtn}>
          <Text style={styles.reloadBtnText}>↻ Обновить</Text>
        </TouchableOpacity>
      </View>

      <WebView
        key={key}
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        onLoadStart={() => {
          setLoading(true);
          setLoadError(false);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.mint} />
            <Text style={styles.loadingText}>Загрузка веб-приложения с GitHub Pages...</Text>
            <Text style={styles.urlText}>{url}</Text>
          </View>
        )}
      />

      {loadError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Ожидание деплоя GitHub Pages</Text>
          <Text style={styles.errorDesc}>
            Если репозиторий только что был опубликован, GitHub Pages может запускать сборку до 1-2 минут.
          </Text>
          <Text style={styles.errorUrl}>{url}</Text>
          <TouchableOpacity onPress={reloadPage} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Повторить попытку</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1015',
  },
  statusBarMock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#12141D',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mint,
    letterSpacing: 0.5,
  },
  statusUrl: {
    flex: 1,
    fontSize: 11,
    color: '#94A3B8',
  },
  reloadBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 245, 160, 0.12)',
  },
  reloadBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mint,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0F1015',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F1015',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: 12,
    padding: 20,
  },
  loadingText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  urlText: {
    color: colors.mint,
    fontSize: 12,
    textAlign: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F1015',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  errorTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorDesc: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorUrl: {
    color: colors.mint,
    fontSize: 12,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.mint,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#041E13',
    fontWeight: '700',
    fontSize: 13,
  },
});
