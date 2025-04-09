import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { User, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLogoutMutation } from '@/generated/graphql-types';
import { toast } from 'react-toastify';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    const [logout] = useLogoutMutation();

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('token');
        toast.success('Déconnexion réussie');
        navigate('/');
    }

    return (
        <div className="header">
            <button
                className="onlyMobile menuBurgerButton"
                onClick={() => setIsBurgerOpen(true)}
                title="menu-burger-button"
            >
                <Menu size={34} stroke="#ff934f" aria-label="Open the menu" />
            </button>

            <div className={`menuBurger${isBurgerOpen ? '__open' : ''}`}>
                <button
                    className="closeButton"
                    aria-label="Close the menu"
                    onClick={() => setIsBurgerOpen(false)}
                >
                    <X size={34} stroke="#FF934F" />
                </button>
                <nav className="menuBurger__nav">
                    <div className="menuBurger__menu">
                        <Link to="/" onClick={() => setIsBurgerOpen(false)}>
                            Possibilités
                        </Link>
                        <Link
                            to="/subscription"
                            onClick={() => setIsBurgerOpen(false)}
                        >
                            Abonnements
                        </Link>
                        <Link to="/" onClick={() => setIsBurgerOpen(false)}>
                            Cas d'utilisation
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsBurgerOpen(false)}
                        >
                            À propos
                        </Link>
                    </div>
                    <div className="menuBurger__menu">
                        <Link to="/cgu" onClick={() => setIsBurgerOpen(false)}>
                            CGU
                        </Link>
                        <Link
                            to="/privacy-policy"
                            onClick={() => setIsBurgerOpen(false)}
                        >
                            Politique de confidentialité
                        </Link>
                        <Link
                            to="/sitemap"
                            onClick={() => setIsBurgerOpen(false)}
                        >
                            Plan du site
                        </Link>
                    </div>
                </nav>
            </div>

            <Logo />
            <div className="log" data-testid="log-container">
                {token ? (
                    <button
                        name="logout"
                        className="cursor-pointer text-white"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </button>
                ) : (
                    <>
                        <Link to="/login">Connexion</Link>
                        <Link className="active" to="/sign">
                            Inscription
                        </Link>
                    </>
                )}
            </div>

            {token ? (
                <button
                    className="onlyMobile cursor-pointer"
                    onClick={handleLogout}
                    title="Log out"
                >
                    <LogOut
                        size={34}
                        stroke="#ff934f"
                        aria-label="Log out"
                    />
                </button>
            ) : (
                <button
                    className="onlyMobile dropDownButton cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    title="Show log in or sign in"
                >
                    <User
                        size={34}
                        stroke="#ff934f"
                        aria-label="Choose login or sign"
                    />

                    {isOpen && (
                        <div className="dropDownButton__menu">
                            <Link to="/login">Connexion</Link>
                            <Link to="/sign">Inscription</Link>
                        </div>
                    )}
                </button>
            )}
        </div>
    );
};

export default Header;
