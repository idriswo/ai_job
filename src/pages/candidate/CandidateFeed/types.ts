export interface Skill {
  id: number | string;
  name: string;
}

export interface Language {
  id: number | string;
  name: string;
}

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  profilePicture?: string;
  headline?: string;
}

export interface UserProfile {
  id: number;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  bannerUrl?: string;
  avatarUrl?: string;
}

export interface PostComment {
  id: number | string;
  content: string;
  authorName?: string;
  authorImageUrl?: string;
  createdAt: string;
}

export interface Post {
  id: number;
  content: string;
  authorName?: string;
  authorImageUrl?: string;
  createdAt?: string;
  likeCount?: number;
  commentCount?: number;
  repostCount?: number;
  likedByMe?: boolean;
  userId?: number;
  user?: { id: number };
  imageUrl?: string;
}
