import { toRaw } from "vue";

type PlainObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PlainObject => {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const hasOwn = (obj: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Copies plain objects and arrays, so that editing the source in place later
 * does not change the copy. Functions, dates, elements and class instances
 * are kept by reference. Reactive proxies are unwrapped.
 */
export function snapshot<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  const raw = toRaw(value) as unknown;
  if (Array.isArray(raw) || isPlainObject(raw)) {
    if (seen.has(raw)) return seen.get(raw) as T;
    if (Array.isArray(raw)) {
      const copy: unknown[] = [];
      seen.set(raw, copy);
      for (const item of raw) copy.push(snapshot(item, seen));
      return copy as T;
    }
    const copy: PlainObject = {};
    seen.set(raw, copy);
    for (const key of Object.keys(raw)) copy[key] = snapshot(raw[key], seen);
    return copy as T;
  }
  return raw as T;
}

/**
 * Structural equality for option values: plain objects and arrays are compared
 * key by key, dates by time, and everything else (functions included) by
 * reference.
 */
export function isEqual(
  a: unknown,
  b: unknown,
  seen = new WeakMap<object, unknown>(),
): boolean {
  const x = toRaw(a) as unknown;
  const y = toRaw(b) as unknown;
  if (Object.is(x, y)) return true;
  if (x instanceof Date && y instanceof Date) return x.getTime() === y.getTime();

  const bothArrays = Array.isArray(x) && Array.isArray(y);
  const bothObjects = isPlainObject(x) && isPlainObject(y);
  if (!bothArrays && !bothObjects) return false;

  // a cycle that reaches the same pair again is equal so far
  if (seen.get(x as object) === y) return true;
  seen.set(x as object, y);

  if (bothArrays) {
    const xs = x as unknown[];
    const ys = y as unknown[];
    return xs.length === ys.length && xs.every((item, i) => isEqual(item, ys[i], seen));
  }
  const xo = x as PlainObject;
  const yo = y as PlainObject;
  const keys = Object.keys(xo);
  return (
    keys.length === Object.keys(yo).length &&
    keys.every((key) => hasOwn(yo, key) && isEqual(xo[key], yo[key], seen))
  );
}

/**
 * The top-level keys of `next` whose values differ from `prev`. A key that
 * `prev` had and `next` dropped is reported as `undefined`, which the core's
 * `update()` reads as "reset to the default".
 */
export function diffOptions(prev: object, next: object): PlainObject {
  const before = toRaw(prev) as PlainObject;
  const after = toRaw(next) as PlainObject;
  const delta: PlainObject = {};
  for (const key of Object.keys(after)) {
    if (!isEqual(before[key], after[key])) delta[key] = after[key];
  }
  for (const key of Object.keys(before)) {
    if (!hasOwn(after, key) && before[key] !== undefined) delta[key] = undefined;
  }
  return delta;
}
