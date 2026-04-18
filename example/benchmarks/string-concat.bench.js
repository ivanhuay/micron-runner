export const name = 'String concat vs array join';

export async function bench(n) {
    const parts = Array.from({ length: n }, (_, i) => `item-${i}`);
    parts.join(', ');
}
