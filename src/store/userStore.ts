import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    hasCompletedOnboarding: boolean;
    setHasCompletedOnboarding: (val: boolean) => void;
    reset: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
            reset: () => set({ hasCompletedOnboarding: false }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
