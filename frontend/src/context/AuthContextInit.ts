import { createContext } from 'react';

interface AuthContext {
    user: {
        email: string | null;
        isSubscribed: boolean;
        id?: number;
        role?: 'USER' | 'ADMIN';
        profilePicture?: string | null;
        storage: {
            bytesUsed: number;
            percentage: number;
        }
    } | null;
    isAuth: boolean;
    loading: boolean;
    refreshAuth: () => void;
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    isAuth: false,
    loading: true,
    refreshAuth: () => {},
});
