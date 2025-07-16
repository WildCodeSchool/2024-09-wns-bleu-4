import HeadMeta from '@/components/HeadMeta';
import { Loader } from '@/components/Loader';
import { AuthProvider } from '@/context/AuthContext';
import Contacts from '@/pages/Contacts/Contacts';
import FilesPage from '@/pages/Files/files';
import Home from '@/pages/Home/Home';
import Subscription from '@/pages/Subscription/subscription';
import Layout from '@/pages/Layout';
import Login from '@/pages/Log/Login';
import Sign from '@/pages/Sign/sign';
import UploadPage from '@/pages/Upload/UploadPage';
import About from '@/pages/About/about';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Profile } from '@/pages/Profile/profile';
import HowItWorks from '@/pages/HowitWorks';
import AdminPage from '@/pages/Admin/Admin';
import UserManagement from '@/pages/Admin/UserManagement';
import FileManagement from '@/pages/Admin/FileManagement';
import NotFound from '@/pages/Error/NotFound';
import { useTranslation } from 'react-i18next';
import Payment from '@/pages/Subscription/Payment';
import SubscriptionSuccess from './pages/Subscription/SubscriptionSuccess';

const App = () => {
    const { t } = useTranslation();
    
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <PageWrapper
                                    title={t('meta.home.title')}
                                    description={t('meta.home.description')}
                                >
                                    <Home />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PageWrapper
                                    title={t('meta.login.title')}
                                    description={t('meta.login.description')}
                                >
                                    <Login />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/sign"
                            element={
                                <PageWrapper
                                    title={t('meta.signup.title')}
                                    description={t('meta.signup.description')}
                                >
                                    <Sign />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/files"
                            element={
                                <PageWrapper
                                    title={t('meta.files.title')}
                                    description={t('meta.files.description')}
                                    requireAuth
                                >
                                    <FilesPage />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <PageWrapper
                                    title={t('meta.upload.title')}
                                    description={t('meta.upload.description')}
                                    requireAuth
                                >
                                    <UploadPage />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/contacts"
                            element={
                                <PageWrapper
                                    title={t('meta.contacts.title')}
                                    description={t('meta.contacts.description')}
                                    requireAuth
                                >
                                    <Contacts />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <PageWrapper
                                    title={t('meta.forgotPassword.title')}
                                    description={t('meta.forgotPassword.description')}
                                >
                                    <div>{t('meta.forgotPassword.title')}</div>
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/subscription"
                            element={
                                <PageWrapper
                                    title={t('meta.subscription.title')}
                                    description={t('meta.subscription.description')}
                                >
                                    <Subscription />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/subscription/payment"
                            element={
                                <PageWrapper
                                    title={t('meta.payment.title')}
                                    description={t('meta.payment.description')}
                                    requireAuth
                                >
                                    <Payment />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/subscription/success"
                            element={
                                <PageWrapper
                                    title={t('meta.subscription.success.title')}
                                    description={t('meta.subscription.success.description')}
                                    requireAuth
                                >
                                    <SubscriptionSuccess />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <PageWrapper
                                    title={t('meta.about.title')}
                                    description={t('meta.about.description')}
                                >
                                    <About />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/sitemap"
                            element={
                                <PageWrapper
                                    title={t('meta.sitemap.title')}
                                    description={t('meta.sitemap.description')}
                                >
                                    <div>{t('meta.sitemap.title')}</div>
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/cgu"
                            element={
                                <PageWrapper
                                    title={t('meta.terms.title')}
                                    description={t('meta.terms.description')}
                                >
                                    <div>{t('meta.terms.title')}</div>
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/how-it-works"
                            element={<PageWrapper
                                    title={t('meta.howItWorks.title')}
                                    description={t('meta.howItWorks.description')}
                                >
                                    <HowItWorks />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PageWrapper
                                    title={t('meta.profile.title')}
                                    description={t('meta.profile.description')}
                                    requireAuth
                                >
                                    <Profile />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <PageWrapper
                                    title={t('meta.admin.title')}
                                    description={t('meta.admin.description')}
                                    adminOnly
                                >
                                    <AdminPage />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <PageWrapper
                                    title={t('meta.admin.users.title')}
                                    description={t('meta.admin.users.description')}
                                    adminOnly
                                >
                                    <UserManagement />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/admin/files"
                            element={
                                <PageWrapper
                                    title={t('meta.admin.files.title')}
                                    description={t('meta.admin.files.description')}
                                    adminOnly
                                >
                                    <FileManagement />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <PageWrapper
                                    title={t('admin.reports.title')}
                                    description={t('admin.reports.description')}
                                    protected
                                >
                                    <AdminRoute>
                                        <ReportManagement />
                                    </AdminRoute>
                                </PageWrapper>
                            }
                        />
                    </Route>
                    <Route path="*" element={
                        <PageWrapper
                            title={t('meta.notFound.title')}
                            description={t('meta.notFound.description')}
                        >
                            <NotFound />
                        </PageWrapper>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

interface PageWrapperProps {
    children: React.ReactNode;
    title: string;
    description: string;
    requireAuth?: boolean;
    adminOnly?: boolean;
}

const PageWrapper = ({
    children,
    title,
    description,
    requireAuth,
    adminOnly,
}: PageWrapperProps) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();

    // Block access to /subscription/payment and /subscription/success if already subscribed
    if (
        user?.isSubscribed &&
        (location.pathname === '/subscription/payment' || location.pathname === '/subscription/success')
    ) {
        toast.error(t('subscription.alreadySubscribed'));
        return <Navigate to="/subscription" replace />;
    }

    if (requireAuth || adminOnly) {
        return (
            <RequireAuthRoute>
                <HeadMeta title={title} description={description} />
                {adminOnly ? <AdminOnlyRoute>{children}</AdminOnlyRoute> : children}
            </RequireAuthRoute>
        );
    }
    return (
        <>
            <HeadMeta title={title} description={description} />
            {children}
        </>
    );
};

const RequireAuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    const { isAuth, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuth) {
            toast.error(t('auth.protectedRoute.error'));
            navigate('/login');
        }
    }, [isAuth, loading, navigate, t]);

    if (loading) return <Loader />;
    return isAuth ? children : null;
};

const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
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

export default App;
