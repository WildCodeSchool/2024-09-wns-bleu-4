import Header from '@/components/header/Header';
import HeaderMobile from '@/components/header/MobileHeader';
import { ThemeProvider } from '@/components/theme-provider';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Layout = () => {
    return (
        <ThemeProvider>
            <main className="">
                {window.innerWidth < 999 ? <HeaderMobile/> : <Header />}
                <div className="">
                    <Outlet />
                </div>
                <ToastContainer position="bottom-right" theme="dark" />
            </main>
        </ThemeProvider>
    );
};

export default Layout;
