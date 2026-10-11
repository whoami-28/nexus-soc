// src/database/usersRepository.ts
import { getDB } from './db';
import { User, UpdateProfileDTO } from '../types';

interface UserRow {
  id: string;
  handle: string;
  name: string;
  avatar_key: string;
  bio: string;
  github_url: string;
  matrix_url: string;
  verified: number;
  status_label: string;
  rep_score: number;
  audits_count: number;
  bounties_count: number;
  commits_count: number;
  network_rank: string;
  created_at: number;
}

function mapRowToUser(row: UserRow): User {
  return {
    id: row.id,
    handle: row.handle,
    name: row.name,
    avatar_key: row.avatar_key,
    bio: row.bio,
    github_url: row.github_url,
    matrix_url: row.matrix_url,
    verified: Boolean(row.verified),
    status_label: row.status_label,
    rep_score: row.rep_score,
    audits_count: row.audits_count,
    bounties_count: row.bounties_count,
    commits_count: row.commits_count,
    network_rank: row.network_rank,
    created_at: row.created_at,
  };
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDB();
  const row = await db.getFirstAsync<UserRow>(
    `SELECT * FROM users WHERE id = ? LIMIT 1;`,
    [userId]
  );
  if (!row) return null;
  return mapRowToUser(row);
}

export async function getAllUsers(): Promise<User[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<UserRow>(`SELECT * FROM users ORDER BY rep_score DESC;`);
  return rows.map(mapRowToUser);
}

export async function updateUserProfile(
  userId: string,
  dto: UpdateProfileDTO
): Promise<User> {
  const db = await getDB();
  await db.runAsync(
    `UPDATE users 
     SET name = ?, handle = ?, bio = ?, status_label = ?, github_url = ?, matrix_url = ?
     WHERE id = ?;`,
    [
      dto.name,
      dto.handle,
      dto.bio,
      dto.status_label,
      dto.github_url,
      dto.matrix_url,
      userId,
    ]
  );

  const updated = await getUserById(userId);
  return updated!;
}
