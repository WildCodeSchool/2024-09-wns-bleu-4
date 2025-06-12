import { createContext } from 'react';

interface AuthContext {
    user: { email: string | null, isSubscribed: boolean, id?: number } | null;
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