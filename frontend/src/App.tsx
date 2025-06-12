import HeadMeta from '@/components/HeadMeta';
import { Loader } from '@/components/Loader';
import { AuthProvider } from '@/context/AuthContext';
import Contact from '@/pages/Contact/contact';
import FilesPage from '@/pages/Files/files';
import Home from '@/pages/Home/Home';
import Subscription from './pages/Subscription/subscription';
import Layout from '@/pages/Layout';
import Login from '@/pages/Log/Login';
import Sign from '@/pages/Sign/sign';
import UploadPage from '@/pages/Upload/UploadPage';
import About from '@/pages/About/about';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './hooks/useAuth';
import HowWork from '@/pages/HowWork';
import { Profile } from '@/pages/Profile/profile';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <PageWrapper
                                    title="Acceuil"
                                    description="Acceuil du site Wild Transfer"
                                >
                                    <Home />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PageWrapper
                                    title="Connexion"
                                    description="Connexion à un compte Wild Transfer"
                                >
                                    <Login />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/sign"
                            element={
                                <PageWrapper
                                    title="Inscription"
                                    description="Création de compte Wild Transfer"
                                >
                                    <Sign />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/files"
                            element={
                                <PageWrapper
                                    title="Mes Fichiers"
                                    description="Page de vos fichiers"
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
                                    title="Transférer des fichiers"
                                    description="Transfert de fichiers"
                                    protected
                                >
                                    <UploadPage />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <PageWrapper
                                    title="Contact"
                                    description="Page de contact"
                                    protected
                                >
                                    <Contact />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <PageWrapper
                                    title="Mot de passe oublié"
                                    description="Récupération de mot de passe"
                                >
                                    <div>Mot de passe oublié</div>
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/subscription"
                            element={
                                <PageWrapper
                                    title="Abonnement"
                                    description="Abonnement au service Wild Transfer"
                                >
                                    <Subscription />
                                </PageWrapper>
                            }
                        />{' '}
                        <Route
                            path="/about"
                            element={
                                <PageWrapper
                                    title="À propos"
                                    description="En savoir plus sur Wild Transfer"
                                >
                                    <About />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/sitemap"
                            element={
                                <PageWrapper
                                    title="Plan du site"
                                    description="Plan du site Wild Transfer"
                                >
                                    <div>Plan du site</div>
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/cgu"
                            element={
                                <PageWrapper title="CGU" description="CGU">
                                    <div>CGU</div>
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/how-work"
                            element={<HowWork />}
                        />
                        <Route
                            path="/profile"
                            element={
                                <PageWrapper
                                    title="profil"
                                    description="Page de profil"
                                    protected
                                >
                                 <Profile/>
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
    const { isAuth, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuth) {
            toast.error('Vous devez être connecté pour accéder à cette page');
            navigate('/login');
        }
    }, [isAuth, loading, navigate]);

    if (loading) return <Loader />;
    return isAuth ? children : null;
};

export default App;
