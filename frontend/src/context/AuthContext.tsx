import { AuthContext } from '@/context/AuthContextInit';
import { useGetUserInfoQuery } from '@/generated/graphql-types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, loading, refetch } = useGetUserInfoQuery();

    const isAuth = !!data?.getUserInfo.id;
    const user = isAuth
        ? {
              email: data?.getUserInfo.email ?? null,
              id: data?.getUserInfo.id
                  ? Number(data.getUserInfo.id)
                  : undefined,
              isSubscribed: data?.getUserInfo.isSubscribed ? true : false,
              role: data?.getUserInfo.role ?? undefined,
              profilePicture: data?.getUserInfo.profilePicture ?? null,
              storage: {
                bytesUsed: Number(data?.getUserInfo.storage?.bytesUsed) || 0,
                percentage: data?.getUserInfo.storage?.percentage || 0,
            },
          }
        : null;

    const refreshAuth = () => {
        refetch();
    };

    return (
        <AuthContext.Provider value={{ user, isAuth, loading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
