import { Link } from 'react-router-dom';
import LogoSVG from './LogoSVG';

const Logo = () => {
    return (
        <Link
            to="/"
            className="logo"
            aria-label="Retourner a la page d\'accueil"
        >
            <LogoSVG />
        </Link>
    );
};

export default Logo;
