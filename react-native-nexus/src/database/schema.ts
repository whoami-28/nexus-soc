// src/database/schema.ts

export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE,
  name TEXT,
  avatar_key TEXT,
  bio TEXT,
  github_url TEXT,
  matrix_url TEXT,
  verified INTEGER DEFAULT 1,
  status_label TEXT,
  rep_score INTEGER DEFAULT 0,
  audits_count INTEGER DEFAULT 0,
  bounties_count INTEGER DEFAULT 0,
  commits_count INTEGER DEFAULT 0,
  network_rank TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT REFERENCES users(id),
  topic_tag TEXT,
  category TEXT,
  title TEXT,
  content TEXT,
  code_snippet TEXT,
  code_filename TEXT,
  media_type TEXT,
  media_key TEXT,
  spec_badge TEXT,
  fps_badge TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  author_id TEXT REFERENCES users(id),
  parent_id TEXT,
  content TEXT,
  code_snippet TEXT,
  upvotes INTEGER DEFAULT 0,
  depth INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS user_interactions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  target_type TEXT, -- 'post' | 'comment'
  target_id TEXT,
  vote_type INTEGER DEFAULT 0, -- 1 (up), -1 (down), 0 (none)
  is_bookmarked INTEGER DEFAULT 0,
  is_reposted INTEGER DEFAULT 0,
  updated_at INTEGER,
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  actor_id TEXT REFERENCES users(id),
  type TEXT,
  title TEXT,
  body TEXT,
  target_post_id TEXT,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS bounties (
  id TEXT PRIMARY KEY,
  title TEXT,
  reward_amount TEXT,
  description TEXT,
  difficulty TEXT,
  status TEXT,
  created_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_interactions ON user_interactions(user_id, target_type, target_id);
`;
