import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/home/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;