interface HasId {
    id?: string;
}

export function generateNextId(arr: ReadonlyArray<HasId>): string {
    const nextId = arr.reduce((max, next) =>
        Math.max(max, +(next.id || '0')), 0
    ) + 1;
    return `${nextId}`;
}
