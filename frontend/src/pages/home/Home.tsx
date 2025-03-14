import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home-wrapper">
            <h1 className="home-title">
                La solution simple et rapide pour tous vos transferts de fichiers
            </h1>
            <Link className="onlyMobile btn" to="/dashboard">Transférez vos fichiers</Link>
        </div>
    );
};

export default Home;