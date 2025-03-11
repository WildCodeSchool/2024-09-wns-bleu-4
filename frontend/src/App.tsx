import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Log/Login';
import Sign from './pages/Sign/sign';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 
                    Avec cette config la barre latérale "importé dans Layout" reste toujours visible à gauche.
                */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign" element={<Sign />} />
                    <Route path="/subscription" element={<div>Abonnement</div>} />
                    <Route path="/about" element={<div>À propos</div>} />
                    <Route path="/sitemap" element={<div>Plan du site</div>} />
                    <Route path="/cgu" element={<div>CGU</div>} />
                    <Route path="/privacy-policy" element={<div>Politique de confidentialité</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
