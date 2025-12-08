/**
 * Utility functions for formatting values in the dashboard
 */

/**
 * Formats a number as Indian Rupee currency
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 0 for whole numbers, 2 for decimals)
 * @returns Formatted currency string with ₹ symbol
 */
export const formatCurrency = (value: number | string | null | undefined, decimals?: number): string => {
    if (value === null || value === undefined || value === '') {
        return '₹0';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return '₹0';
    }

    // Auto-detect decimals if not specified
    const hasDecimals = decimals !== undefined ? decimals : (numValue % 1 !== 0 ? 2 : 0);

    // Format with Indian numbering system
    const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: hasDecimals,
        maximumFractionDigits: hasDecimals,
    }).format(numValue);

    return formatted;
};

/**
 * Formats a number with commas (Indian numbering system) without currency symbol
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (value: number | string | null | undefined, decimals: number = 0): string => {
    if (value === null || value === undefined || value === '') {
        return '0';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return '0';
    }

    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue);
};

/**
 * Detects if a column is an ID field
 * @param columnName - The name of the column to check
 * @returns true if it's likely an ID field
 */
export const isIdColumn = (columnName: string): boolean => {
    const lowerName = columnName.toLowerCase();

    // Check for common ID patterns
    if (lowerName === 'id' || lowerName === '_id') return true;
    if (lowerName.endsWith('_id') || lowerName.endsWith('id')) return true;
    if (lowerName.startsWith('id_') || lowerName.startsWith('id')) return true;
    if (lowerName.includes('identifier')) return true;

    return false;
};

/**
 * Detects if a column is a date or time field
 * @param columnName - The name of the column to check
 * @returns true if it's likely a date/time field
 */
export const isDateTimeColumn = (columnName: string): boolean => {
    const lowerName = columnName.toLowerCase();

    // First check for exact matches or suffix matches for common patterns
    if (lowerName === 'date' || lowerName === 'time' || lowerName === 'datetime') return true;
    if (lowerName.endsWith('_date') || lowerName.endsWith('_time')) return true;
    if (lowerName.endsWith('_at') || lowerName.endsWith('_on')) return true;
    if (lowerName.startsWith('date_') || lowerName.startsWith('time_')) return true;

    // Then check for specific date/time keywords that are clear indicators
    const dateTimeKeywords = [
        'timestamp', 'created', 'updated', 'year', 'month', 'day',
        'hour', 'minute', 'second', 'when', 'period'
    ];

    return dateTimeKeywords.some(keyword => lowerName.includes(keyword));
};

/**
 * Detects if a column is a count, quantity, or index field
 * @param columnName - The name of the column to check
 * @returns true if it's likely a count/quantity/index field
 */
export const isCountColumn = (columnName: string): boolean => {
    const countKeywords = [
        'count', 'quantity', 'qty', 'number', 'num', 'index',
        'rank', 'position', 'sequence', 'order'
    ];

    const lowerName = columnName.toLowerCase();
    return countKeywords.some(keyword => lowerName.includes(keyword));
};

/**
 * Detects if a column name or value suggests it's a currency field
 * @param columnName - The name of the column to check
 * @returns true if it's likely a currency field
 */
export const isCurrencyColumn = (columnName: string): boolean => {
    // First, exclude non-currency columns
    if (isIdColumn(columnName)) return false;
    if (isDateTimeColumn(columnName)) return false;
    if (isCountColumn(columnName)) return false;

    const currencyKeywords = [
        'price', 'cost', 'amount', 'total', 'revenue', 'sales',
        'profit', 'salary', 'payment', 'fee', 'charge', 'value',
        'income', 'expense', 'balance', 'rate', 'mrp', 'discount',
        'earning', 'wage', 'commission', 'bonus', 'refund', 'tax',
        'gst', 'vat', 'duty', 'bill', 'invoice', 'due', 'paid',
        'receivable', 'payable', 'credit', 'debit'
    ];

    // Normalize column name: lowercase, replace spaces/underscores with empty string for partial matching
    const lowerName = columnName.toLowerCase();
    const normalizedName = lowerName.replace(/[\s_-]/g, '');

    // Check both original and normalized versions
    return currencyKeywords.some(keyword =>
        lowerName.includes(keyword) || normalizedName.includes(keyword)
    );
};

/**
 * Converts Excel serial date number to formatted date string
 * Excel stores dates as numbers (days since 1900-01-01)
 * @param serial - Excel serial date number
 * @returns Formatted date string
 */
export const excelSerialToDate = (serial: number): string => {
    // Excel epoch starts at 1900-01-01, but has a bug counting 1900 as a leap year
    // So we need to account for that
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const days = Math.floor(serial);
    const milliseconds = days * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + milliseconds);

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Checks if a number is likely an Excel serial date
 * Excel dates are typically between 1 (1900-01-01) and 50000+ (current dates)
 * @param value - Number to check
 * @returns true if it looks like an Excel date serial
 */
export const isExcelSerialDate = (value: number): boolean => {
    // Excel dates are positive integers typically between 1 and 60000
    // (covering years 1900-2064)
    return Number.isInteger(value) && value > 0 && value < 100000;
};

/**
 * Formats a value based on its column name
 * If the column seems currency-related, formats as currency
 * Otherwise formats as regular number or keeps original format for IDs/dates
 */
export const smartFormat = (value: any, columnName: string): string => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    // For ID columns, return the value as-is (no formatting)
    if (isIdColumn(columnName)) {
        return String(value);
    }

    // Check if it's a numeric value
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    const isNumeric = !isNaN(numValue);

    // IMPORTANT: Check currency BEFORE date/time to prevent amounts from being converted to dates
    // For currency columns, format with rupee symbol
    if (isNumeric && isCurrencyColumn(columnName)) {
        return formatCurrency(numValue);
    }

    // For count columns, format with commas but no currency symbol
    if (isNumeric && isCountColumn(columnName)) {
        return formatNumber(numValue, 0);
    }

    // For date/time columns, handle Excel serial dates
    if (isDateTimeColumn(columnName)) {
        // Check if it's a number that might be an Excel serial date
        if (isNumeric && isExcelSerialDate(numValue)) {
            // Convert Excel serial date to readable format
            return excelSerialToDate(numValue);
        }

        // Otherwise return as-is (already formatted date string)
        return String(value);
    }

    // For other numeric values, format with commas
    if (isNumeric) {
        // Check if it looks like a whole number or has decimals
        const hasDecimals = numValue % 1 !== 0;
        return formatNumber(numValue, hasDecimals ? 2 : 0);
    }

    // Not a number, return as string
    return String(value);
};
