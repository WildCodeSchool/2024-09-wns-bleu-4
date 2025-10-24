'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Code2, 
    Clock, 
    GraduationCap,
    Lock
} from 'lucide-react';

const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                <div className="relative px-4 py-24 mx-auto max-w-7xl">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                            {t('about.hero.title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {t('about.hero.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-8 mx-auto max-w-4xl">
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Code2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {t('about.sections.whatIs.title')}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        <span className="text-foreground font-semibold">Wild Transfer{` `}</span>
                                        {t('about.sections.whatIs.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {t('about.sections.mission.title')}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('about.sections.mission.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {t('about.sections.development.title')}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('about.sections.development.description')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {t('about.sections.quality.title')}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t('about.sections.quality.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default About;
