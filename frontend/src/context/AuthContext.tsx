import { useGetUserInfoQuery } from '@/generated/graphql-types';
import { AuthContext } from '@/context/AuthContextInit';

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
