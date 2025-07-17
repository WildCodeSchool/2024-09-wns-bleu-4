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
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const HeaderMobile = () => {
    const [logout] = useLogoutMutation();
    const { isAuth, user, refreshAuth } = useAuthContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        refreshAuth();
        toast.success(t('auth.logoutSuccess'));
        navigate('/');
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
            <div className="flex items-center w-[90%] mx-auto justify-between py-3">
                <Logo />
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
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
                                    {t('navigation.menu')}
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 p-0">
                            <SheetHeader className="border-b px-6 py-4">
                                <SheetTitle className="text-left">
                                    {t('navigation.title')}
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col h-full">
                                <nav className="flex flex-col gap-1 p-4">
                                    <Link
                                        to="/upload"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {t('navigation.upload')}
                                    </Link>

                                    {isAuth && (
                                        <>
                                            <Link
                                                to="/files"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Files className="h-4 w-4" />
                                                {t('navigation.files')}
                                            </Link>
                                            <Link
                                                to="/contacts"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <Users className="h-4 w-4" />
                                                {t('navigation.contacts')}
                                            </Link>
                                        </>
                                    )}

                                    <Link
                                        to="/subscription"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        {t('navigation.subscription')}
                                    </Link>
                                    <Link
                                        to="/about"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Info className="h-4 w-4" />
                                        {t('navigation.whoAreWe')}
                                    </Link>
                                    <Link
                                        to="/how-work"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <HelpCircle className="h-4 w-4" />
                                        {t('navigation.howItWorks')}
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
                                                        <UserAvatar
                                                            user={user}
                                                            size="sm"
                                                        />
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm font-medium">
                                                                {t(
                                                                    'navigation.myAccount',
                                                                )}
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
                                                                {t(
                                                                    'navigation.logIn',
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {t(
                                                                    'auth.form.title',
                                                                )}
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
                                                        {t('auth.title')}
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/login"
                                                            className="cursor-pointer w-full flex items-center gap-2"
                                                        >
                                                            <UserIcon className="h-4 w-4" />
                                                            {t(
                                                                'navigation.logIn',
                                                            )}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/sign"
                                                            className="cursor-pointer w-full flex items-center gap-2"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            {t(
                                                                'navigation.signUp',
                                                            )}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <>
                                                    <DropdownMenuLabel>
                                                        {t(
                                                            'navigation.myAccount',
                                                        )}
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to="/profile"
                                                            className="cursor-pointer w-full flex items-center gap-2"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            {t(
                                                                'navigation.profile',
                                                            )}
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
