// src/types.ts
export type ScreenName = 'feed' | 'thread' | 'profile';

export interface PostItem {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: any;
    verified: boolean;
    role?: string;
    roleColor?: string;
    timeAgo: string;
  };
  topicTag?: string;
  title?: string;
  content: string;
  upvotes: string;
  commentsCount: number;
  repostsCount?: number;
  isBookmarked?: boolean;
}

export interface CommentItemData {
  id: string;
  author: string;
  handle: string;
  timeAgo: string;
  avatar: any;
  isOP?: boolean;
  content: string;
  upvotes: string;
  depth: number;
}
