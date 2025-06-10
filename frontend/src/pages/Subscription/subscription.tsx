import { Pricing } from '@/components/pricing';

const demoPlans = [
    {
        name: 'DÉCOUVERTE',
        price: '5',
        yearlyPrice: '4',
        period: 'par mois',
        features: [
            'Jusqu’à 10 fichiers',
            'Statistiques de base',
            'Support sous 48h',
            'Accès limité à l’API',
            'Accès à la communauté',
        ],
        description: 'Parfait pour les particuliers ou les petits projets',
        buttonText: 'Commencer l’essai gratuit',
        href: '/sign',
        isPopular: false,
    },
    {
        name: 'PROFESSIONNEL',
        price: '9',
        yearlyPrice: '7',
        period: 'par mois',
        features: [
            'Stockage illimité',
            'Statistiques avancées',
            'Support sous 24h',
            'Accès complet à l’API',
            'Support prioritaire',
            'Travail en équipe',
            'Intégrations personnalisées',
        ],
        description: 'Idéal pour les équipes et les entreprises en croissance',
        buttonText: 'Démarrer maintenant',
        href: '/sign',
        isPopular: true,
    },
    {
        name: 'ENTREPRISE',
        price: '29',
        yearlyPrice: '23',
        period: 'par mois',
        features: [
            'Tout ce qui est inclus dans Professionnel',
            'Solutions sur mesure',
            'Gestionnaire de compte dédié',
            'Support sous 1h',
            'Authentification SSO',
            'Sécurité renforcée',
            'Contrats personnalisés',
            'Accord SLA garanti',
        ],
        description: 'Pour les grandes structures avec des besoins spécifiques',
        buttonText: 'Contacter le service commercial',
        href: '/contact',
        isPopular: false,
    },
];

const Subscription = () => {
    return (
        <div className="min-h-screen px-4 flex justify-center">
            <div className="w-full max-w-5xl">
                <Pricing
                    plans={demoPlans}
                    title="Tarifs simples et transparents"
                    description="Choisissez le plan qui vous convient. Tous les abonnements incluent un accès complet à la plateforme."
                />
            </div>
        </div>
    );
};

export default Subscription;
