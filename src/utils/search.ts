export function toSearch(query: string) {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function toLucky(query: string) {
    return toSearch(query) + '&btnI';
}
