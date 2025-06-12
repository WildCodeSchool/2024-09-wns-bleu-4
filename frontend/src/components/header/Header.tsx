import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { useAuthContext } from '@/context/useAuthContext';
import { useLogoutMutation } from '@/generated/graphql-types';
import { ChevronDown, CreditCard, Files, HelpCircle, Info, LogOut, Menu, Upload, User, UserIcon, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
    const [logout] = useLogoutMutation();
    const { refreshAuth, isAuth } = useAuthContext();
    const navigate = useNavigate();

    const { user } = useAuthContext();

    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success('Déconnexion réussie');
        navigate('/');
    };

    return (
        <header className="flex lg:w-[80%] mx-auto justify-between items-center px-4 py-4 rounded-lg lg:mt-2">
            <Logo />
            <NavigationMenu className="hidden md:flex gap-2">
                {isAuth && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex cursor-pointer items-center gap-1">
                                <Files className="h-4 w-4" />
                                Mes fichiers
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>Mon espace</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/files" className="flex items-center gap-2">
                                    <Files className="h-4 w-4" />
                                    Mes fichiers
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/upload" className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Transférer fichiers
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/contact" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Mes contacts
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex cursor-pointer items-center gap-1">
                            <Info className="h-4 w-4" />
                            Découvrir
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuLabel>À propos</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/about" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Qui sommes nous ?
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/how-work" className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" />
                                Comment ça marche
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" asChild>
                    <Link to="/subscription" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Abonnements
                    </Link>
                </Button>
            </NavigationMenu>

            {/* Menu mobile */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu navigation</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isAuth && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link to="/files" className="flex items-center gap-2">
                                        <Files className="h-4 w-4" />
                                        Mes fichiers
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/upload" className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Transférer fichiers
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/contact" className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Mes contacts
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem asChild>
                            <Link to="/subscription" className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Abonnements
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/about" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Qui sommes nous ?
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/how-work" className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" />
                                Comment ça marche
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="relative h-10 w-10 rounded-full cursor-pointer"
                            aria-label={isAuth ? 'Menu utilisateur' : 'Connexion'}
                        >
                            {isAuth ? (
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            ) : (
                                <UserIcon className="h-5 w-5" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        {!isAuth ? (
                            <>
                                <DropdownMenuLabel>
                                    Authentification
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/login"
                                        className="cursor-pointer w-full flex items-center gap-2"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        Connexion
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/sign"
                                        className="cursor-pointer w-full flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Inscription
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuLabel>
                                    Mon compte
                                </DropdownMenuLabel>
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    {user?.email}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/profile"
                                        className="cursor-pointer w-full flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Profil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Déconnexion
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
            </div>
        </header>
    );
};

export default Header;
