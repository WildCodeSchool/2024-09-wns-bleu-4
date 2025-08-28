import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/globalUtils';
import { useTranslation } from 'react-i18next';

interface UserAvatarProps {
    user?: {
        email?: string | null;
        profilePicture?: string | null;
    } | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallbackClassName?: string;
    showFallback?: boolean;
    onClick?: () => void;
}

const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
};

const fallbackSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
};

const getPlaceholderUrl = (): string => {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80';
};

export const UserAvatar = ({
    user,
    size = 'md',
    className,
    fallbackClassName,
    showFallback = true,
    onClick,
}: UserAvatarProps) => {
    const { t } = useTranslation();
    const avatarSrc = user?.profilePicture || getPlaceholderUrl();

    return (
        <Avatar
            className={cn(
                sizeClasses[size],
                className,
                onClick && 'cursor-pointer',
            )}
            onClick={onClick}
        >
            <AvatarImage
                src={avatarSrc}
                className="object-cover"
                alt={
                    user?.email
                        ? t('avatar.altWithEmail', { email: user.email })
                        : t('avatar.altWithoutEmail')
                }
            />
            {showFallback && (
                <AvatarFallback
                    className={cn(fallbackSizeClasses[size], fallbackClassName)}
                >
                    cn
                </AvatarFallback>
            )}
        </Avatar>
    );
};
