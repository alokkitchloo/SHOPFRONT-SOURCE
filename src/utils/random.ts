// Simple deterministic string hash (djb2) -> seeds a mulberry32 PRNG.
// Using a seeded PRNG instead of Math.random() means a given product always
// gets the same brand, sale price, colors, sizes, and stock levels on every
// load/refresh — important since none of that exists in the Fake Store API,
// but the UI still needs to behave consistently (e.g. a deep link to a
// sold-out variant should still show it as sold out after a refresh).

export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(key: string): number {
  return mulberry32(hashString(key))();
}

export function seededPick<T>(key: string, options: T[]): T {
  const r = seededRandom(key);
  return options[Math.floor(r * options.length)];
}

export function seededInt(key: string, min: number, max: number): number {
  const r = seededRandom(key);
  return Math.floor(r * (max - min + 1)) + min;
}
