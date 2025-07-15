import { UPDATE_PROFILE_PICTURE } from '@/graphql/User/mutations';
import { GET_USER_INFO } from '@/graphql/User/queries';
import { cn } from '@/lib/utils';
import { useMutation } from '@apollo/client';
import { Camera, Loader } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { UserAvatar } from './UserAvatar';

interface AvatarUploaderProps {
    user?: {
        email?: string | null;
        profilePicture?: string | null;
        id?: number;
    } | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const AvatarUploader = ({
    user,
    size = 'lg',
    className,
}: AvatarUploaderProps) => {
    const { t } = useTranslation();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE, {
        refetchQueries: [{ query: GET_USER_INFO }],
    });

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file || !user?.id) return;

        // Validation du type de fichier (JPEG, PNG, GIF, WebP, SVG)
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('profile.avatar.error.invalidType'));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error(t('profile.avatar.error.tooLarge'));
            return;
        }

        setIsUploading(true);

        try {
            // 1. Upload vers le storage API
            const formData = new FormData();
            const secureName = `avatar_${
                user.id
            }_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            formData.append('file', file);

            const storageResponse = await fetch(
                `/storage/upload?filename=${encodeURIComponent(secureName)}`,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            if (!storageResponse.ok) {
                throw new Error("Erreur lors de l'upload du fichier");
            }

            // 2. Mettre à jour le profil via GraphQL
            const imageUrl = `/storage/uploads/${secureName}`;

            await updateProfilePicture({
                variables: {
                    data: {
                        profilePictureUrl: imageUrl,
                    },
                },
            });

            toast.success(t('profile.avatar.success'));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avatar:", error);
            toast.error(t('profile.avatar.error.upload'));
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn('relative', className)}>
            <UserAvatar
                user={user}
                size={size}
                className="cursor-pointer"
                onClick={handleClick}
            />

            {/* Bouton d'upload */}
            <button
                onClick={handleClick}
                disabled={isUploading}
                aria-label={t('avatar.uploadLabel')}
                className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-zinc-700"
            >
                {isUploading ? (
                    <Loader className="w-4 h-4 animate-spin text-blue-500" />
                ) : (
                    <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
            </button>

            {/* Input file caché */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />
        </div>
    );
};
