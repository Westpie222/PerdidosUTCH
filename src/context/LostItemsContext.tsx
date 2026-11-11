import React, { createContext, useContext, useState } from 'react';
import { LostItem, UserProfile, Comment } from '../types';
import { INITIAL_LOST_ITEMS } from '../constants/campusLocations';

interface LostItemsContextType {
  items: LostItem[];
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  addItem: (newItem: Omit<LostItem, 'id' | 'date' | 'commentsCount' | 'comments'>) => LostItem;
  addComment: (itemId: string, text: string) => void;
  markAsResolved: (itemId: string) => void;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
  savedItemIds: string[];
  toggleSaveItem: (itemId: string) => void;
}

const DEFAULT_USER: UserProfile = {
  name: 'User',
  email: 'sin_cuenta@utch.edu.mx',
  studentId: 'xxxxxxxx',
  career: 'xxxxx',
  phone: 'xxx xxx xxxx',
};

const LostItemsContext = createContext<LostItemsContextType | undefined>(undefined);

export function LostItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [savedItemIds, setSavedItemIds] = useState<string[]>(['item-1', 'item-3']);

  const addItem = (
    newItem: Omit<LostItem, 'id' | 'date' | 'commentsCount' | 'comments'>
  ): LostItem => {
    const createdItem: LostItem = {
      ...newItem,
      id: `item-${Date.now()}`,
      date: 'Justo ahora',
      commentsCount: 0,
      comments: [],
    };
    setItems((prev) => [createdItem, ...prev]);
    setSelectedItemId(createdItem.id);
    return createdItem;
  };

  const addComment = (itemId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: user.name || 'Estudiante UTCH',
      text: text.trim(),
      time: 'Justo ahora',
    };
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            commentsCount: item.commentsCount + 1,
            comments: [...item.comments, newComment],
          };
        }
        return item;
      })
    );
  };

  const markAsResolved = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isResolved: !item.isResolved } : item
      )
    );
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const login = (email: string) => {
    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
    }));
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const toggleSaveItem = (itemId: string) => {
    setSavedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <LostItemsContext.Provider
      value={{
        items,
        selectedItemId,
        setSelectedItemId,
        addItem,
        addComment,
        markAsResolved,
        user,
        updateUser,
        isLoggedIn,
        login,
        logout,
        savedItemIds,
        toggleSaveItem,
      }}
    >
      {children}
    </LostItemsContext.Provider>
  );
}

export function useLostItems() {
  const context = useContext(LostItemsContext);
  if (!context) {
    throw new Error('useLostItems must be used within a LostItemsProvider');
  }
  return context;
}
