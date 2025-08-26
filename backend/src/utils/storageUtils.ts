/**
 * Calculates the storage percentage used based on the provided bytes value
 * @param bytesUsed - The number of bytes used (between 0 and 20,000,000)
 * @returns The percentage used as a number between 0 and 100
 */
export function calculateStoragePercentage(bytesUsed: number): number {
    // Maximum storage limit: 20MB = 20,000,000 bytes
    const MAX_STORAGE_BYTES = 20000000;
    
    // Ensure bytesUsed is within valid range
    if (bytesUsed < 0) {
        bytesUsed = 0;
    } else if (bytesUsed > MAX_STORAGE_BYTES) {
        bytesUsed = MAX_STORAGE_BYTES;
    }
    
    // Calculate percentage and round to 2 decimal places
    const percentage = (bytesUsed / MAX_STORAGE_BYTES) * 100;
    return Math.round(percentage * 100) / 100;
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
