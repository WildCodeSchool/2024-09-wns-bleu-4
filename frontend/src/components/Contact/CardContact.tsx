import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check, Clock, X } from 'lucide-react';
import React from 'react';

export interface CardContactProps {
    email: string;
    status?: 'PENDING' | 'ACCEPTED' | 'REFUSED';
    createdAt?: string;
    actions?: React.ReactNode;
    className?: string;
}

const CardContact: React.FC<CardContactProps> = ({
    email,
    status,
    createdAt,
    actions,
    className = '',
}) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                    </Badge>
                );
            case 'ACCEPTED':
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                    >
                        <Check className="w-3 h-3 mr-1" />
                        Accepté
                    </Badge>
                );
            case 'REFUSED':
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Refusé
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <Card className={`hover:shadow-md transition-shadow ${className}`}>
            <CardHeader className="">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium truncate">
                            {email}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                            {email}
                        </p>
                    </div>
                    {status && getStatusBadge(status)}
                </div>
            </CardHeader>

            {createdAt && (
                <CardContent className="">
                    <p className="text-xs text-muted-foreground">
                        {new Date(createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </CardContent>
            )}

            {actions && <CardFooter className="gap-2">{actions}</CardFooter>}
        </Card>
    );
};

export default CardContact;
