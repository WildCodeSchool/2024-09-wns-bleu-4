import { Pricing } from '@/components/pricing';

const subscriptionPlan = [
    {
        name: 'ABONNEMENT PREMIUM',
        price: '9',
        yearlyPrice: '7',
        period: 'par mois',
        features: [
            'Transfert de fichiers illimité',
            'Partage avec vos contacts',
            'Support par email',
            'Accès à toutes les fonctionnalités',
            'Interface moderne et intuitive',
            'Sécurité renforcée',
        ],
        description: 'Accès complet à la plateforme de transfert de fichiers',
        buttonText: 'Commencer maintenant',
        href: '/subscription/payment',
        isPopular: false,
    },
];

const Subscription = () => {
    return (
        <div className="min-h-screen px-4 flex justify-center">
            <div className="w-full max-w-5xl">
                <Pricing
                    plans={subscriptionPlan}
                    title="Abonnement simple et efficace"
                    description="Un seul plan pour tous vos besoins de transfert de fichiers. Accès complet à toutes les fonctionnalités de la plateforme."
                />
            </div>
        </div>
    );
};

export default Subscription;
