import { Contact } from '@/generated/graphql-types';

export interface FileWithPreview {
    id: string;
    preview: string;
    progress: number;
    name: string;
    size: number;
    type: string;
    lastModified?: number;
    file?: File;
}

export interface TempLink {
    id: string;
    url: string;
    expiresAt: Date;
    fileName: string;
    fileSize: number;
    isExpired?: boolean;
}

export interface FileCardProps {
    name: string;
    url: string;
    id: number;
    description?: string;
    formattedSize: string;
    md5Hash?: string;
    isShared?: boolean;
    isCompact?: boolean;
    owner?: {
        id: number;
        email: string;
        createdAt?: string;
        profilePicture?: string;
    };
    onFileDeleted?: () => void;
    myContacts?: Contact[];
    isSelected?: boolean;
    onSelectionChange?: (id: number, selected: boolean) => void;
}
