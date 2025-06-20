
import { useState, useEffect } from 'react';
import LocalStorageService from '@/services/local-storage.service';

export function useLocalStorage<T>(key: string, initializer: () => T) {
  const [data, setData] = useState<T>(() => {
    try {
      return initializer();
    } catch {
      return {} as T;
    }
  });

  useEffect(() => {
    // Initialize data on mount
    LocalStorageService.initializeData();
    setData(initializer());

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setData(initializer());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return data;
}

export function useUsers() {
  return useLocalStorage('exam_arena_users', () => LocalStorageService.getUsers());
}

export function useMajors() {
  return useLocalStorage('exam_arena_majors', () => LocalStorageService.getMajors());
}

export function useSystemStats() {
  return useLocalStorage('exam_arena_system_stats', () => LocalStorageService.getSystemStats());
}

export function useMajorStats() {
  return useLocalStorage('exam_arena_major_stats', () => LocalStorageService.getMajorStats());
}
