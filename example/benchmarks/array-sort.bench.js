export const name = 'Array sort';

export async function bench(n) {
    const arr = Array.from({ length: n }, () => Math.random());
    arr.sort((a, b) => a - b);
}
