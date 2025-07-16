import { useAuthContext } from '../context/useAuthContext';

export const useAuth = () => {
    const { user, isAuth, loading, refreshAuth } = useAuthContext();
    return { user, isAuth, loading, refreshAuth };
};
