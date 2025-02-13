import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Login from '../components/Login';

const Layout = () => {
    return (
        <div className="flex h-screen relative">
            <div className="absolute top-4 right-4">
                <Login />
            </div>

            <Sidebar />

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
