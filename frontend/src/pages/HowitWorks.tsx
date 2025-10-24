import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center mb-12">{t('howItWorks.title')}</h1>
            
            {/* Section des 4 fonctionnalités principales */}
            <section className="grid md:grid-cols-2 gap-8 mb-16">
                {/* 1. Déposer vos fichiers de manière permanente */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="border-2 border-blue-600 dark:border-blue-400 p-3 rounded-full">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('howItWorks.features.deposit.title')}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t('howItWorks.features.deposit.description')}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{t('howItWorks.features.deposit.benefit')}</span>
                    </div>
                </div>

                {/* 2. Générer des liens temporaires de fichiers */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="border-2 border-green-600 dark:border-green-400 p-3 rounded-full">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('howItWorks.features.linking.title')}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t('howItWorks.features.linking.description')}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{t('howItWorks.features.linking.benefit')}</span>
                    </div>
                </div>

                {/* 3. Gestion des contacts */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="border-2 border-purple-600 dark:border-purple-400 p-3 rounded-full">
                            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('howItWorks.features.contacts.title')}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t('howItWorks.features.contacts.description')}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{t('howItWorks.features.contacts.benefit')}</span>
                    </div>
                </div>

                {/* 4. Simplicité, ergonomie, prévisualisation et plus */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="border-2 border-orange-600 dark:border-orange-400 p-3 rounded-full">
                            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('howItWorks.features.more.title')}
                        </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {t('howItWorks.features.more.description')}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{t('howItWorks.features.more.benefit')}</span>
                    </div>
                </div>
            </section>

            {/* Section CTA */}
            <section className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-700 p-12 rounded-2xl mb-16">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    {t('howItWorks.cta.title')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    {t('howItWorks.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild variant="default" size="lg" className="text-lg px-8 py-3">
                        <Link to="/sign">
                            {t('howItWorks.cta.createAccount')}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                        <Link to="/subscription">
                            {t('howItWorks.cta.viewSubscriptions')}
                        </Link>
                    </Button>
                </div>
            </section>
 
        </div>
    );
};

export default HowItWorks; 