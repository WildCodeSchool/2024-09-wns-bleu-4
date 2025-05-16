import { useLogoutMutation } from "@/generated/graphql-types";
import { useAuth } from "@/hooks/useAuth";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ModeToggle } from "../mode-toggle";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator } from "@radix-ui/react-menubar";
import { Menu, UserIcon, X } from "lucide-react";
import { NavigationMenu } from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MenubarTrigger } from "../ui/menubar";
import { useState } from "react";

const HeaderMobile = () => {
    const [logout] = useLogoutMutation();
    const { authLogout, isAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        authLogout();
        toast.success('Déconnexion réussie');
        navigate('/');
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
        const menu = document.querySelector('.openMenu');
        if (menu) {
            menu.classList.toggle('active');
            document.querySelector('.headerMobile')?.classList.toggle('active');
        }
    };

    return (
        <>
            <button className="openMenu" onClick={handleMenuClick}>
                {isMenuOpen ? <X/> : <Menu />}
            </button>
            <header className="headerMobile bg-white dark:bg-neutral-900">
                <NavigationMenu className="mb-7 headerMobile__nav grid gap-6 text-center">
                    <NavLink
                        to="/upload"
                        className="block hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                    >
                        Transférez vos fichiers
                    </NavLink>
                    <NavLink
                        to="/subscription"
                        className="block hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                    >
                        Nos abonnements
                    </NavLink>
                    <NavLink
                        to="/about"
                        className="block hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                    >
                        Qui sommes nous ?
                    </NavLink>
                    <NavLink
                        to="/how-work"
                        className="block hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                    >
                        Comment ça marche
                    </NavLink>
                </NavigationMenu>
                <div className="flex items-center gap-6">
                    <Menubar className="border-none shadow-none bg-transparent">
                        <MenubarMenu>
                            <MenubarTrigger>
                            {isAuth ? 
                            <>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar> 
                            </>
                            :
                                <UserIcon />}
                        </MenubarTrigger>
                        <MenubarContent>
                            {!isAuth ?
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
                                :
                                <MenubarItem asChild>
                                    <Button
                                        className="cursor-pointer w-full"
                                        onClick={handleLogout}
                                    >
                                        Deconnexion
                                    </Button>
                                </MenubarItem>
                            }
                        </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <ModeToggle />
                </div>
            </header>
        </>
    );
};



export default HeaderMobile;