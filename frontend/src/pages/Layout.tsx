import Header from '@/components/header/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <ThemeProvider>
            <main className="">
                <Header />

                <div className={cn(isHomePage ? '' : 'w-[80%] mx-auto mt-10')}>
                    <Outlet />
                </div>
                <ToastContainer position="bottom-right" theme="dark" />
            </main>
        </ThemeProvider>
    );
};

export default Layout;
