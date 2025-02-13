import { Link } from 'react-router-dom';

const Sidebar = () => {

    return (
        <aside className="sidebar">
            <span>Fr</span>
            <nav>
                <Link to="/" className='sidebar-dashboard'>
                    Transférez vos fichiers
                </Link>
                <div className='sidebar-menu'>
                    <button>Possibilités</button>
                    <Link to="/abonnements">Abonnements</Link>
                    <button>Cas d'utilisation</button>
                    <Link to="/a-propos">À propos</Link>
                </div>
                <div className="sidebar-footer">
                    <Link to="/cgu">CGU</Link>
                    <Link to="/politique-confidentialite">Politique de confidentialité</Link>
                    <Link to="/plan-site">Plan du site</Link>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
