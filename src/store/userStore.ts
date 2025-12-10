import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    hasCompletedOnboarding: boolean;
    username: string | null;
    setHasCompletedOnboarding: (val: boolean) => void;
    setUsername: (username: string) => void;
    reset: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            username: null,
            setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
            setUsername: (username) => set({ username }),
            reset: () => set({ hasCompletedOnboarding: false, username: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
