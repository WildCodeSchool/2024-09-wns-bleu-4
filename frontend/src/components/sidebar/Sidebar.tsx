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
                    <Link to="/subscription">Abonnements</Link>
                    <button>Cas d'utilisation</button>
                    <Link to="/about">À propos</Link>
                </div>
                <div className="sidebar-footer">
                    <Link to="/cgu">CGU</Link>
                    <Link to="/privacy-policy">Politique de confidentialité</Link>
                    <Link to="/sitemap">Plan du site</Link>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;