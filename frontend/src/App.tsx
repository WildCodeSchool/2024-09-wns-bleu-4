import Home from '@/pages/home/Home';
import Layout from '@/pages/Layout';
import Login from '@/pages/Log/Login';
import Sign from '@/pages/Sign/sign';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* 
                    Avec cette config la barre latérale "importé dans Layout" reste toujours visible à gauche.
                */}

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/sign" element={<Sign />} />
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
            <ToastContainer position="bottom-right" theme="dark" />
        </>
    );
};

export default App;
