export function formatCurrency(value) {
    if (typeof value !== 'number') {
        try {
            value = parseFloat(value);
        } catch {
            throw new Error('O valor deve ser um número.');
        }
    }

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
        .format(value)
        .replace(/^R\$\s?/, '');
}

export function parseMonetaryValue(value) {
    if (!value) return NaN;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}
