import Header from '@/components/header/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Layout = () => {
    return (
        <ThemeProvider>
            <main className="bg-gray-100 dark:bg-gray-900 min-h-screen">
                <Header />

                <section>
                    <Outlet />
                </section>
                <ToastContainer position="bottom-right" theme="dark" />
            </main>
        </ThemeProvider>
    );
};

export default Layout;
