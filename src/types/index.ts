export interface Skill {
  id: number | string;
  name: string;
  skill?: { id: number; name: string };
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
  profile?: UserProfile;
  role?: string;
}

export interface UserProfile {
  id?: number;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  bannerUrl?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface OrganizationProfile {
  id?: number;
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface Connection {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Rejected';
  requester?: UserInfo;
  addressee?: UserInfo;
  otherUser?: UserInfo;
}

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

export interface Message {
  id: number | string;
  conversationId?: number;
  senderId?: number;
  content: string;
  createdAt?: string;
  isEdited?: boolean;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements?: string;
  salary?: string;
  createdAt?: string;
  companyLogoUrl?: string;
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
