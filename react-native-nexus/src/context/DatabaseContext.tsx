// src/context/DatabaseContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase, resetDatabase } from '../database/db';
import { getUserById } from '../database/usersRepository';
import { getUnreadNotificationsCount } from '../database/notificationsRepository';
import { User } from '../types';
import { colors } from '../theme/colors';

interface DatabaseContextValue {
  isReady: boolean;
  currentUser: User | null;
  unreadCount: number;
  dataVersion: number;
  notifyDataChanged: () => void;
  refreshCurrentUser: () => Promise<void>;
  resetDB: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dataVersion, setDataVersion] = useState(0);
  const [initError, setInitError] = useState<string | null>(null);

  const notifyDataChanged = useCallback(() => {
    setDataVersion((v) => v + 1);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!currentUser) return;
    try {
      const updated = await getUserById(currentUser.id);
      if (updated) setCurrentUser(updated);
      const count = await getUnreadNotificationsCount(currentUser.id);
      setUnreadCount(count);
    } catch (err) {
      console.error('[DatabaseContext] Ошибка обновления пользователя:', err);
    }
  }, [currentUser]);

  const switchUser = useCallback(async (userId: string) => {
    try {
      const u = await getUserById(userId);
      if (u) {
        setCurrentUser(u);
        const count = await getUnreadNotificationsCount(u.id);
        setUnreadCount(count);
        notifyDataChanged();
      }
    } catch (err) {
      console.error('[DatabaseContext] Ошибка переключения пользователя:', err);
    }
  }, [notifyDataChanged]);

  const handleResetDB = useCallback(async () => {
    try {
      setIsReady(false);
      await resetDatabase();
      const elena = await getUserById('user_elena');
      setCurrentUser(elena);
      const count = await getUnreadNotificationsCount('user_elena');
      setUnreadCount(count);
      setIsReady(true);
      notifyDataChanged();
    } catch (err: any) {
      console.error('[DatabaseContext] Ошибка сброса БД:', err);
    }
  }, [notifyDataChanged]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initDatabase();
        const user = await getUserById('user_elena');
        const count = await getUnreadNotificationsCount('user_elena');
        if (mounted) {
          setCurrentUser(user);
          setUnreadCount(count);
          setIsReady(true);
        }
      } catch (err: any) {
        console.error('[DatabaseContext] Ошибка инициализации SQLite:', err);
        if (mounted) setInitError(err.message || 'Ошибка запуска базы данных');
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (initError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Критическая ошибка базы данных SQLite</Text>
        <Text style={styles.errorSub}>{initError}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.mint} />
        <Text style={styles.loadingTitle}>ИНИЦИАЛИЗАЦИЯ ЯДРА NEXUS</Text>
        <Text style={styles.loadingSub}>Подключение локального хранилища SQLite...</Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider
      value={{
        isReady,
        currentUser,
        unreadCount,
        dataVersion,
        notifyDataChanged,
        refreshCurrentUser,
        resetDB: handleResetDB,
        switchUser,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export function useDatabase(): DatabaseContextValue {
  const ctx = useContext(DatabaseContext);
  if (!ctx) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#0C0D13',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingTitle: {
    color: colors.mint,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  loadingSub: {
    color: colors.textMuted,
    fontSize: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  errorSub: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
