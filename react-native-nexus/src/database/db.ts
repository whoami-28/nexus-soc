// src/database/db.ts
import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';
import {
  SEED_USERS,
  SEED_POSTS,
  SEED_COMMENTS,
  SEED_NOTIFICATIONS,
  SEED_BOUNTIES,
} from './seedData';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('nexus.db');
  }
  return dbInstance;
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await getDB();

  // 1. Создаем структуру таблиц
  await db.execAsync(CREATE_TABLES_SQL);

  // 2. Проверяем, есть ли уже данные пользователей
  const userCountResult = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users;'
  );

  if (!userCountResult || userCountResult.count === 0) {
    console.log('[SQLite] База данных пуста. Запускаем сидирование начальных данных...');
    await seedDatabase(db);
  }

  return db;
}

async function seedDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  // Наполнение пользователей
  for (const u of SEED_USERS) {
    await db.runAsync(
      `INSERT INTO users (id, handle, name, avatar_key, bio, github_url, matrix_url, verified, status_label, rep_score, audits_count, bounties_count, commits_count, network_rank, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        u.id,
        u.handle,
        u.name,
        u.avatar_key,
        u.bio,
        u.github_url,
        u.matrix_url,
        u.verified ? 1 : 0,
        u.status_label,
        u.rep_score,
        u.audits_count,
        u.bounties_count,
        u.commits_count,
        u.network_rank,
        u.created_at,
      ]
    );
  }

  // Наполнение постов
  for (const p of SEED_POSTS) {
    await db.runAsync(
      `INSERT INTO posts (id, author_id, topic_tag, category, title, content, code_snippet, code_filename, media_type, media_key, spec_badge, fps_badge, upvotes, downvotes, comments_count, reposts_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        p.id,
        p.author_id,
        p.topic_tag,
        p.category,
        p.title,
        p.content,
        p.code_snippet ?? null,
        p.code_filename ?? null,
        p.media_type,
        p.media_key ?? null,
        p.spec_badge ?? null,
        p.fps_badge ?? null,
        p.upvotes,
        p.downvotes,
        p.comments_count,
        p.reposts_count,
        p.created_at,
      ]
    );
  }

  // Наполнение комментариев
  for (const c of SEED_COMMENTS) {
    await db.runAsync(
      `INSERT INTO comments (id, post_id, author_id, parent_id, content, code_snippet, upvotes, depth, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        c.id,
        c.post_id,
        c.author_id,
        c.parent_id ?? null,
        c.content,
        c.code_snippet ?? null,
        c.upvotes,
        c.depth,
        c.created_at,
      ]
    );
  }

  // Наполнение уведомлений
  for (const n of SEED_NOTIFICATIONS) {
    await db.runAsync(
      `INSERT INTO notifications (id, user_id, actor_id, type, title, body, target_post_id, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        n.id,
        n.user_id,
        n.actor_id,
        n.type,
        n.title,
        n.body,
        n.target_post_id ?? null,
        n.is_read ? 1 : 0,
        n.created_at,
      ]
    );
  }

  // Наполнение наград
  for (const b of SEED_BOUNTIES) {
    await db.runAsync(
      `INSERT INTO bounties (id, title, reward_amount, description, difficulty, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [b.id, b.title, b.reward_amount, b.description, b.difficulty, b.status, b.created_at]
    );
  }

  // Базовые взаимодействия текущего пользователя (закладка на пост 2)
  await db.runAsync(
    `INSERT INTO user_interactions (id, user_id, target_type, target_id, vote_type, is_bookmarked, is_reposted, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    ['int_1', 'user_elena', 'post', 'post_zeno_nexus', 1, 1, 0, Date.now()]
  );

  console.log('[SQLite] Начальное сидирование базы данных NEXUS успешно завершено.');
}

export async function resetDatabase(): Promise<void> {
  const db = await getDB();
  await db.execAsync(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS user_interactions;
    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS bounties;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
  `);
  await initDatabase();
}
