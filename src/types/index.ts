export type ItemType = 'lost' | 'found';

export interface Comment {
  id: string;
  authorId?: string;
  author: string;
  text: string;
  time: string;
}

export interface LostItem {
  id: string;
  title: string;
  type: ItemType;
  category: string;
  locationName: string;
  coords?: {
    x: number; // legacy: percentage 0-100 on the old schematic map
    y: number; // legacy: percentage 0-100 on the old schematic map
  };
  position?: {
    latitude: number;
    longitude: number;
  };
  description: string;
  imageUrl: string;
  author: {
    name: string;
    studentId?: string;
    career?: string;
    phone?: string;
  };
  date: string;
  commentsCount: number;
  comments: Comment[];
  likedBy?: string[];
  likesCount?: number;
  authorId?: string;
  createdAt?: number;
  isResolved?: boolean;
}

export interface CampusPoint {
  id: string;
  name: string;
  shortLabel: string;
  latitude: number;
  longitude: number;
  type: 'building' | 'landmark' | 'commercial' | 'sports';
}

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  career: string;
  phone: string;
}
