import HeadMeta from '@/components/HeadMeta';
import { Loader } from '@/components/Loader';
import { AuthProvider } from '@/context/AuthContext';
<<<<<<< HEAD
import Contact from '@/pages/Contact/contact';
import FilesPage from '@/pages/Files/files';
import Home from '@/pages/Home/Home';
import Subscription from './pages/Subscription/subscription';
=======
import Contacts from '@/pages/Contacts/Contacts';
import FilesPage from '@/pages/Files/files';
import Home from '@/pages/Home/Home';
import Subscription from '@/pages/Subscription/subscription';
>>>>>>> origin/dev
import Layout from '@/pages/Layout';
import Login from '@/pages/Log/Login';
import Sign from '@/pages/Sign/sign';
import UploadPage from '@/pages/Upload/UploadPage';
import About from '@/pages/About/about';
import { useEffect } from 'react';
<<<<<<< HEAD
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './hooks/useAuth';
import HowWork from '@/pages/HowWork';
import { Profile } from '@/pages/Profile/profile';
=======
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
import SubscriptionSuccess from '@/pages/Subscription/SubscriptionSuccess';
import ReportManagement from '@/pages/Admin/ReportManagement';
>>>>>>> origin/dev

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
<<<<<<< HEAD
                                    title="Acceuil"
                                    description="Acceuil du site Wild Transfer"
=======
                                    title={t('meta.home.title')}
                                    description={t('meta.home.description')}
>>>>>>> origin/dev
                                >
                                    <Home />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Connexion"
                                    description="Connexion à un compte Wild Transfer"
=======
                                    title={t('meta.login.title')}
                                    description={t('meta.login.description')}
>>>>>>> origin/dev
                                >
                                    <Login />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/sign"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Inscription"
                                    description="Création de compte Wild Transfer"
=======
                                    title={t('meta.signup.title')}
                                    description={t('meta.signup.description')}
>>>>>>> origin/dev
                                >
                                    <Sign />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/files"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Mes Fichiers"
                                    description="Page de vos fichiers"
                                    protected
=======
                                    title={t('meta.files.title')}
                                    description={t('meta.files.description')}
                                    requireAuth
>>>>>>> origin/dev
                                >
                                    <FilesPage />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Transférer des fichiers"
                                    description="Transfert de fichiers"
                                    protected
=======
                                    title={t('meta.upload.title')}
                                    description={t('meta.upload.description')}
                                    requireAuth
>>>>>>> origin/dev
                                >
                                    <UploadPage />
                                </PageWrapper>
                            }
                        />
                        <Route
<<<<<<< HEAD
                            path="/contact"
                            element={
                                <PageWrapper
                                    title="Contact"
                                    description="Page de contact"
                                    protected
                                >
                                    <Contact />
=======
                            path="/contacts"
                            element={
                                <PageWrapper
                                    title={t('meta.contacts.title')}
                                    description={t('meta.contacts.description')}
                                    requireAuth
                                >
                                    <Contacts />
>>>>>>> origin/dev
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Mot de passe oublié"
                                    description="Récupération de mot de passe"
                                >
                                    <div>Mot de passe oublié</div>
=======
                                    title={t('meta.forgotPassword.title')}
                                    description={t('meta.forgotPassword.description')}
                                >
                                    <div>{t('meta.forgotPassword.title')}</div>
>>>>>>> origin/dev
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/subscription"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Abonnement"
                                    description="Abonnement au service Wild Transfer"
=======
                                    title={t('meta.subscription.title')}
                                    description={t('meta.subscription.description')}
>>>>>>> origin/dev
                                >
                                    <Subscription />
                                </PageWrapper>
                            }
<<<<<<< HEAD
                        />{' '}
=======
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
>>>>>>> origin/dev
                        <Route
                            path="/about"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="À propos"
                                    description="En savoir plus sur Wild Transfer"
=======
                                    title={t('meta.about.title')}
                                    description={t('meta.about.description')}
>>>>>>> origin/dev
                                >
                                    <About />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/sitemap"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="Plan du site"
                                    description="Plan du site Wild Transfer"
                                >
                                    <div>Plan du site</div>
=======
                                    title={t('meta.sitemap.title')}
                                    description={t('meta.sitemap.description')}
                                >
                                    <div>{t('meta.sitemap.title')}</div>
>>>>>>> origin/dev
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/cgu"
                            element={
<<<<<<< HEAD
                                <PageWrapper title="CGU" description="CGU">
                                    <div>CGU</div>
=======
                                <PageWrapper
                                    title={t('meta.terms.title')}
                                    description={t('meta.terms.description')}
                                >
                                    <div>{t('meta.terms.title')}</div>
>>>>>>> origin/dev
                                </PageWrapper>
                            }
                        />
                        <Route
<<<<<<< HEAD
                            path="/how-work"
                            element={<HowWork />}
=======
                            path="/how-it-works"
                            element={<PageWrapper
                                    title={t('meta.howItWorks.title')}
                                    description={t('meta.howItWorks.description')}
                                >
                                    <HowItWorks />
                                </PageWrapper>
                            }
>>>>>>> origin/dev
                        />
                        <Route
                            path="/profile"
                            element={
                                <PageWrapper
<<<<<<< HEAD
                                    title="profil"
                                    description="Page de profil"
                                    protected
                                >
                                 <Profile/>
                                </PageWrapper>

                            }
                        />
                    </Route>
=======
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
                                    adminOnly
                                >
                                    <ReportManagement />
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
>>>>>>> origin/dev
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

interface PageWrapperProps {
    children: React.ReactNode;
    title: string;
    description: string;
<<<<<<< HEAD
    protected?: boolean;
=======
    requireAuth?: boolean;
    adminOnly?: boolean;
>>>>>>> origin/dev
}

const PageWrapper = ({
    children,
    title,
    description,
<<<<<<< HEAD
    protected: isProtected,
}: PageWrapperProps) =>
    isProtected ? (
        <ProtectedRoute>
            <HeadMeta title={title} description={description} />
            {children}
        </ProtectedRoute>
    ) : (
=======
    requireAuth,
    adminOnly,
}: PageWrapperProps) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();

    // Block access to /subscription/payment if already subscribed
    if (
        user?.isSubscribed &&
        (location.pathname === '/subscription/payment')
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
>>>>>>> origin/dev
        <>
            <HeadMeta title={title} description={description} />
            {children}
        </>
    );
<<<<<<< HEAD

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
=======
};

const RequireAuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
>>>>>>> origin/dev
    const { isAuth, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuth) {
<<<<<<< HEAD
            toast.error('Vous devez être connecté pour accéder à cette page');
            navigate('/login');
        }
    }, [isAuth, loading, navigate]);
=======
            toast.error(t('auth.protectedRoute.error'));
            navigate('/login');
        }
    }, [isAuth, loading, navigate, t]);
>>>>>>> origin/dev

    if (loading) return <Loader />;
    return isAuth ? children : null;
};

<<<<<<< HEAD
=======
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

>>>>>>> origin/dev
export default App;
