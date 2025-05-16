import { useGetUserInfoQuery } from '@/generated/graphql-types';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, loading, refetch } = useGetUserInfoQuery();

    const isAuth = !!data?.getUserInfo.isLoggedIn;
    const user = isAuth ? { email: data?.getUserInfo.email ?? null } : null;

    const refreshAuth = () => {
        refetch();
    };

    return (
        <AuthContext.Provider value={{ user, isAuth, loading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
