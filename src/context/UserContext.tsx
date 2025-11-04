import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Types for user profile & settings
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  headline?: string;
  role: 'candidate' | 'company' | 'admin';
  avatarColor?: string; // used for simple colored circle avatar
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  social?: {
    linkedin?: string;
    github?: string;
    dribbble?: string;
  };
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: 'id' | 'en';
  profileVisibility: 'public' | 'private' | 'connections';
  dataSharing: boolean;
}

interface UserContextValue {
  user: UserProfile | null;
  settings: UserSettings;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<UserSettings>) => void;
  logout: () => void;
  mockLogin: () => void; // for demo purpose only
  mockCompanyLogin: () => void; // login as company demo
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: false,
  language: 'id',
  profileVisibility: 'public',
  dataSharing: true,
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Load user from localStorage or start with null (logged out)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('simhire_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('simhire_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('simhire_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('simhire_user');
    }
  }, [user]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('simhire_settings', JSON.stringify(settings));
  }, [settings]);


  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser((prev: UserProfile | null) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    setSettings((prev: UserSettings) => ({ ...prev, ...data }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Redirect to landing page after logout
    window.location.href = '/';
  }, []);

  const mockLogin = useCallback(() => {
    setUser({
      id: 'u123',
      name: 'Alexandria Putri',
      email: 'alexandria@example.com',
      headline: 'Product Designer & UX Researcher',
      role: 'candidate',
      avatarColor: 'bg-orange-400',
      bio: 'Bersemangat menciptakan pengalaman digital yang inklusif dan berdampak.',
      location: 'Bandung, Indonesia',
      website: 'https://alexandria.dev',
      skills: ['UI/UX', 'Figma', 'Prototyping', 'Research'],
      social: { linkedin: 'alexandria-putri', github: 'alexdev', dribbble: 'alexdesign' }
    });
  }, []);

  const mockCompanyLogin = useCallback(() => {
    setUser({
      id: 'c456',
      name: 'PT TechStart Indonesia',
      email: 'hr@techstart.id',
      headline: 'Leading Technology Company',
      role: 'company',
      avatarColor: 'bg-blue-500',
      bio: 'Membangun solusi teknologi inovatif untuk transformasi digital Indonesia.',
      location: 'Jakarta, Indonesia',
      website: 'https://techstart.id',
      skills: ['React', 'Node.js', 'DevOps', 'UI/UX', 'Data Science'],
      social: { linkedin: 'techstart-indonesia', github: 'techstart-id' }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, settings, updateProfile, updateSettings, logout, mockLogin, mockCompanyLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
