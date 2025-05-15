import { useAuthContext } from '../context/useAuthContext';

export const useAuth = () => {
    const { user, isAuth, loading } = useAuthContext();
    return { user, isAuth, loading };
};
