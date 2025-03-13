import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Header = () => {
    return (
        <div className="header">
            <Logo />
            <div className="log" data-testid="log-container">
                <Link to="/login">Connexion</Link>
                <Link className='active' to="/sign">Inscription</Link>
            </div>
        </div>
    );
};

export default Header;
