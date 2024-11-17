import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

interface ProfileData {
  uid: string;
  displayName: string;
  description?: string;
  links?: Array<{ title: string; url: string }>;
  featured?: string[];
  layout?: 'grid' | 'list';
  theme?: string;
}

export function useUpdateProfile() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (data: ProfileData) => {
    setIsUpdating(true);
    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: data.displayName,
        });
      }

      // Update Firestore profile data
      const userRef = doc(db, 'users', data.uid);
      await updateDoc(userRef, {
        displayName: data.displayName,
        description: data.description,
        links: data.links,
        featured: data.featured,
        layout: data.layout,
        theme: data.theme,
        updatedAt: new Date(),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating };
}