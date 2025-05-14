import Logo from '@/components/Logo';
import { useLogoutMutation } from '@/generated/graphql-types';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ModeToggle } from '../mode-toggle';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
} from '../ui/menubar';
import {
    NavigationMenu,
} from '../ui/navigation-menu';

const Header = () => {
    const [logout] = useLogoutMutation();
    const { authLogout, isAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        authLogout();
        toast.success('Déconnexion réussie');
        navigate('/');
    };

    return (
        <header className="flex lg:w-[80%] mx-auto justify-between items-center px-4 py-4 bg-white dark:bg-neutral-900 rounded-lg lg:mt-2">
            <Logo />

            <NavigationMenu className="flex gap-4">
                <Link
                    to="/upload"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Transférez vos fichiers
                </Link>
                <Link
                    to="/subscription"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Nos abonnements
                </Link>
                <Link
                    to="/about"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Qui sommes nous ?
                </Link>
                <Link
                    to="/how-work"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                   Comment ça marche
                </Link>
            </NavigationMenu>

            <div className="flex items-center gap-4">
                {isAuth ? (
                    <button
                        name="logout"
                        className="cursor-pointer px-4 py-1 rounded-md"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </button>
                ) : (
                    <Menubar className="border-none shadow-none bg-transparent">
                        <MenubarMenu>
                            <MenubarContent>
                                <MenubarItem asChild>
                                    <Link
                                        to="/login"
                                        className="cursor-pointer w-full"
                                    >
                                        Connexion
                                    </Link>
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem asChild>
                                    <Link
                                        to="/sign"
                                        className="cursor-pointer w-full"
                                    >
                                        Inscription
                                    </Link>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                )}
                <ModeToggle />
            </div>
        </header>
    );
};



export default Header;