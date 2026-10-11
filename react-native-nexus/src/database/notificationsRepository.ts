// src/database/notificationsRepository.ts
import { getDB } from './db';
import { NotificationItem, User } from '../types';

interface NotificationRow {
  id: string;
  user_id: string;
  actor_id: string;
  type: string;
  title: string;
  body: string;
  target_post_id: string | null;
  is_read: number;
  created_at: number;
  // Actor columns
  a_id: string;
  a_handle: string;
  a_name: string;
  a_avatar_key: string;
}

export async function getNotifications(
  userId: string = 'user_elena'
): Promise<NotificationItem[]> {
  const db = await getDB();
  const sql = `
    SELECT 
      n.*,
      u.id as a_id,
      u.handle as a_handle,
      u.name as a_name,
      u.avatar_key as a_avatar_key
    FROM notifications n
    JOIN users u ON n.actor_id = u.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC;
  `;

  const rows = await db.getAllAsync<NotificationRow>(sql, [userId]);
  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    actor_id: r.actor_id,
    type: r.type as any,
    title: r.title,
    body: r.body,
    target_post_id: r.target_post_id ?? undefined,
    is_read: Boolean(r.is_read),
    created_at: r.created_at,
    actor: {
      id: r.a_id,
      handle: r.a_handle,
      name: r.a_name,
      avatar_key: r.a_avatar_key,
      bio: '',
      github_url: '',
      matrix_url: '',
      verified: true,
      status_label: '',
      rep_score: 0,
      audits_count: 0,
      bounties_count: 0,
      commits_count: 0,
      network_rank: '',
      created_at: 0,
    },
  }));
}

export async function getUnreadNotificationsCount(
  userId: string = 'user_elena'
): Promise<number> {
  const db = await getDB();
  const res = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0;`,
    [userId]
  );
  return res ? res.count : 0;
}

export async function markNotificationsAsRead(
  userId: string = 'user_elena'
): Promise<void> {
  const db = await getDB();
  await db.runAsync(`UPDATE notifications SET is_read = 1 WHERE user_id = ?;`, [userId]);
}
