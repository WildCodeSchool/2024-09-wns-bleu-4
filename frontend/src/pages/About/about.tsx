'use client';

import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen px-4 py-16 flex justify-center items-start">
            <div className="w-full max-w-3xl">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
                            {t('about.title')}
                        </CardTitle>
                        <CardDescription className="text-lg text-muted-foreground mt-2">
                            {t('about.subtitle')}
                        </CardDescription>
                    </CardHeader>

                    <Separator className="mb-6" />

                    <CardContent className="space-y-6 text-muted-foreground text-base leading-relaxed">
                        <p>
                            <span className="text-foreground font-semibold">
                                Wild Transfer
                            </span>{' '}
                            {t('about.description1')}
                        </p>
                        <p>
                            {t('about.description2')}
                        </p>
                        <p>
                            {t('about.description3')}
                        </p>
                        <p className="italic text-sm">
                            {t('about.contactText')}
                            <a href="/contact" className="underline ml-1 text-primary">
                                {t('about.contactLink')}
                            </a>
                            .
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default About;
