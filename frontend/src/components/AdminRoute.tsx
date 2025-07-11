import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/Loader';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { t } = useTranslation();
    const { user, isAuth, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!isAuth) {
                toast.error(t('admin.access.denied.notLoggedIn'));
                navigate('/login');
            } else if (user?.role !== 'ADMIN') {
                toast.error(t('admin.access.denied.notAdmin'));
                navigate('/');
            }
        }
    }, [isAuth, loading, user, navigate, t]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuth || user?.role !== 'ADMIN') {
        return null;
    }

    return <>{children}</>;
};

export default AdminRoute; 