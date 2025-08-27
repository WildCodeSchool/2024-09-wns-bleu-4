<<<<<<< HEAD
=======
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserAvatar } from '@/components/UserAvatar';
>>>>>>> origin/dev
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
<<<<<<< HEAD
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
=======
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
>>>>>>> origin/dev

const HeaderMobile = () => {
    const [logout] = useLogoutMutation();
    const { isAuth, user, refreshAuth } = useAuthContext();
    const navigate = useNavigate();
<<<<<<< HEAD
=======
    const { t } = useTranslation();
>>>>>>> origin/dev

    const handleLogout = async () => {
        await logout();
        refreshAuth();
<<<<<<< HEAD
        toast.success('Déconnexion réussie');
=======
        toast.success(t('auth.logoutSuccess'));
>>>>>>> origin/dev
        navigate('/');
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
<<<<<<< HEAD
            <div className="flex items-center justify-between px-4 py-3">
                <Logo />
                <div className="flex items-center gap-2">
=======
            <div className="flex items-center w-[90%] mx-auto justify-between py-3">
                <Logo />
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
>>>>>>> origin/dev
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
<<<<<<< HEAD
                                    Menu de navigation
=======
                                    {t('navigation.menu')}
>>>>>>> origin/dev
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 p-0">
                            <SheetHeader className="border-b px-6 py-4">
                                <SheetTitle className="text-left">
<<<<<<< HEAD
                                    Navigation
=======
                                    {t('navigation.title')}
>>>>>>> origin/dev
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col h-full">
                                <nav className="flex flex-col gap-1 p-4">
                                    <Link
                                        to="/upload"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Upload className="h-4 w-4" />
<<<<<<< HEAD
                                        Transférez vos fichiers
=======
                                        {t('navigation.upload')}
>>>>>>> origin/dev
                                    </Link>

                                    {isAuth && (
                                        <>
                                            <Link
                                                to="/files"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Files className="h-4 w-4" />
<<<<<<< HEAD
                                                Mes fichiers
                                            </Link>
                                            <Link
                                                to="/contact"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Users className="h-4 w-4" />
                                                Mes contacts
=======
                                                {t('navigation.files')}
                                            </Link>
                                            <Link
                                                to="/contacts"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Users className="h-4 w-4" />
                                                {t('navigation.contacts')}
>>>>>>> origin/dev
                                            </Link>
                                        </>
                                    )}

                                    <Link
                                        to="/subscription"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <CreditCard className="h-4 w-4" />
<<<<<<< HEAD
                                        Abonnements
=======
                                        {t('navigation.subscription')}
>>>>>>> origin/dev
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Info className="h-4 w-4" />
<<<<<<< HEAD
                                        Qui sommes nous ?
=======
                                        {t('navigation.whoAreWe')}
>>>>>>> origin/dev
                                    </Link>
                                    <Link
                                        to="/how-work"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <HelpCircle className="h-4 w-4" />
<<<<<<< HEAD
                                        Comment ça marche
=======
                                        {t('navigation.howItWorks')}
>>>>>>> origin/dev
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
<<<<<<< HEAD
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                            <AvatarFallback>
                                                                CN
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-medium">
                                                                Mon compte
=======
                                                        <UserAvatar
                                                            user={user}
                                                            size="sm"
                                                        />
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-medium">
                                                                {t(
                                                                    'navigation.myAccount',
                                                                )}
>>>>>>> origin/dev
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
<<<<<<< HEAD
                                                                Se connecter
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Accéder à mon
                                                                compte
=======
                                                                {t(
                                                                    'navigation.logIn',
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {t(
                                                                    'auth.form.title',
                                                                )}
>>>>>>> origin/dev
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
<<<<<<< HEAD
                                                        Authentification
=======
                                                        {t('auth.title')}
>>>>>>> origin/dev
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/login"
                                                            className="cursor-pointer w-full flex items-center gap-2"
                                                        >
                                                            <UserIcon className="h-4 w-4" />
<<<<<<< HEAD
                                                            Connexion
=======
                                                            {t(
                                                                'navigation.logIn',
                                                            )}
>>>>>>> origin/dev
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/sign"
                                                            className="cursor-pointer w-full flex items-center gap-2"
                                                        >
                                                            <User className="h-4 w-4" />
<<<<<<< HEAD
                                                            Inscription
=======
                                                            {t(
                                                                'navigation.signUp',
                                                            )}
>>>>>>> origin/dev
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <>
                                                    <DropdownMenuLabel>
<<<<<<< HEAD
                                                        Mon compte
=======
                                                        {t(
                                                            'navigation.myAccount',
                                                        )}
>>>>>>> origin/dev
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/profile"
                                                            className="cursor-pointer w-full flex items-center gap-2"
                                                        >
                                                            <User className="h-4 w-4" />
<<<<<<< HEAD
                                                            Profil
=======
                                                            {t(
                                                                'navigation.profile',
                                                            )}
>>>>>>> origin/dev
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={handleLogout}
                                                        className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
                                                    >
                                                        <LogOut className="h-4 w-4" />
<<<<<<< HEAD
                                                        Déconnexion
=======
                                                        {t('navigation.logOut')}
>>>>>>> origin/dev
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
