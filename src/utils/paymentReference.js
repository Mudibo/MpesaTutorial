export function generatePaymentReference() {

    const now = new Date();
    const date = now
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
    const random =
        Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");
    return `PAY-${date}-${random}`;
}