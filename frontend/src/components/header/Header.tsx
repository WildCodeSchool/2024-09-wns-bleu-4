import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Login = () => {

    return (
        <div className="header">
            <Logo />
            <div className="log">
                <Link to="/login">Connexion</Link>
                <Link className='active' to="/sign">Inscription</Link>
            </div>
        </div>
    );
};

export default Login;
