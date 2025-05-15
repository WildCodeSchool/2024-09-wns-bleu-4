import { useLogoutMutation } from "@/generated/graphql-types";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ModeToggle } from "../mode-toggle";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator } from "@radix-ui/react-menubar";
import { Menu } from "lucide-react";

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

    return (
        <>
            <button><Menu/></button>
            <header className="headerMobile mt-4">
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
        </>
    );
};



export default HeaderMobile;