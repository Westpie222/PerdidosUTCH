export type ItemType = 'lost' | 'found';

export interface Comment {
  id: string;
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
  coords: {
    x: number; // percentage 0-100 on UTCH campus map
    y: number; // percentage 0-100 on UTCH campus map
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
  isResolved?: boolean;
}

export interface CampusPoint {
  id: string;
  name: string;
  shortLabel: string;
  x: number;
  y: number;
  type: 'building' | 'landmark' | 'commercial' | 'sports';
}

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  career: string;
  phone: string;
}
