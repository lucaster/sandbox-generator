import rough from 'roughjs';

const generator = rough.generator();

const options = {
  roughness: 1.15,
  bowing: 1.1,
  maxRandomnessOffset: 1.4,
  disableMultiStroke: true,
};

export function seedFromKey(key: string): number {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

export function sketchPath(d: string, key: string): string {
  const drawable = generator.path(d, { ...options, seed: seedFromKey(key) });
  const first = drawable.sets[0];
  return first ? generator.opsToPath(first, 1) : d;
}
