import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <aside className="w-64 bg-gray-800 text-white h-full p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>

            <nav className="flex flex-col space-y-2">
                <Link to="/" className="p-2 hover:bg-gray-700 rounded">
                    Transférer vos fichiers
                </Link>

                <div>
                    <button
                        className="w-full text-left p-2 hover:bg-gray-700 rounded"
                        onMouseEnter={() => toggleSection('possibilites')}
                        onMouseLeave={() => toggleSection('possibilites')}
                    >
                        Possibilités ▼
                    </button>
                    {openSection === 'possibilites' && (
                        <div className="ml-4 space-y-2">
                            <Link
                                to="/option1"
                                className="block p-2 hover:bg-gray-700 rounded"
                            >
                                Option 1
                            </Link>
                            <Link
                                to="/option2"
                                className="block p-2 hover:bg-gray-700 rounded"
                            >
                                Option 2
                            </Link>
                        </div>
                    )}
                </div>

                <Link
                    to="/abonnements"
                    className="p-2 hover:bg-gray-700 rounded"
                >
                    Abonnements
                </Link>

                <div>
                    <button
                        className="w-full text-left p-2 hover:bg-gray-700 rounded"
                        onMouseEnter={() => toggleSection('cas-utilisation')}
                        onMouseLeave={() => toggleSection('cas-utilisation')}
                    >
                        Cas d'utilisation ▼
                    </button>
                    {openSection === 'cas-utilisation' && (
                        <div className="ml-4 space-y-2">
                            <Link
                                to="/cas1"
                                className="block p-2 hover:bg-gray-700 rounded"
                            >
                                Cas 1
                            </Link>
                            <Link
                                to="/cas2"
                                className="block p-2 hover:bg-gray-700 rounded"
                            >
                                Cas 2
                            </Link>
                        </div>
                    )}
                </div>

                <Link to="/a-propos" className="p-2 hover:bg-gray-700 rounded">
                    À propos
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
