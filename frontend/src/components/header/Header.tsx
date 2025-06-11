import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
} from '@/components/ui/menubar';
import { useAuthContext } from '@/context/useAuthContext';
import { useLogoutMutation } from '@/generated/graphql-types';
import { MenubarTrigger } from '@radix-ui/react-menubar';
import { UserIcon } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { NavigationMenu } from '../ui/navigation-menu';

const Header = () => {
    const [logout] = useLogoutMutation();
    const { refreshAuth, isAuth } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success('Déconnexion réussie');
        navigate('/');
    };

    return (
        <header className="flex lg:w-[80%] mx-auto justify-between items-center px-4 py-4 bg-white dark:bg-neutral-900 rounded-lg lg:mt-2">
            <Logo />
            <NavigationMenu className="flex gap-4">
                {isAuth && (
                    <>
                        <NavLink
                            to="/files"
                            className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                        >
                            Mes fichiers
                        </NavLink>
                        <NavLink
                            to="/upload"
                            className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                        >
                            Transférez vos fichiers
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                        >
                            Gestion des contacts
                        </NavLink>
                    </>
                )}
                <NavLink
                    to="/subscription"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Abonnements
                </NavLink>
                <NavLink
                    to="/about"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Qui sommes nous ?
                </NavLink>
                <NavLink
                    to="/how-work"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Comment ça marche
                </NavLink>
                <NavLink
                    to="/contact"
                    className="block p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                    Contact
                </NavLink>
            </NavigationMenu>

            <div className="flex items-center gap-4">
                <Menubar className="border-none shadow-none bg-transparent">
                    <MenubarMenu>
                        <MenubarTrigger
                            aria-label={
                                isAuth ? 'Menu utilisateur' : 'Connexion'
                            }
                        >
                            {isAuth ? (
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            ) : (
                                <UserIcon />
                            )}
                        </MenubarTrigger>
                        <MenubarContent>
                            {!isAuth ? (
                                <>
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
                                </>
                            ) : (
                                <MenubarItem asChild>
                                    <Button
                                        className="cursor-pointer w-full"
                                        onClick={handleLogout}
                                    >
                                        Deconnexion
                                    </Button>
                                </MenubarItem>
                            )}
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <ModeToggle />
            </div>
        </header>
    );
};

export default Header;
