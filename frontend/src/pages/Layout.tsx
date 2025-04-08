import AnimatedDiv from '@/components/background/AnimateBG';
import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Layout = () => {
    return (
        <div className="body">
            <AnimatedDiv className={'yellow'} />
            <AnimatedDiv className={'orange'} />
            <div className="blur"></div>
            <Header />
            <Sidebar />
            <main>
                <Outlet />
            </main>
            <ToastContainer position="bottom-right" theme="dark" />
        </div>
    );
};

export default Layout;
