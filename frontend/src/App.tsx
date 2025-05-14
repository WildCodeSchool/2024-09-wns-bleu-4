import HeadMeta from '@/components/HeadMeta';
import { AuthProvider } from '@/context/AuthContext';
import FilesPage from '@/pages/Files/files';
import Home from '@/pages/Home/Home';
import Layout from '@/pages/Layout';
import Login from '@/pages/Log/Login';
import Sign from '@/pages/Sign/sign';
import UploadPage from '@/pages/Upload/UploadPage';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './hooks/useAuth';

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <>
                                    <HeadMeta
                                        title="Acceuil"
                                        description="Acceuil du site Wild Transfer"
                                    />
                                    <Home />
                                </>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <>
                                    <HeadMeta
                                        title="Connexion"
                                        description="Connexion à un compte Wild Transfer"
                                    />
                                    <Login />
                                </>
                            }
                        />
                        <Route
                            path="/sign"
                            element={
                                <>
                                    <HeadMeta
                                        title="Inscription"
                                        description="Création de compte Wild Transfer"
                                    />
                                    <Sign />
                                </>
                            }
                        />
                        <Route
                            path="/files"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <HeadMeta
                                            title="Mes Fichiers"
                                            description="Page de vos fichiers"
                                        />
                                        <FilesPage />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <HeadMeta
                                            title="Téléversement"
                                            description="Téléversement de fichiers"
                                        />
                                        <UploadPage />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={<div>Mot de passe oublié</div>}
                        />
                        <Route
                            path="/subscription"
                            element={<div>Abonnement</div>}
                        />
                        <Route path="/about" element={<div>À propos</div>} />
                        <Route
                            path="/sitemap"
                            element={<div>Plan du site</div>}
                        />
                        <Route path="/cgu" element={<div>CGU</div>} />
                        <Route
                            path="/privacy-policy"
                            element={<div>Politique de confidentialité</div>}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            toast.error('Vous devez être connecté pour accéder à cette page');
            navigate('/login');
        }
    }, [isAuth, navigate]);

    return isAuth ? children : null;
};

export default App;
