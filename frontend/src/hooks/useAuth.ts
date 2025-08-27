import { useAuthContext } from '../context/useAuthContext';

export const useAuth = () => {
<<<<<<< HEAD
    const { user, isAuth, loading } = useAuthContext();
    return { user, isAuth, loading };
=======
    const { user, isAuth, loading, refreshAuth } = useAuthContext();
    return { user, isAuth, loading, refreshAuth };
>>>>>>> origin/dev
};
