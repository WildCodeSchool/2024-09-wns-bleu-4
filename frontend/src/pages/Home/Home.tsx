import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="">
                Wild Transfer La solution simple et rapide pour tous vos
                transferts de fichiers
            </h1>
            <Link className="" to="/upload">
                Transférez vos fichiers
            </Link>
        </div>
    );
};

export default Home;
