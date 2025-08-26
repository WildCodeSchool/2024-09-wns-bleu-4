import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts bytes to a human-readable string
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB", "2.3 GB")
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Converts bytes to MB
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Size in MB
 */
export const bytesToMB = (bytes: number, decimals: number = 2): number => {
    return parseFloat((bytes / (1024 * 1024)).toFixed(decimals));
};

/**
 * Converts bytes to GB
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Size in GB
 */
export const bytesToGB = (bytes: number, decimals: number = 2): number => {
    return parseFloat((bytes / (1024 * 1024 * 1024)).toFixed(decimals));
};
