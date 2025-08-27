<<<<<<< HEAD
import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
=======
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/mode-toggle';
import SubscribedLogo from '@/components/SubscribedLogo';
import StorageProgress from '@/components/StorageProgress';
>>>>>>> origin/dev
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
<<<<<<< HEAD
import { useAuthContext } from '@/context/useAuthContext';
import { useLogoutMutation } from '@/generated/graphql-types';
import { ChevronDown, CreditCard, Files, HelpCircle, Info, LogOut, Menu, Upload, User, UserIcon, Users } from 'lucide-react';
=======
import { UserAvatar } from '@/components/UserAvatar';
import { useAuthContext } from '@/context/useAuthContext';
import { useLogoutMutation } from '@/generated/graphql-types';
import {
    ChevronDown,
    CreditCard,
    Files,
    HelpCircle,
    Info,
    LogOut,
    Menu,
    Shield,
    Upload,
    User,
    UserIcon,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
>>>>>>> origin/dev
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
    const [logout] = useLogoutMutation();
<<<<<<< HEAD
    const { refreshAuth, isAuth } = useAuthContext();
=======
    const { refreshAuth, isAuth } = useAuth();
>>>>>>> origin/dev
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuthContext();

<<<<<<< HEAD
    const { user } = useAuthContext();

    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success('Déconnexion réussie');
=======
    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success(t('auth.logoutSuccess'));
>>>>>>> origin/dev
        navigate('/');
    };

    return (
<<<<<<< HEAD
        <header className="flex lg:w-[80%] mx-auto justify-between items-center px-4 py-4 rounded-lg lg:mt-2">
=======
        <header className="flex lg:w-[80%] mx-auto justify-between items-center py-4 rounded-lg lg:mt-2">
>>>>>>> origin/dev
            <Logo />
            <NavigationMenu className="hidden md:flex gap-2">
                {isAuth && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                            <Button variant="ghost" className="flex cursor-pointer items-center gap-1">
                                <Files className="h-4 w-4" />
                                Mes fichiers
=======
                            <Button
                                variant="ghost"
                                className="flex cursor-pointer items-center gap-1"
                            >
                                <Files className="h-4 w-4" />
                                {t('navigation.files')}
>>>>>>> origin/dev
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
<<<<<<< HEAD
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
=======
                            <DropdownMenuLabel>
                                {t('navigation.mySpace')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/files"
                                    className="flex items-center gap-2"
                                >
                                    <Files className="h-4 w-4" />
                                    {t('navigation.files')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/upload"
                                    className="flex items-center gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    {t('navigation.upload')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/contacts"
                                    className="flex items-center gap-2"
                                >
                                    <Users className="h-4 w-4" />
                                    {t('navigation.contacts')}
>>>>>>> origin/dev
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
<<<<<<< HEAD
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex cursor-pointer items-center gap-1">
                            <Info className="h-4 w-4" />
                            Découvrir
=======

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex cursor-pointer items-center gap-1"
                        >
                            <Info className="h-4 w-4" />
                            {t('navigation.discover')}
>>>>>>> origin/dev
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
<<<<<<< HEAD
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
=======
                        <DropdownMenuLabel>
                            {t('navigation.about')}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                to="/about"
                                className="flex items-center gap-2"
                            >
                                <Info className="h-4 w-4" />
                                {t('navigation.whoAreWe')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/how-it-works"
                                className="flex items-center gap-2"
                            >
                                <HelpCircle className="h-4 w-4" />
                                {t('navigation.howItWorks')}
>>>>>>> origin/dev
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" asChild>
<<<<<<< HEAD
                    <Link to="/subscription" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Abonnements
                    </Link>
                </Button>
=======
                    <Link
                        to="/subscription"
                        className="flex items-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        {t('navigation.subscription')}
                    </Link>
                </Button>

                {isAuth && user?.role === 'ADMIN' && (
                    <Button variant="ghost" asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {t('navigation.administration')}
                        </Link>
                    </Button>
                )}
>>>>>>> origin/dev
            </NavigationMenu>

            {/* Menu mobile */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Menu className="h-5 w-5" />
<<<<<<< HEAD
                            <span className="sr-only">Menu navigation</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
=======
                            <span className="sr-only">
                                {t('navigation.menu')}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            {t('navigation.title')}
                        </DropdownMenuLabel>
>>>>>>> origin/dev
                        <DropdownMenuSeparator />
                        {isAuth && (
                            <>
                                <DropdownMenuItem asChild>
<<<<<<< HEAD
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
=======
                                    <Link
                                        to="/files"
                                        className="flex items-center gap-2"
                                    >
                                        <Files className="h-4 w-4" />
                                        {t('navigation.files')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/upload"
                                        className="flex items-center gap-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {t('navigation.upload')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/contacts"
                                        className="flex items-center gap-2"
                                    >
                                        <Users className="h-4 w-4" />
                                        {t('navigation.contacts')}
                                    </Link>
                                </DropdownMenuItem>
                                {user?.role === 'ADMIN' && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/admin"
                                            className="flex items-center gap-2"
                                        >
                                            <Shield className="h-4 w-4" />
                                            {t('navigation.administration')}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
>>>>>>> origin/dev
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem asChild>
<<<<<<< HEAD
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
=======
                            <Link
                                to="/subscription"
                                className="flex items-center gap-2"
                            >
                                <CreditCard className="h-4 w-4" />
                                {t('navigation.subscription')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/about"
                                className="flex items-center gap-2"
                            >
                                <Info className="h-4 w-4" />
                                {t('navigation.whoAreWe')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                to="/how-it-works"
                                className="flex items-center gap-2"
                            >
                                <HelpCircle className="h-4 w-4" />
                                {t('navigation.howItWorks')}
>>>>>>> origin/dev
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
<<<<<<< HEAD
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
=======
                    {isAuth && (
                        user?.isSubscribed ? (
                            <SubscribedLogo />
                        ) : (
                            <StorageProgress
                                bytesUsed={user?.storage?.bytesUsed ?? '0 Bytes'}
                                percentage={user?.storage?.percentage ?? 0}
                            />
                        )
                    )}
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative h-10 w-10 rounded-full cursor-pointer"
                            aria-label={
                                isAuth
                                    ? t('navigation.userMenu')
                                    : t('navigation.login')
                            }
                        >
                            {isAuth ? (
                                <UserAvatar user={user} size="md" />
>>>>>>> origin/dev
                            ) : (
                                <UserIcon className="h-5 w-5" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
<<<<<<< HEAD
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        {!isAuth ? (
                            <>
                                <DropdownMenuLabel>
                                    Authentification
=======
                    <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                    >
                        {!isAuth ? (
                            <>
                                <DropdownMenuLabel>
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
                                        {t('auth.logIn.title')}
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
                                        {t('auth.signUp.title')}
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
                                    {t('navigation.myAccount')}
>>>>>>> origin/dev
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
<<<<<<< HEAD
                                        Profil
                                    </Link>
                                </DropdownMenuItem>
=======
                                        {t('navigation.profile')}
                                    </Link>
                                </DropdownMenuItem>
                                {user?.role === 'ADMIN' && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/admin"
                                            className="cursor-pointer w-full flex items-center gap-2"
                                        >
                                            <Shield className="h-4 w-4" />
                                            {t('navigation.admin')}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
>>>>>>> origin/dev
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
<<<<<<< HEAD
=======
                <LanguageSwitcher />
>>>>>>> origin/dev
                <ModeToggle />
            </div>
        </header>
    );
};

export default Header;
