// src/database/commentsRepository.ts
import { getDB } from './db';
import { CommentItemData, CreateCommentDTO, User } from '../types';

interface CommentRow {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  code_snippet: string | null;
  upvotes: number;
  depth: number;
  created_at: number;
  // User columns
  u_id: string;
  u_handle: string;
  u_name: string;
  u_avatar_key: string;
  u_bio: string;
  u_github_url: string;
  u_matrix_url: string;
  u_verified: number;
  u_status_label: string;
  u_rep_score: number;
  u_audits_count: number;
  u_bounties_count: number;
  u_commits_count: number;
  u_network_rank: string;
  u_created_at: number;
  // Interaction
  vote_type?: number | null;
}

function mapRowToComment(row: CommentRow): CommentItemData {
  const author: User = {
    id: row.u_id,
    handle: row.u_handle,
    name: row.u_name,
    avatar_key: row.u_avatar_key,
    bio: row.u_bio,
    github_url: row.u_github_url,
    matrix_url: row.u_matrix_url,
    verified: Boolean(row.u_verified),
    status_label: row.u_status_label,
    rep_score: row.u_rep_score,
    audits_count: row.u_audits_count,
    bounties_count: row.u_bounties_count,
    commits_count: row.u_commits_count,
    network_rank: row.u_network_rank,
    created_at: row.u_created_at,
  };

  return {
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    parent_id: row.parent_id,
    content: row.content,
    code_snippet: row.code_snippet ?? undefined,
    upvotes: row.upvotes,
    depth: row.depth,
    created_at: row.created_at,
    author,
    isUpvoted: row.vote_type === 1,
  };
}

export async function getCommentsByPostId(
  postId: string,
  sortBy: 'best' | 'new' = 'best',
  currentUserId: string = 'user_elena'
): Promise<CommentItemData[]> {
  const db = await getDB();
  let sql = `
    SELECT 
      c.*,
      u.id as u_id,
      u.handle as u_handle,
      u.name as u_name,
      u.avatar_key as u_avatar_key,
      u.bio as u_bio,
      u.github_url as u_github_url,
      u.matrix_url as u_matrix_url,
      u.verified as u_verified,
      u.status_label as u_status_label,
      u.rep_score as u_rep_score,
      u.audits_count as u_audits_count,
      u.bounties_count as u_bounties_count,
      u.commits_count as u_commits_count,
      u.network_rank as u_network_rank,
      u.created_at as u_created_at,
      ui.vote_type
    FROM comments c
    JOIN users u ON c.author_id = u.id
    LEFT JOIN user_interactions ui ON ui.target_id = c.id AND ui.target_type = 'comment' AND ui.user_id = ?
    WHERE c.post_id = ?
  `;

  if (sortBy === 'best') {
    sql += ' ORDER BY c.upvotes DESC, c.created_at ASC;';
  } else {
    sql += ' ORDER BY c.created_at DESC;';
  }

  const rows = await db.getAllAsync<CommentRow>(sql, [currentUserId, postId]);
  return rows.map(mapRowToComment);
}

export async function createComment(
  authorId: string,
  dto: CreateCommentDTO
): Promise<CommentItemData> {
  const db = await getDB();
  const newId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();
  const depth = dto.depth ?? (dto.parent_id ? 1 : 0);

  await db.runAsync(
    `INSERT INTO comments (id, post_id, author_id, parent_id, content, code_snippet, upvotes, depth, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?);`,
    [
      newId,
      dto.post_id,
      authorId,
      dto.parent_id ?? null,
      dto.content,
      dto.code_snippet ?? null,
      depth,
      now,
    ]
  );

  // Обновляем счетчик комментариев в таблице posts
  await db.runAsync(
    `UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?;`,
    [dto.post_id]
  );

  // Увеличиваем активность автора
  await db.runAsync(
    `UPDATE users SET commits_count = commits_count + 1 WHERE id = ?;`,
    [authorId]
  );

  // Получаем созданный комментарий
  const comments = await getCommentsByPostId(dto.post_id, 'new', authorId);
  return comments.find((c) => c.id === newId)!;
}

export async function toggleCommentVote(
  commentId: string,
  userId: string
): Promise<{ upvotes: number; isUpvoted: boolean }> {
  const db = await getDB();
  const interaction = await db.getFirstAsync<{ vote_type: number }>(
    `SELECT vote_type FROM user_interactions WHERE user_id = ? AND target_type = 'comment' AND target_id = ?;`,
    [userId, commentId]
  );

  const currentVote = interaction ? interaction.vote_type : 0;
  const newVote = currentVote === 1 ? 0 : 1;
  const delta = newVote - currentVote;

  const intId = `ui_${userId}_comment_${commentId}`;
  await db.runAsync(
    `INSERT INTO user_interactions (id, user_id, target_type, target_id, vote_type, updated_at)
     VALUES (?, ?, 'comment', ?, ?, ?)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET 
       vote_type = excluded.vote_type,
       updated_at = excluded.updated_at;`,
    [intId, userId, commentId, newVote, Date.now()]
  );

  await db.runAsync(
    `UPDATE comments SET upvotes = MAX(0, upvotes + ?) WHERE id = ?;`,
    [delta, commentId]
  );

  const updated = await db.getFirstAsync<{ upvotes: number }>(
    `SELECT upvotes FROM comments WHERE id = ?;`,
    [commentId]
  );

  return {
    upvotes: updated ? updated.upvotes : 0,
    isUpvoted: newVote === 1,
  };
}
