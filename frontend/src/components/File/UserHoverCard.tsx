import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface UserHoverCardProps {
    children: React.ReactNode;
    user: {
        id: number;
        email: string;
        createdAt?: string;
        profilePicture?: string;
    };
}

const UserHoverCard: React.FC<UserHoverCardProps> = ({ children, user }) => {
    const { t } = useTranslation();

    const formatDate = (dateString?: string) => {
        if (!dateString) return t('userHoverCard.unknownDate');

        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        } catch {
            return t('userHoverCard.unknownDate');
        }
    };

    const getUserInitials = (email: string) => {
        return email.split('@')[0].substring(0, 2).toUpperCase();
    };

    return (
        <HoverCard>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent className="w-max">
                <div className="flex justify-between gap-4 items-center">
                    <Avatar className="w-16 h-16">
                        <AvatarImage
                            src={user.profilePicture || undefined}
                            alt={`Photo de profil de ${user.email}`}
                        />
                        <AvatarFallback>
                            {getUserInitials(user.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{user.email}</h4>
                        <p className="text-sm">
                            {t('userHoverCard.memberDescription')}
                        </p>
                        <div className="text-muted-foreground text-xs">
                            {t('userHoverCard.joinedOn')}{' '}
                            {formatDate(user.createdAt)}
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default UserHoverCard;
