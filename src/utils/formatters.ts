/**
 * Utility functions for formatting data in the application
 * forcing Guatemala (es-GT) locale for consistency.
 */

const DEFAULT_LOCALE = 'es-GT';

/**
 * Formats a date string to DD/MM/YYYY
 * @param dateString ISO string or YYYY-MM-DD
 */
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    try {
        // Handle input like "2022-10-17 00:00:00" or "2022-10-17"
        // Take only the first 10 characters to avoid timezone shifts in Date constructor
        const onlyDatePart = dateString.substring(0, 10);
        
        // Use T00:00:00 to ensure it's treated as local time
        const date = new Date(onlyDatePart + 'T00:00:00');

        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString(DEFAULT_LOCALE);
    } catch (e) {
        return dateString;
    }
};

/**
 * Formats a date string to DD/MM/YYYY HH:MM AM/PM
 * @param dateString ISO string
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString(DEFAULT_LOCALE) + ' ' + 
               date.toLocaleTimeString(DEFAULT_LOCALE, { 
                   hour: '2-digit', 
                   minute: '2-digit',
                   hour12: true 
               });
    } catch (e) {
        return dateString;
    }
};

/**
 * Formats a number as GTQ currency (Q)
 * @param amount 
 */
export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return 'Q 0.00';
    
    return new Intl.NumberFormat(DEFAULT_LOCALE, { 
        style: 'currency', 
        currency: 'GTQ' 
    }).format(amount);
};
