import { useAuthContext } from '@/context/useAuthContext';
import { useLogoutMutation } from '@/generated/graphql-types';
import {
    CreditCard,
    Files,
    HelpCircle,
    Info,
    LogOut,
    Menu,
    Upload,
    User,
    UserIcon,
    Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../Logo';
import { ModeToggle } from '../mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../ui/sheet';

const HeaderMobile = () => {
    const [logout] = useLogoutMutation();
    const { isAuth, user, refreshAuth } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success('Déconnexion réussie');
        navigate('/');
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
                <Logo />
                <div className="flex items-center gap-2">
                    <ModeToggle />

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Menu de navigation
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 p-0">
                            <SheetHeader className="border-b px-6 py-4">
                                <SheetTitle className="text-left">
                                    Navigation
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col h-full">
                                <nav className="flex flex-col gap-1 p-4">
                                    <Link
                                        to="/upload"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Transférez vos fichiers
                                    </Link>

                                    {isAuth && (
                                        <>
                                            <Link
                                                to="/files"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Files className="h-4 w-4" />
                                                Mes fichiers
                                            </Link>
                                            <Link
                                                to="/contacts"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Users className="h-4 w-4" />
                                                Mes contacts
                                            </Link>
                                        </>
                                    )}

                                    <Link
                                        to="/subscription"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Abonnements
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Info className="h-4 w-4" />
                                        Qui sommes nous ?
                                    </Link>
                                    <Link
                                        to="/how-work"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <HelpCircle className="h-4 w-4" />
                                        Comment ça marche
                                    </Link>
                                </nav>

                                <div className="mt-auto p-4 border-t">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full h-auto p-3 justify-start gap-3"
                                            >
                                                {isAuth ? (
                                                    <>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                            <AvatarFallback>
                                                                CN
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-medium">
                                                                Mon compte
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {user?.email}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserIcon className="h-8 w-8" />
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-medium">
                                                                Se connecter
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Accéder à mon
                                                                compte
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-56"
                                            align="end"
                                            forceMount
                                        >
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
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};

export default HeaderMobile;
