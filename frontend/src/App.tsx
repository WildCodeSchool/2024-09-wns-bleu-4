import Home from '@/pages/Home/Home';
import Layout from '@/pages/Layout';
import Login from '@/pages/Log/Login';
import Sign from '@/pages/Sign/sign';
import FilesPage from '@/pages/Files/files';
import UploadPage from '@/pages/Upload/UploadPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HeadMeta from '@/components/HeadMeta';
import { useAuth } from '@/hooks/useAuth';
import { AuthContext } from '@/context/AuthContext';

const App = () => {
    const { user, setUser } = useAuth();

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <BrowserRouter>
                <Routes>
                    {/* 
                        Avec cette config la barre latérale "importé dans Layout" reste toujours visible à gauche.
                    */}

                    <Route path="/" element={<Layout />}>
                        <Route index element={<><HeadMeta title="Acceuil" description="Acceuil du site Wild Transfer" /><Home /></>} />
                        <Route path="/login" element={<><HeadMeta title="Connexion" description="Connexion à un compte Wild Transfer" /><Login /></>} />
                        <Route path="/sign" element={<><HeadMeta title="Inscription" description="Création de compte Wild Transfer" /><Sign /></>} />
                        <Route path="/files" element={<><HeadMeta title="Mes Fichiers" description="Page de vos fichiers" /><FilesPage /></>} />
                        <Route path="/upload" element={<><HeadMeta title="Téléversement" description="Téléversement de fichiers" /><UploadPage /></>} />
                        <Route
                            path="/forgot-password"
                            element={<div>Mot de passe oublié</div>}
                        />
                        <Route
                            path="/subscription"
                            element={<div>Abonnement</div>}
                        />
                        <Route path="/about" element={<div>À propos</div>} />
                        <Route path="/sitemap" element={<div>Plan du site</div>} />
                        <Route path="/cgu" element={<div>CGU</div>} />
                        <Route
                            path="/privacy-policy"
                            element={<div>Politique de confidentialité</div>}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;
