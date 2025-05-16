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

const About: React.FC = () => {
    return (
        <div className="min-h-screen px-4 py-16 flex justify-center items-start">
            <div className="w-full max-w-3xl">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
                            À propos de Wild Transfer
                        </CardTitle>
                        <CardDescription className="text-lg text-muted-foreground mt-2">
                            Une plateforme moderne pour transférer vos fichiers
                            en toute sérénité.
                        </CardDescription>
                    </CardHeader>

                    <Separator className="mb-6" />

                    <CardContent className="space-y-6 text-muted-foreground text-base leading-relaxed">
                        <p>
                            <span className="text-foreground font-semibold">
                                Wild Transfer
                            </span>{' '}
                            est une solution simple, rapide et sécurisée pour le
                            partage de fichiers. Elle s’adresse aussi bien aux
                            professionnels qu’aux particuliers, avec une
                            interface intuitive pensée pour une expérience
                            fluide.
                        </p>
                        <p>
                            Notre mission est de garantir un service fiable et
                            respectueux de votre vie privée. Nous utilisons des
                            technologies modernes pour assurer la sécurité et la
                            confidentialité de vos données.
                        </p>
                        <p>
                            Développée par une équipe de développeurs, la
                            plateforme évolue en permanence pour répondre aux
                            nouveaux usages et proposer des fonctionnalités
                            adaptées à vos besoins.
                        </p>
                        <p className="italic text-sm">
                            Pour toute question ou suggestion, n’hésitez pas à
                            nous contacter via la
                            <a href="/" className="underline ml-1 text-primary">
                                page de contact
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
