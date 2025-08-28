import { clsx, type ClassValue } from 'clsx';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export const copyToClipboard = async (url: string) => {
    try {
        await navigator.clipboard.writeText(url);
        toast.success(t('upload.page.tempLink.toast.copy'));
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        toast.error(t('upload.page.tempLink.toast.error'));
    }
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
