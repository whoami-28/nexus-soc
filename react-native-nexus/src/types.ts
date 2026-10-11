// src/types.ts

export type ScreenName = 'webview' | 'feed' | 'thread' | 'profile';

export interface User {
  id: string;
  handle: string;
  name: string;
  avatar_key: string;
  bio: string;
  github_url: string;
  matrix_url: string;
  verified: boolean;
  status_label: string;
  rep_score: number;
  audits_count: number;
  bounties_count: number;
  commits_count: number;
  network_rank: string;
  created_at: number;
}

export interface PostItem {
  id: string;
  author_id: string;
  topic_tag: string;
  category: 'trending' | 'subs' | 'all' | 'tech';
  title: string;
  content: string;
  code_snippet?: string;
  code_filename?: string;
  media_type: 'none' | 'telemetry_chart' | 'image' | 'bounty';
  media_key?: string;
  spec_badge?: string;
  fps_badge?: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  reposts_count: number;
  created_at: number;
  // Joined or calculated fields
  author: User;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
}

export interface CommentItemData {
  id: string;
  post_id: string;
  author_id: string;
  parent_id?: string | null;
  content: string;
  code_snippet?: string;
  upvotes: number;
  depth: number;
  created_at: number;
  author: User;
  isUpvoted?: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  actor_id: string;
  type: 'upvote' | 'comment' | 'repost' | 'mention' | 'bounty';
  title: string;
  body: string;
  target_post_id?: string;
  is_read: boolean;
  created_at: number;
  actor?: User;
}

export interface BountyItem {
  id: string;
  title: string;
  reward_amount: string;
  description: string;
  difficulty: 'HIGH' | 'MED' | 'CRITICAL';
  status: 'OPEN' | 'CLAIMED' | 'SOLVED';
  created_at: number;
}

export interface CreatePostDTO {
  topic_tag: string;
  category: 'trending' | 'subs' | 'all' | 'tech';
  title: string;
  content: string;
  code_snippet?: string;
  code_filename?: string;
  media_type?: 'none' | 'telemetry_chart' | 'image' | 'bounty';
  spec_badge?: string;
  fps_badge?: string;
}

export interface CreateCommentDTO {
  post_id: string;
  parent_id?: string | null;
  content: string;
  code_snippet?: string;
  depth?: number;
}

export interface UpdateProfileDTO {
  name: string;
  handle: string;
  bio: string;
  status_label: string;
  github_url: string;
  matrix_url: string;
}
