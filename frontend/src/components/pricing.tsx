import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/globalUtils';
import NumberFlow from '@number-flow/react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from './ui/variants';
import { useAuth } from '@/hooks/useAuth';

interface PricingPlan {
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    features: string[];
    description: string;
    buttonText: string;
    href: string;
    isPopular: boolean;
}

interface PricingProps {
    plans: PricingPlan[];
    title?: string;
    description?: string;
}

export function Pricing({
    plans,
    title = 'Des tarifs simples et transparents',
    description = 'Choisissez le forfait qui vous convient.\nTous les forfaits incluent un accès à notre plateforme, un espace de stockage sécurisé et une assistance dédiée.',
}: PricingProps) {
    const { t } = useTranslation();
    const [isMonthly, setIsMonthly] = useState(true);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const switchRef = useRef<HTMLButtonElement>(null);
    const isSinglePlan = plans.length === 1;
    const { user } = useAuth();

    const handleToggle = (checked: boolean) => {
        setIsMonthly(!checked);
        if (checked && switchRef.current && typeof window !== 'undefined') {
            const rect = switchRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            confetti({
                particleCount: 50,
                spread: 60,
                origin: {
                    x: x / window.innerWidth,
                    y: y / window.innerHeight,
                },
                colors: [
                    'hsl(var(--primary))',
                    'hsl(var(--accent))',
                    'hsl(var(--secondary))',
                    'hsl(var(--muted))',
                ],
                ticks: 200,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: 30,
                shapes: ['circle'],
            });
        }
    };

    return (
        <div className="container py-20">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {title}
                </h2>
                <p className="text-muted-foreground text-lg whitespace-pre-line">
                    {description}
                </p>
            </div>

            <div className="flex justify-center mb-10">
                <label className="relative inline-flex items-center cursor-pointer">
                    <Label>
                        <Switch
                            ref={switchRef}
                            checked={!isMonthly}
                            onCheckedChange={handleToggle}
                            className="relative"
                        />
                    </Label>
                </label>
                <span className="ml-2 font-semibold">
                    {t('pricing.yearlyBilling')}{' '}
                    <span className="text-primary">{t('pricing.save20Percent')}</span>
                </span>
            </div>

            <div className={cn(
                "grid gap-4",
                isSinglePlan
                    ? "grid-cols-1 max-w-2xl mx-auto"
                    : "grid-cols-1 md:grid-cols-3 sm:grid-cols-2"
            )}>
                {plans.map((plan, index) => {
                    // Réduction de prix : mensuel / annuel
                    const monthly = Math.max(1, Math.floor(+plan.price / 2));
                    const annual = Math.max(
                        1,
                        Math.floor(+plan.yearlyPrice / 2),
                    );

                    return (
                        <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 1 }}
                            whileInView={
                                isDesktop && !isSinglePlan
                                    ? {
                                          y: plan.isPopular ? -20 : 0,
                                          opacity: 1,
                                          x:
                                              index === 2
                                                  ? -30
                                                  : index === 0
                                                  ? 30
                                                  : 0,
                                          scale:
                                              index === 0 || index === 2
                                                  ? 0.94
                                                  : 1.0,
                                      }
                                    : {}
                            }
                            viewport={{ once: true }}
                            transition={{
                                duration: 1.6,
                                type: 'spring',
                                stiffness: 100,
                                damping: 30,
                                delay: 0.4,
                                opacity: { duration: 0.5 },
                            }}
                            className={cn(
                                'rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative',
                                plan.isPopular
                                    ? 'border-primary border-2'
                                    : 'border-border',
                                'flex flex-col',
                                !plan.isPopular && !isSinglePlan && 'mt-5',
                                isSinglePlan && 'p-8 lg:p-12',
                                !isSinglePlan && index === 0 || index === 2
                                    ? 'z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]'
                                    : 'z-10',
                                !isSinglePlan && index === 0 && 'origin-right',
                                !isSinglePlan && index === 2 && 'origin-left',
                            )}
                        >
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                                    <Star className="text-primary-foreground h-4 w-4 fill-current" />
                                    <span className="text-primary-foreground ml-1 font-sans font-semibold">
                                        {t('pricing.popular')}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 flex flex-col">
                                <p className={cn(
                                    "text-base font-semibold text-muted-foreground",
                                    isSinglePlan && "text-lg"
                                )}>
                                    {plan.name}
                                </p>
                                <div className="mt-6 flex items-center justify-center gap-x-2">
                                    <span className={cn(
                                        "text-5xl font-bold tracking-tight text-foreground",
                                        isSinglePlan && "text-6xl lg:text-7xl"
                                    )}>
                                        <NumberFlow
                                            value={isMonthly ? monthly : annual}
                                            format={{
                                                style: 'currency',
                                                currency: 'EUR',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }}
                                            transformTiming={{
                                                duration: 500,
                                                easing: 'ease-out',
                                            }}
                                            willChange
                                            className="font-variant-numeric: tabular-nums"
                                        />
                                    </span>
                                    <span className={cn(
                                        "text-sm font-semibold leading-6 tracking-wide text-muted-foreground",
                                        isSinglePlan && "text-base"
                                    )}>
                                        /{' '}
                                        {plan.period === 'Next 3 months'
                                            ? t('pricing.threeMonths')
                                            : plan.period}
                                    </span>
                                </div>

                                <p className={cn(
                                    "text-xs leading-5 text-muted-foreground",
                                    isSinglePlan && "text-sm"
                                )}>
                                    {isMonthly
                                        ? t('pricing.monthlyBilling')
                                        : t('pricing.yearlyBilling')}
                                </p>

                                <ul className={cn(
                                    "mt-5 gap-2 flex flex-col",
                                    isSinglePlan && "mt-8 gap-3"
                                )}>
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-2"
                                        >
                                            <Check className={cn(
                                                "h-4 w-4 text-primary mt-1 flex-shrink-0",
                                                isSinglePlan && "h-5 w-5"
                                            )} />
                                            <span className={cn(
                                                "text-left",
                                                isSinglePlan && "text-base"
                                            )}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <hr className="w-full my-4" />

                                {user?.isSubscribed ? (
                                    <span
                                        className={cn(
                                            buttonVariants({ variant: 'outline' }),
                                            'group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter opacity-60 cursor-not-allowed',
                                            plan.isPopular
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-background text-foreground',
                                            isSinglePlan && 'text-xl py-4'
                                        )}
                                    >
                                        {t('subscription.alreadySubscribed')}
                                    </span>
                                ) : (
                                    <Link
                                        to={plan.href}
                                        className={cn(
                                            buttonVariants({ variant: 'outline' }),
                                            'group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter',
                                            'transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground',
                                            plan.isPopular
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-background text-foreground',
                                            isSinglePlan && 'text-xl py-4'
                                        )}
                                    >
                                        {plan.buttonText}
                                    </Link>
                                )}
                                <p className={cn(
                                    "mt-6 text-xs leading-5 text-muted-foreground",
                                    isSinglePlan && "text-sm mt-8"
                                )}>
                                    {plan.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
