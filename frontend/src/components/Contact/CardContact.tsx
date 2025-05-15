import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';

export interface CardContactProps {
    name: string;
    email: string;
    status?: string;
    createdAt?: string;
    actions?: React.ReactNode;
}

const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    ACCEPTED: 'Accepté',
    REFUSED: 'Refusé',
};

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REFUSED: 'bg-red-100 text-red-800',
};

const CardContact: React.FC<CardContactProps> = ({
    name,
    email,
    status,
    createdAt,
    actions,
}) => {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-lg font-semibold">
                        {name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">{email}</div>
                </div>
                {status && (
                    <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                            statusColors[status] || ''
                        }`}
                    >
                        {statusLabels[status] || status}
                    </span>
                )}
            </CardHeader>
            {createdAt && (
                <CardContent>
                    <div className="text-xs text-gray-400">
                        Ajouté le {new Date(createdAt).toLocaleDateString()}
                    </div>
                </CardContent>
            )}
            {actions && (
                <CardFooter className="flex gap-2">{actions}</CardFooter>
            )}
        </Card>
    );
};

export default CardContact;
