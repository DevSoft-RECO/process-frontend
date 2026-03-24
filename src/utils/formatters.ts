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
        let date: Date;
        if (dateString.length === 10 && !dateString.includes('T')) {
            // YYYY-MM-DD format - force midnight in local timezone
            date = new Date(dateString + 'T00:00:00');
        } else {
            date = new Date(dateString);
        }

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
