import { createContext } from 'react';

interface AuthContext {
    user: { email: string | null } | null;
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