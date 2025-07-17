import HeaderBand from '@/components/HeaderBand';
import Header from '@/components/header/Header';
import HeaderMobile from '@/components/header/MobileHeader';
import { ThemeProvider } from '@/components/themeProvider';
import { useEnv } from '@/hooks/useEnv';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const { theme } = useTheme();
    const { isFeatureEnabled } = useEnv();
    const { t } = useTranslation();

    return (
        <ThemeProvider>
            {isFeatureEnabled('homeDisclaimer') && (
                <HeaderBand type="warning" text={t('home.disclaimer')} />
            )}

            <main>
                <div className="hidden md:block">
                    <Header />
                </div>

                <HeaderMobile />

                <div
                    className={cn(
                        isHomePage
                            ? 'pt-16 md:pt-0'
                            : 'w-[90%] md:w-[80%] mx-auto mt-10 pt-16 md:pt-0',
                    )}
                >
                    <Outlet />
                </div>
                <ToastContainer
                    position="bottom-right"
                    theme={theme === 'dark' ? 'light' : 'dark'}
                />
            </main>
        </ThemeProvider>
    );
};

export default Layout;
