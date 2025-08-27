/**
 * Calculates the storage percentage used based on the provided bytes value
 * @param bytesUsed - The number of bytes used (between 0 and 20,971,520)
 * @returns The percentage used as a number between 0 and 100
 */
export function calculateStoragePercentage(bytesUsed: number): number {
    // Maximum storage limit: 20MB = 20 × 1024 × 1024 = 20,971,520 bytes
    const MAX_STORAGE_BYTES = 20971520;
    
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
export const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};