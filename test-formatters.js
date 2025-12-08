// Quick test to verify formatter logic

const isIdColumn = (columnName) => {
    const lowerName = columnName.toLowerCase();
    if (lowerName === 'id' || lowerName === '_id') return true;
    if (lowerName.endsWith('_id') || lowerName.endsWith('id')) return true;
    if (lowerName.startsWith('id_') || lowerName.startsWith('id')) return true;
    if (lowerName.includes('identifier')) return true;
    return false;
};

const isDateTimeColumn = (columnName) => {
    const lowerName = columnName.toLowerCase();

    if (lowerName === 'date' || lowerName === 'time' || lowerName === 'datetime') return true;
    if (lowerName.endsWith('_date') || lowerName.endsWith('_time')) return true;
    if (lowerName.endsWith('_at') || lowerName.endsWith('_on')) return true;
    if (lowerName.startsWith('date_') || lowerName.startsWith('time_')) return true;

    const dateTimeKeywords = [
        'timestamp', 'created', 'updated', 'year', 'month', 'day',
        'hour', 'minute', 'second', 'when', 'period'
    ];

    return dateTimeKeywords.some(keyword => lowerName.includes(keyword));
};

const isCountColumn = (columnName) => {
    const countKeywords = [
        'count', 'quantity', 'qty', 'number', 'num', 'index',
        'rank', 'position', 'sequence', 'order'
    ];

    const lowerName = columnName.toLowerCase();
    return countKeywords.some(keyword => lowerName.includes(keyword));
};

const isCurrencyColumn = (columnName) => {
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

    const lowerName = columnName.toLowerCase();
    const normalizedName = lowerName.replace(/[\s_-]/g, '');

    return currencyKeywords.some(keyword =>
        lowerName.includes(keyword) || normalizedName.includes(keyword)
    );
};

// Test columns
const testColumns = [
    'TRANSACTION_ID',
    'TRANSACTION_AMOUNT',
    'TRANSACTION_DATE',
    'transaction amount',
    'created_at',
    'order_date'
];

console.log('Testing column detection:\n');
testColumns.forEach(col => {
    console.log(`Column: "${col}"`);
    console.log(`  - Is ID: ${isIdColumn(col)}`);
    console.log(`  - Is Date/Time: ${isDateTimeColumn(col)}`);
    console.log(`  - Is Count: ${isCountColumn(col)}`);
    console.log(`  - Is Currency: ${isCurrencyColumn(col)}`);
    console.log('');
});
