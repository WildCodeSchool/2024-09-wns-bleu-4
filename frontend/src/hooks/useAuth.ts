import { useEffect } from 'react';
import { useUser, User } from './useUser';
import { useLocalStorage } from './useLocalStorage';
import { useGetUserInfoQuery } from '@/generated/graphql-types';

export const useAuth = () => {
    // we can re export the user methods or object from this hook
    const { user, addUser, removeUser, setUser } = useUser();
    const { getItem } = useLocalStorage();

    const { data } = useGetUserInfoQuery();

    useEffect(() => {
        const user = getItem('user');
        if (user) {
            addUser(JSON.parse(user));
        }
    }, [addUser, getItem, setUser]);

    const authLogin = (user: User) => {
        addUser(user);
    };

    const authLogout = () => {
        removeUser();
    };

    const authCheck = (): boolean => {
        const localUser = getUserFromLocalStorage();
        const serverUser = data?.getUserInfo.email;
        return localUser.email === serverUser;
    };

    const getUserFromLocalStorage = () => {
        try {
            return JSON.parse(localStorage.getItem('user')!);
        } catch {
            return {};
        }
    };

    return { user, authLogin, authLogout, authCheck, setUser };
};
