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
                    <Route path="/option1" element={<div>Option 1</div>} />
                    <Route path="/option2" element={<div>Option 2</div>} />
                    <Route
                        path="/abonnements"
                        element={<div>Abonnements</div>}
                    />
                    <Route path="/cas1" element={<div>Cas 1</div>} />
                    <Route path="/cas2" element={<div>Cas 2</div>} />
                    <Route path="/a-propos" element={<div>À propos</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
