import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center mb-12">{t('howItWorks.title')}</h1>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">1</div>
                    <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step1.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('howItWorks.step1.description')}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">2</div>
                    <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step2.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('howItWorks.step2.description')}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">3</div>
                    <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step3.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('howItWorks.step3.description')}
                    </p>
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6">{t('howItWorks.cta.title')}</h2>
                <div className="flex justify-center gap-4">
                    <Button asChild variant="default" size="lg">
                        <Link to="/sign">{t('howItWorks.cta.createAccount')}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to="/subscription">{t('howItWorks.cta.viewSubscriptions')}</Link>
                    </Button>
                </div>
            </div>

            <div className="mt-16 bg-gray-50 dark:bg-neutral-800 p-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">{t('howItWorks.features.title')}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('howItWorks.features.security.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{t('howItWorks.features.security.description')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('howItWorks.features.transfer.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{t('howItWorks.features.transfer.description')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('howItWorks.features.contacts.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{t('howItWorks.features.contacts.description')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">{t('howItWorks.features.support.title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{t('howItWorks.features.support.description')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks; 