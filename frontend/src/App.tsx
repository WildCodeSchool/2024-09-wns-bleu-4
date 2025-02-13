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
                    <Route path="/abonnement" element={<div>Abonnement</div>} />
                    <Route path="/a-propos" element={<div>À propos</div>} />
                    <Route path="/plan-site" element={<div>Plan du site</div>} />
                    <Route path="/cgu" element={<div>CGU</div>} />
                    <Route path="/politique-confidentialite" element={<div>Politique de confidentialité</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
