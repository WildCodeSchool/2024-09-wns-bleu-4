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
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '../ui/navigation-menu';

const Header = () => {
    const [logout] = useLogoutMutation();
    const { authLogout, isAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        authLogout();
        logout();
        toast.success('Déconnexion réussie');
        navigate('/');
    };

    return (
        <header className="flex lg:w-[80%] mx-auto justify-between items-center px-4 py-4 bg-white dark:bg-gray-800">
            <Logo />

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            Possibilités
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 md:w-[400px] lg:w-[500px] space-y-2">
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/"
                                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        Toutes les possibilités
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/files"
                                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        Explorer les fichiers
                                    </Link>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            Ressources
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="p-4 md:w-[400px] lg:w-[500px] space-y-2">
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/subscription"
                                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        Abonnements
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/about"
                                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        À propos
                                    </Link>
                                </NavigationMenuLink>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
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
