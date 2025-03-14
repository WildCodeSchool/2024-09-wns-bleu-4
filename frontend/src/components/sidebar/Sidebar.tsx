import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <span>Fr</span>
            <nav data-testid="sidebar-nav">
                <Link to="/" className="sidebar-dashboard">
                    Transférez vos fichiers
                </Link>
                <div className="sidebar-menu">
                    <Link to="/">Possibilités</Link>
                    <Link to="/subscription">Abonnements</Link>
                    <Link to="/">Cas d'utilisation</Link>
                    <Link to="/about">À propos</Link>
                </div>
                <div className="sidebar-footer">
                    <Link to="/cgu">CGU</Link>
                    <Link to="/privacy-policy">
                        Politique de confidentialité
                    </Link>
                    <Link to="/sitemap">Plan du site</Link>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
