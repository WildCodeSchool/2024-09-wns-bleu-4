import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    return (
        <div className="header">
            <button
                className="onlyMobile menuBurgerButton"
                onClick={() => setIsBurgerOpen(true)}
                title="menu-burger-button"
            >
                <Menu size={34} stroke='#ff934f' aria-label='Open the menu'/>
            </button>

            <div className={`menuBurger${isBurgerOpen ? '__open' : ''}`}>
                <button className="closeButton" aria-label='Close the menu' onClick={() => setIsBurgerOpen(false)}>
                    <X size={34} stroke='#FF934F'/>

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
                <Link to="/login">Connexion</Link>
                <Link className="active" to="/sign">
                    Inscription
                </Link>
            </div>

            <button
                className="onlyMobile dropDownButton"
                onClick={() => setIsOpen(!isOpen)}
                title="menu-burger-dropdown-button"
            >
                <User size={34} stroke="#ff934f" aria-label='Choise login or sign'/>
                {isOpen && (
                    <div className="dropDownButton__menu">
                        <Link to="/login">Connexion</Link>
                        <Link to="/sign">Inscription</Link>
                    </div>
                )}
            </button>
        </div>
    );
};

export default Header;
