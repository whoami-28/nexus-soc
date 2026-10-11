// src/database/postsRepository.ts
import { getDB } from './db';
import { PostItem, CreatePostDTO, User } from '../types';

interface PostRow {
  id: string;
  author_id: string;
  topic_tag: string;
  category: string;
  title: string;
  content: string;
  code_snippet: string | null;
  code_filename: string | null;
  media_type: string;
  media_key: string | null;
  spec_badge: string | null;
  fps_badge: string | null;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  reposts_count: number;
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
  // Interaction columns
  vote_type?: number | null;
  is_bookmarked?: number | null;
  is_reposted?: number | null;
}

function mapRowToPost(row: PostRow): PostItem {
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
    author_id: row.author_id,
    topic_tag: row.topic_tag,
    category: row.category as any,
    title: row.title,
    content: row.content,
    code_snippet: row.code_snippet ?? undefined,
    code_filename: row.code_filename ?? undefined,
    media_type: (row.media_type as any) || 'none',
    media_key: row.media_key ?? undefined,
    spec_badge: row.spec_badge ?? undefined,
    fps_badge: row.fps_badge ?? undefined,
    upvotes: row.upvotes,
    downvotes: row.downvotes,
    comments_count: row.comments_count,
    reposts_count: row.reposts_count,
    created_at: row.created_at,
    author,
    isUpvoted: row.vote_type === 1,
    isDownvoted: row.vote_type === -1,
    isBookmarked: Boolean(row.is_bookmarked),
    isReposted: Boolean(row.is_reposted),
  };
}

const SELECT_POST_JOIN_USER = `
  SELECT 
    p.*,
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
    ui.vote_type,
    ui.is_bookmarked,
    ui.is_reposted
  FROM posts p
  JOIN users u ON p.author_id = u.id
  LEFT JOIN user_interactions ui ON ui.target_id = p.id AND ui.target_type = 'post' AND ui.user_id = ?
`;

export async function getPosts(
  category: 'trending' | 'subs' | 'all' | 'tech',
  searchQuery?: string,
  currentUserId: string = 'user_elena'
): Promise<PostItem[]> {
  const db = await getDB();
  let sql = SELECT_POST_JOIN_USER;
  const params: any[] = [currentUserId];

  const whereClauses: string[] = [];

  if (category !== 'all') {
    whereClauses.push('p.category = ?');
    params.push(category);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    whereClauses.push('(p.title LIKE ? OR p.content LIKE ? OR p.topic_tag LIKE ?)');
    const term = `%${searchQuery.trim()}%`;
    params.push(term, term, term);
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  if (category === 'trending') {
    sql += ' ORDER BY p.upvotes DESC, p.created_at DESC;';
  } else {
    sql += ' ORDER BY p.created_at DESC;';
  }

  const rows = await db.getAllAsync<PostRow>(sql, params);
  return rows.map(mapRowToPost);
}

export async function getPostById(
  postId: string,
  currentUserId: string = 'user_elena'
): Promise<PostItem | null> {
  const db = await getDB();
  const sql = `${SELECT_POST_JOIN_USER} WHERE p.id = ? LIMIT 1;`;
  const row = await db.getFirstAsync<PostRow>(sql, [currentUserId, postId]);
  if (!row) return null;
  return mapRowToPost(row);
}

export async function createPost(
  authorId: string,
  dto: CreatePostDTO
): Promise<PostItem> {
  const db = await getDB();
  const newId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  await db.runAsync(
    `INSERT INTO posts (
      id, author_id, topic_tag, category, title, content, 
      code_snippet, code_filename, media_type, media_key, 
      spec_badge, fps_badge, upvotes, downvotes, comments_count, 
      reposts_count, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?);`,
    [
      newId,
      authorId,
      dto.topic_tag.toUpperCase(),
      dto.category,
      dto.title,
      dto.content,
      dto.code_snippet ?? null,
      dto.code_filename ?? null,
      dto.media_type || 'none',
      dto.media_type === 'telemetry_chart' ? 'nexus_preview' : null,
      dto.spec_badge ?? null,
      dto.fps_badge ?? null,
      now,
    ]
  );

  // Увеличиваем счетчик коммитов/активности автора
  await db.runAsync(
    `UPDATE users SET commits_count = commits_count + 1 WHERE id = ?;`,
    [authorId]
  );

  const created = await getPostById(newId, authorId);
  return created!;
}

export async function deletePost(postId: string): Promise<boolean> {
  const db = await getDB();
  await db.runAsync(`DELETE FROM comments WHERE post_id = ?;`, [postId]);
  await db.runAsync(`DELETE FROM user_interactions WHERE target_id = ?;`, [postId]);
  const result = await db.runAsync(`DELETE FROM posts WHERE id = ?;`, [postId]);
  return result.changes > 0;
}

export async function togglePostVote(
  postId: string,
  userId: string,
  voteDelta: 1 | -1
): Promise<{ upvotes: number; downvotes: number; userVote: number }> {
  const db = await getDB();

  // Получаем текущее взаимодействие
  const interaction = await db.getFirstAsync<{ vote_type: number }>(
    `SELECT vote_type FROM user_interactions WHERE user_id = ? AND target_type = 'post' AND target_id = ?;`,
    [userId, postId]
  );

  const currentVote = interaction ? interaction.vote_type : 0;
  let newVote = 0;

  if (currentVote === voteDelta) {
    // Пользователь нажал тот же голос — отменяем
    newVote = 0;
  } else {
    // Меняем на новый голос
    newVote = voteDelta;
  }

  // Обновляем запись в user_interactions
  const intId = `ui_${userId}_post_${postId}`;
  await db.runAsync(
    `INSERT INTO user_interactions (id, user_id, target_type, target_id, vote_type, updated_at)
     VALUES (?, ?, 'post', ?, ?, ?)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET 
       vote_type = excluded.vote_type,
       updated_at = excluded.updated_at;`,
    [intId, userId, postId, newVote, Date.now()]
  );

  // Пересчитываем upvotes/downvotes
  let upDelta = 0;
  let downDelta = 0;

  if (currentVote === 1) upDelta -= 1;
  if (currentVote === -1) downDelta -= 1;

  if (newVote === 1) upDelta += 1;
  if (newVote === -1) downDelta += 1;

  await db.runAsync(
    `UPDATE posts SET 
       upvotes = MAX(0, upvotes + ?),
       downvotes = MAX(0, downvotes + ?)
     WHERE id = ?;`,
    [upDelta, downDelta, postId]
  );

  // Обновляем карму автора поста (+10 REP за апвоут, -5 за диз)
  const post = await db.getFirstAsync<{ author_id: string }>(
    `SELECT author_id FROM posts WHERE id = ?;`,
    [postId]
  );
  if (post) {
    const repDelta = upDelta * 10 - downDelta * 5;
    await db.runAsync(
      `UPDATE users SET rep_score = MAX(0, rep_score + ?) WHERE id = ?;`,
      [repDelta, post.author_id]
    );
  }

  const updatedPost = await db.getFirstAsync<{ upvotes: number; downvotes: number }>(
    `SELECT upvotes, downvotes FROM posts WHERE id = ?;`,
    [postId]
  );

  return {
    upvotes: updatedPost ? updatedPost.upvotes : 0,
    downvotes: updatedPost ? updatedPost.downvotes : 0,
    userVote: newVote,
  };
}

export async function togglePostBookmark(
  postId: string,
  userId: string
): Promise<boolean> {
  const db = await getDB();
  const interaction = await db.getFirstAsync<{ is_bookmarked: number }>(
    `SELECT is_bookmarked FROM user_interactions WHERE user_id = ? AND target_type = 'post' AND target_id = ?;`,
    [userId, postId]
  );

  const currentlyBookmarked = interaction ? Boolean(interaction.is_bookmarked) : false;
  const newBookmarked = !currentlyBookmarked;

  const intId = `ui_${userId}_post_${postId}`;
  await db.runAsync(
    `INSERT INTO user_interactions (id, user_id, target_type, target_id, is_bookmarked, updated_at)
     VALUES (?, ?, 'post', ?, ?, ?)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET 
       is_bookmarked = excluded.is_bookmarked,
       updated_at = excluded.updated_at;`,
    [intId, userId, postId, newBookmarked ? 1 : 0, Date.now()]
  );

  return newBookmarked;
}

export async function getBookmarkedPosts(
  userId: string
): Promise<PostItem[]> {
  const db = await getDB();
  const sql = `${SELECT_POST_JOIN_USER} WHERE ui.is_bookmarked = 1 ORDER BY ui.updated_at DESC;`;
  const rows = await db.getAllAsync<PostRow>(sql, [userId]);
  return rows.map(mapRowToPost);
}

export async function getUserPosts(
  userId: string,
  currentUserId: string = 'user_elena'
): Promise<PostItem[]> {
  const db = await getDB();
  const sql = `${SELECT_POST_JOIN_USER} WHERE p.author_id = ? ORDER BY p.created_at DESC;`;
  const rows = await db.getAllAsync<PostRow>(sql, [currentUserId, userId]);
  return rows.map(mapRowToPost);
}
