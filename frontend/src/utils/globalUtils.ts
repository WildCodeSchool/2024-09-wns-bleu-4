import { clsx, type ClassValue } from 'clsx';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const copyToClipboard = async (url: string) => {
    try {
        await navigator.clipboard.writeText(url);
        toast.success(t('upload.page.tempLink.toast.copy'));
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        toast.error(t('upload.page.tempLink.toast.error'));
    }
};

export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};