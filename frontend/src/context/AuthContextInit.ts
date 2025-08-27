import { createContext } from 'react';

interface AuthContext {
<<<<<<< HEAD
    user: { email: string | null } | null;
=======
    user: {
        email: string | null;
        isSubscribed: boolean;
        id?: number;
        role?: 'USER' | 'ADMIN';
        profilePicture?: string | null;
        storage: {
            bytesUsed: string;
            percentage: number;
        }
    } | null;
>>>>>>> origin/dev
    isAuth: boolean;
    loading: boolean;
    refreshAuth: () => void;
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    isAuth: false,
    loading: true,
    refreshAuth: () => {},
<<<<<<< HEAD
}); 
=======
});
>>>>>>> origin/dev
