import { Pricing } from '@/components/pricing';
import { useTranslation } from 'react-i18next';

const Subscription = () => {
    const { t } = useTranslation();
    const subscriptionPlan = [
        {
            name: t('subscription.premiumPlan.name'),
            price: '9',
            yearlyPrice: '7',
            period: t('subscription.premiumPlan.perMonth'),
            features: [
                t('subscription.feature.unlimitedTransfer'),
                t('subscription.feature.shareWithContacts'),
                t('subscription.feature.emailSupport'),
                t('subscription.feature.allFeatures'),
                t('subscription.feature.modernUI'),
                t('subscription.feature.enhancedSecurity'),
            ],
            description: t('subscription.premiumPlan.description'),
            buttonText: t('subscription.premiumPlan.startNow'),
            href: '/subscription/payment',
            isPopular: false,
        },
    ];

    return (
        <div className="min-h-screen px-4 flex justify-center">
            <div className="w-full max-w-5xl">
                <Pricing
                    plans={subscriptionPlan}
                    title={t('subscription.simpleEffectiveTitle')}
                    description={t('subscription.simpleEffectiveDescription')}
                />
            </div>
        </div>
    );
};

export default Subscription;
