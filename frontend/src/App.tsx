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
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { Profile } from '@/pages/Profile/profile';
import HowItWorks from '@/pages/HowItWorks';
import { useTranslation } from 'react-i18next';

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
                                    protected
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
                                    protected
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
                                    protected
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
                                    protected
                                >
                                    <Profile />
                                </PageWrapper>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

interface PageWrapperProps {
    children: React.ReactNode;
    title: string;
    description: string;
    protected?: boolean;
}

const PageWrapper = ({
    children,
    title,
    description,
    protected: isProtected,
}: PageWrapperProps) =>
    isProtected ? (
        <ProtectedRoute>
            <HeadMeta title={title} description={description} />
            {children}
        </ProtectedRoute>
    ) : (
        <>
            <HeadMeta title={title} description={description} />
            {children}
        </>
    );

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

export default App;
