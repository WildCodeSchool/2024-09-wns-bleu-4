import { AuthContext } from '@/context/AuthContextInit';
import { useGetUserInfoQuery } from '@/generated/graphql-types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, loading, refetch } = useGetUserInfoQuery();

    const isAuth = !!data?.getUserInfo.id;
    const user = isAuth ? { 
        email: data?.getUserInfo.email ?? null,
        id: data?.getUserInfo.id ? Number(data.getUserInfo.id) : undefined,
        isSubscribed: data?.getUserInfo.isSubscribed ? true : false
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
