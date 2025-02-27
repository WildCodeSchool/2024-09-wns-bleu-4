import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/home/Home';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 
                    Avec cette config la barre latérale "importé dans Layout" reste toujours visible à gauche.
                */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
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
