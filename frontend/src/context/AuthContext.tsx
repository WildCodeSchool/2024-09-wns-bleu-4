import { useGetUserIdQuery } from '@/generated/graphql-types';
import { createContext } from 'react';

interface AuthContext {
    user: { email: string | null; id?: number } | null;
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
    const { data, loading, refetch } = useGetUserIdQuery();

    const isAuth = !!data?.getUserInfo.id;
    const user = isAuth ? { 
        email: data?.getUserInfo.email ?? null,
        id: data?.getUserInfo.id ? Number(data.getUserInfo.id) : undefined
    } : null;

    const refreshAuth = () => {
        refetch();
    };

    return (
        <AuthContext.Provider value={{ user, isAuth, loading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
