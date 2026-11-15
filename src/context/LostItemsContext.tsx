import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../config/fireBaseConfig';
import { Comment, LostItem, UserProfile } from '../types';

interface LostItemsContextType {
  items: LostItem[];
  itemsError: string | null;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  addItem: (newItem: Omit<LostItem, 'id' | 'date' | 'commentsCount' | 'comments'>) => Promise<LostItem>;
  addComment: (itemId: string, text: string) => Promise<void>;
  toggleLike: (itemId: string) => Promise<void>;
  markAsResolved: (itemId: string) => Promise<void>;
  deletePost: (itemId: string) => Promise<void>;
  user: UserProfile;
  userId: string | null;
  updateUser: (updated: Partial<UserProfile>) => Promise<void>;
  isLoggedIn: boolean;
  authReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  savedItemIds: string[];
  toggleSaveItem: (itemId: string) => void;
}

const EMPTY_USER: UserProfile = {
  name: '',
  email: '',
  studentId: '',
  career: '',
  phone: '',
};

const LostItemsContext = createContext<LostItemsContextType | undefined>(undefined);

function profileFromData(data: Partial<UserProfile> | undefined, authUser: User): UserProfile {
  return {
    name: data?.name || authUser.displayName || '',
    email: authUser.email || data?.email || '',
    studentId: data?.studentId || '',
    career: data?.career || '',
    phone: data?.phone || '',
  };
}

export function LostItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LostItem[]>([]);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      setUserId(authUser?.uid ?? null);
      if (!authUser) {
        setItems([]);
        setItemsError(null);
        setUser(EMPTY_USER);
        setAuthReady(true);
        return;
      }

      try {
        const profileSnapshot = await getDoc(doc(db, 'users', authUser.uid));
        const profileData = profileSnapshot.exists()
            ? (profileSnapshot.data() as Partial<UserProfile>)
            : undefined;
        const profile = profileFromData(profileData, authUser);
        setUser(profile);
        if (!profileSnapshot.exists()) {
          await setDoc(doc(db, 'users', authUser.uid), profile);
        }
      } catch (error) {
        console.error('No se pudo cargar el perfil de Firebase.', error);
        setUser(profileFromData(undefined, authUser));
      } finally {
        setAuthReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(
        collection(db, 'posts'),
        (snapshot) => {
          setItemsError(null);
          const nextItems = snapshot.docs.map((postSnapshot) => {
            const data = postSnapshot.data();
            const comments = Array.isArray(data.comments) ? (data.comments as Comment[]) : [];
            const likedBy = Array.isArray(data.likedBy) ? (data.likedBy as string[]) : [];

            return {
              ...data,
              id: postSnapshot.id,
              comments,
              commentsCount: comments.length,
              likedBy,
              likesCount: likedBy.length,
            } as LostItem;
          });
          nextItems.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setItems(nextItems);
        },
        (error) => {
          console.error('No se pudieron cargar las publicaciones de Firebase.', error);
          setItemsError(
              'No se pudieron cargar las publicaciones. Verifica tu conexión y las reglas de Firebase.'
          );
        }
    );
  }, [userId]);

  const addItem: LostItemsContextType['addItem'] = async (newItem) => {
    if (!auth.currentUser) throw new Error('Inicia sesión para publicar un objeto.');

    const createdAt = Date.now();
    const post = {
      ...newItem,
      authorId: auth.currentUser.uid,
      date: 'Justo ahora',
      createdAt,
      comments: [],
      commentsCount: 0,
      likedBy: [],
      likesCount: 0,
      isResolved: false,
      createdAtServer: serverTimestamp(),
    };
    const reference = await addDoc(collection(db, 'posts'), post);
    const createdItem: LostItem = {
      ...post,
      id: reference.id,
      comments: [],
      commentsCount: 0,
      likedBy: [],
      likesCount: 0,
    };
    setSelectedItemId(reference.id);
    return createdItem;
  };

  const addComment: LostItemsContextType['addComment'] = async (itemId, text) => {
    const currentUser = auth.currentUser;
    const trimmedText = text.trim();
    if (!currentUser) throw new Error('Inicia sesión para comentar.');
    if (!trimmedText) return;

    const newComment: Comment = {
      id: `${Date.now()}-${currentUser.uid}`,
      authorId: currentUser.uid,
      author: user.name || 'Estudiante UTCH',
      text: trimmedText,
      time: 'Justo ahora',
    };
    await updateDoc(doc(db, 'posts', itemId), {
      comments: arrayUnion(newComment),
    });
  };

  const toggleLike: LostItemsContextType['toggleLike'] = async (itemId) => {
    const currentUser = auth.currentUser;
    const item = items.find((post) => post.id === itemId);
    if (!currentUser) throw new Error('Inicia sesión para indicar que te gusta.');
    if (!item) throw new Error('No se encontró esta publicación.');

    await updateDoc(doc(db, 'posts', itemId), {
      likedBy: item.likedBy?.includes(currentUser.uid)
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
    });
  };

  const markAsResolved: LostItemsContextType['markAsResolved'] = async (itemId) => {
    const item = items.find((post) => post.id === itemId);
    if (!item) throw new Error('No se encontró esta publicación.');
    await updateDoc(doc(db, 'posts', itemId), {
      isResolved: !item.isResolved,
    });
  };

  const deletePost: LostItemsContextType['deletePost'] = async (itemId) => {
    await deleteDoc(doc(db, 'posts', itemId));
  };

  const updateUser: LostItemsContextType['updateUser'] = async (updated) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Inicia sesión para editar tu perfil.');
    const updatedProfile = { ...user, ...updated, email: currentUser.email || user.email };
    await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true });
    setUser(updatedProfile);
  };

  const login: LostItemsContextType['login'] = async (email, password) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const register: LostItemsContextType['register'] = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(credential.user, { displayName: name.trim() });
    const newProfile: UserProfile = {
      ...EMPTY_USER,
      name: name.trim(),
      email: credential.user.email || email.trim(),
    };
    await setDoc(doc(db, 'users', credential.user.uid), newProfile);
    setUser(newProfile);
  };

  const logout = () => signOut(auth);

  const deleteAccount: LostItemsContextType['deleteAccount'] = async (password) => {
    const currentUser = auth.currentUser;
    if (!currentUser?.email) throw new Error('Inicia sesión para eliminar tu cuenta.');

    await reauthenticateWithCredential(
        currentUser,
        EmailAuthProvider.credential(currentUser.email, password)
    );

    const batch = writeBatch(db);
    const posts = await getDocs(collection(db, 'posts'));
    posts.forEach((postSnapshot) => {
      const data = postSnapshot.data();
      if (data.authorId === currentUser.uid) {
        batch.delete(postSnapshot.ref);
        return;
      }
      const comments = Array.isArray(data.comments) ? (data.comments as Comment[]) : [];
      if (comments.some((comment) => comment.authorId === currentUser.uid)) {
        batch.update(postSnapshot.ref, {
          comments: comments.filter((comment) => comment.authorId !== currentUser.uid),
        });
      }
    });
    batch.delete(doc(db, 'users', currentUser.uid));
    await batch.commit();
    await deleteUser(currentUser);
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
            itemsError,
            selectedItemId,
            setSelectedItemId,
            addItem,
            addComment,
            toggleLike,
            markAsResolved,
            deletePost,
            user,
            userId,
            updateUser,
            isLoggedIn: Boolean(userId),
            authReady,
            login,
            register,
            logout,
            deleteAccount,
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
