import { User } from './useUser';
import { useUser } from './useUser';

export const useAuth = () => {
    const { user, addUser, removeUser, isAuth, setUser } = useUser();

    const authLogin = (user: User) => {
        addUser(user);
    };

    const authLogout = () => {
        removeUser();
    };

    return { user, authLogin, authLogout, isAuth, setUser };
};
