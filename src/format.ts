const percentageFormat = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 10 });
const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', useGrouping: true });

/** Formats a fractional amount as a percentage */
export function percentage(value: number = 0): string {
    return percentageFormat.format(value / 100); // `${value}%`;
}

export function currency(value: number = 0): string {
    return currencyFormat.format(value); // `$${value}`;
}