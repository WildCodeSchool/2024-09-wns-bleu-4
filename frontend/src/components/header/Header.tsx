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
import SubscribedLogo from '@/components/SubscribedLogo';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
    const [logout] = useLogoutMutation();
    const { refreshAuth, isAuth } = useAuthContext();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuthContext();

    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success(t('auth.logoutSuccess'));
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
                                {t('navigation.files')}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>{t('navigation.mySpace')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/files" className="flex items-center gap-2">
                                    <Files className="h-4 w-4" />
                                    {t('navigation.files')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/upload" className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    {t('navigation.upload')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/contacts" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {t('navigation.contacts')}
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex cursor-pointer items-center gap-1">
                            <Info className="h-4 w-4" />
                            {t('navigation.discover')}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuLabel>{t('navigation.about')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/about" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                {t('navigation.whoAreWe')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/how-it-works" className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" />
                                {t('navigation.howItWorks')}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" asChild>
                    <Link to="/subscription" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {t('navigation.subscription')}
                    </Link>
                </Button>
            </NavigationMenu>

            {/* Menu mobile */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">{t('navigation.menu')}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{t('navigation.title')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isAuth && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link to="/files" className="flex items-center gap-2">
                                        <Files className="h-4 w-4" />
                                        {t('navigation.files')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/upload" className="flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        {t('navigation.upload')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/contacts" className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {t('navigation.contacts')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem asChild>
                            <Link to="/subscription" className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                {t('navigation.subscription')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/about" className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                {t('navigation.whoAreWe')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/how-it-works" className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" />
                                {t('navigation.howItWorks')}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    {isAuth && user?.isSubscribed && (
                        <SubscribedLogo />
                    )}
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="relative h-10 w-10 rounded-full cursor-pointer"
                            aria-label={isAuth ? t('navigation.userMenu') : t('navigation.login')}
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
                                    {t('auth.title')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/login"
                                        className="cursor-pointer w-full flex items-center gap-2"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        {t('auth.logIn.title')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/sign"
                                        className="cursor-pointer w-full flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        {t('auth.signUp.title')}
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuLabel>
                                    {t('navigation.myAccount')}
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
                                        {t('navigation.profile')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {t('navigation.logOut')}
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <LanguageSwitcher />
                <ModeToggle />
            </div>
        </header>
    );
};

export default Header;
