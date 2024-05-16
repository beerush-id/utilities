import { isArray, isFunction, isObject, typeOf } from './inspector.js';

export type NestedPath<T, K extends keyof T = keyof T> = K extends string | number
  ? T[K] extends infer R
    ?
        | `${K}`
        | (R extends Array<unknown>
            ? `${K}.${NestedArrayPath<R>}`
            : R extends Record<string, unknown>
              ? `${K}.${NestedPath<R>}`
              : never)
    : never
  : never;
export type NestedArrayPath<T extends Array<unknown>> = `${number}` | `${number}.${NestedPath<T[number]>}`;

export type NestedPathValue<T, P extends NestedPath<T>> = P extends `${infer K}.${infer Rest}`
  ? T[(K extends `${infer R extends number}` ? R : K) & keyof T] extends infer S
    ? S extends never
      ? never
      : Rest extends NestedPath<S>
        ? NestedPathValue<S, Rest>
        : never
    : never
  : T[(P extends `${infer R extends number}` ? R : P) & keyof T];

export type NestedPaths<T extends object, R = Array<NestedPath<T>>> = R;
export type NestedPathMaps<T extends object> = {
  [K in NestedPath<T>]: NestedPathValue<T, K>;
};

/**
 * Get the value of an object by using a path.
 * @param {T} object - An object to get the value from.
 * @param {string} path - A dot separated string as a key to get the value.
 * @param {any} fallback - A fallback value if the key is not found.
 * @returns {any}
 */
export function read<T extends object, P extends NestedPath<T> = NestedPath<T>>(
  object: T,
  path: P,
  fallback?: unknown
): NestedPathValue<T, P> {
  const key = path as string;

  if (typeof object !== 'object') {
    throw new Error(`Can not get ${key} from ${typeof object}!`);
  }

  const keys = key.split('.');

  if (keys.length > 1) {
    return (
      (keys.reduce((a, b, i) => {
        const next = a[b as never];
        return i + 1 === keys.length ? next : next || {};
      }, object) as never) ?? fallback
    );
  } else {
    return (object as never)[key] ?? fallback;
  }
}

/**
 * Set the value of an object by using a path.
 * @param {T} object - An object to set the value into.
 * @param {string} path - A dot separated string as a path to set the value.
 * @param {unknown} value - New value to be set.
 */
export function write<T extends object, P extends NestedPath<T> = NestedPath<T>>(
  object: T,
  path: P,
  value?: NestedPathValue<T, P>
): void {
  const key = path as string;

  if (typeof object !== 'object') {
    throw new Error(`Can not set ${key} to ${typeof object}.`);
  }

  const keys = key.split('.');

  if (keys.length <= 1) {
    // eslint-disable-next-line
    (object as any)[key] = value;
  } else {
    keys.reduce((a, b, i) => {
      if (i + 1 === keys.length) {
        a[b] = value;
      } else {
        const next = a[b];
        const nextKey = keys[i + 1];

        if (typeof next !== 'object') {
          a[b] = nextKey === '0' || Number(nextKey) ? [] : {};
        }
      }

      return a[b];
      // eslint-disable-next-line
    }, object as any);
  }
}

/**
 * Remove the value of an object by using a path.
 * @param {T} object
 * @param {P} path
 */
export function remove<T extends object, P extends NestedPath<T> = NestedPath<T>>(object: T, path: P): void {
  const key = path as string;

  if (typeof object !== 'object') {
    throw new Error(`Can not remove ${key} from ${typeof object}.`);
  }

  const keys = key.split('.');

  if (keys.length <= 1) {
    if (Array.isArray(object)) {
      object.splice(Number(key), 1);
    } else {
      // eslint-disable-next-line
      delete (object as any)[key];
    }
  } else {
    keys.reduce((a, b, i) => {
      if (i + 1 === keys.length) {
        if (Array.isArray(a)) {
          a.splice(Number(b), 1);
        } else {
          delete a[b];
        }
      } else {
        const next = a[b];
        const nextKey = keys[i + 1];

        if (typeof next !== 'object') {
          a[b] = nextKey === '0' || Number(nextKey) ? [] : {};
        }
      }

      return a[b];
      // eslint-disable-next-line
    }, object as any);
  }
}

/**
 * Clone an object.
 * @param {T[] | T} source
 * @returns {T}
 */
export function clone<T>(source: T): T {
  if (source instanceof Map) {
    return cloneMap(source) as T;
  }

  if (source instanceof Set) {
    return cloneSet(source) as T;
  }

  if (source instanceof Date) {
    return new Date(source) as T;
  }

  if (typeOf(source) === 'object') {
    const copy = {} as Record<string, unknown>;

    for (const [key, value] of Object.entries(source as object)) {
      copy[key as never] = clone(value);
    }

    return copy as T;
  }

  if (isArray(source)) {
    const copy = [] as unknown[];

    for (const item of source) {
      copy.push(clone(item));
    }

    return copy as T;
  }

  return source;
}

/**
 * Clone a Map.
 * @param {Map<K, V>} source
 * @returns {Map<K, V>}
 */
export function cloneMap<K, V>(source: Map<K, V>): Map<K, V> {
  const copy = new Map<K, V>();

  for (const [key, value] of source.entries()) {
    copy.set(key, clone(value));
  }

  return copy;
}

/**
 * Clone a Set.
 * @param {Set<T>} source
 * @returns {Set<T>}
 */
export function cloneSet<T>(source: Set<T>): Set<T> {
  const copy = new Set<T>();

  for (const value of source.values()) {
    copy.add(clone(value));
  }

  return copy;
}

/**
 * Recursively replace the value of an object with value from another object by preserving the reference.
 * @param {object} object - An object to put the new value into.
 * @param {object} source - An object to put the new value from.
 */
export function replace(object: object, source: object): void {
  for (const [key] of Object.entries(object)) {
    delete object[key as never];
  }

  Object.assign(object, source);
}

/**
 * Recursively replace the item of an array with item from another array by preserving the reference.
 * @param {unknown[]} target - An array to put the new item into.
 * @param {unknown[]} source - An array to pull the new item from.
 */
export function replaceItems(target: unknown[], source: unknown[]): void {
  target.length = 0;
  target.push(...source);
}

/**
 * Recursively merge two objects by preserving the reference.
 * @param {object} target - An object to put the new value into.
 * @param {object} source - An object to put the new value from.
 * @param {boolean} cleanup - Remove the key that is not exist in the source object.
 */
export function merge(target: object, source: object, cleanup?: boolean) {
  for (const [key, value] of Object.entries(source)) {
    if (isArray(target[key as never]) && isArray(value)) {
      mergeItems(target[key as never], value, cleanup);
    } else if (isObject(target[key as never]) && isObject(value)) {
      merge(target[key as never], value, cleanup);
    } else {
      if (target[key as never] !== value) {
        target[key as never] = value as never;
      }
    }
  }

  if (cleanup) {
    for (const key of Object.keys(target)) {
      if (!(key in source)) {
        delete target[key as never];
      }
    }
  }
}

/**
 * Recursively merge two array by preserving the reference.
 * @param {unknown[]} target - An array to put the new item into.
 * @param {unknown[]} source - An array to pull the new item from.
 * @param {boolean} cleanup - Remove the item that is not exist in the source array.
 */
export function mergeItems(target: unknown[], source: unknown[], cleanup?: boolean) {
  if (target === source) return;

  if (!isArray(target) || !isArray(source)) {
    throw new Error('Target and source must be an Array!');
  }

  source.forEach((item, i) => {
    if (typeof item === 'undefined') {
      return;
    }

    if (typeOf(item) !== typeOf(target[i])) {
      target[i] = item;
    } else {
      if (Array.isArray(item)) {
        mergeItems(target[i] as unknown[], item as unknown[], cleanup);
      } else if (typeof item === 'object' && item !== null) {
        merge(target[i] as object, item as object, cleanup);
      } else {
        target[i] = item;
      }
    }
  });

  if (cleanup && source.length < target.length) {
    target.splice(source.length, target.length - source.length);
  }
}

/**
 * Split array into multiple rows by limiting the max columns.
 * @param items - An array to split.
 * @param columns - The max columns per row.
 */
export function splitRows(items: unknown[], columns: number): Array<unknown[]> {
  const rows: Array<unknown[]> = [];
  const limit = Math.ceil(items.length / columns);

  for (let row = 0; row < limit; ++row) {
    const cells = [];

    for (let i = row * columns; i < row * columns + columns; ++i) {
      if (typeof items[i] !== 'undefined') {
        cells.push(items[i]);
      }
    }

    if (cells.length) {
      rows.push(cells);
    }
  }

  return rows;
}

/**
 * Split array into multiple columns by limiting the max rows.
 * @param items - An array to split.
 * @param rows - The max rows per column.
 */
export function splitCols(items: unknown[], rows: number): Array<unknown[]> {
  const columns: Array<unknown[]> = [];
  const limit = Math.ceil(items.length / rows);

  for (let row = 0; row < rows; ++row) {
    const cells = [];

    for (let col = 0; col < limit; ++col) {
      const index = col * rows + row;

      if (typeof items[index] !== 'undefined') {
        cells.push(items[index]);
      }
    }

    if (cells.length) {
      columns.push(cells);
    }
  }

  return columns;
}

/**
 * Convert Javascript object into Raw string.
 * @param object
 * @returns {string}
 */
export function stringify(object: unknown): string {
  const text: string[] = [];

  if (isObject(object)) {
    text.push('{');

    for (const [key, value] of Object.entries(object as object)) {
      text.push(key, ':', stringify(value) as never, ',');
    }

    text.push('}');
  } else if (isArray(object)) {
    text.push('[');

    for (const item of object) {
      text.push(stringify(item), ',');
    }

    text.push(']');
  } else if (isFunction(object)) {
    text.push(object.toString());
  } else {
    text.push(JSON.stringify(object));
  }

  return text.join('');
}

/**
 * Object.entries() wrapper with strong typing.
 * @param {R} object
 * @returns {Array<[keyof R, R[keyof R]]>}
 */
export function entries<T extends object, R = Array<[keyof T, T[keyof T]]>>(object: T): R {
  return Object.entries(object) as never;
}

/**
 * Get all the nested paths of an object.
 * @param {T} target
 * @param {string} prefix
 * @return {R}
 */
export function nestedPaths<T extends object, R = NestedPaths<T>>(target: T, prefix?: string): R {
  const paths: string[] = [];

  if (Array.isArray(target)) {
    target.forEach((value, i) => {
      const key = `${prefix ? prefix + '.' : ''}${i}` as never;
      paths.push(key);

      if (isObject(value) || isArray(value)) {
        paths.push(...nestedPaths(value as object, key));
      }
    });
  } else if (isObject(target)) {
    for (const [prop, value] of Object.entries(target)) {
      const key = `${prefix ? prefix + '.' : ''}${prop}` as never;
      paths.push(key);

      if (isObject(value) || isArray(value)) {
        paths.push(...nestedPaths(value as object, key));
      }
    }
  }

  return paths as R;
}

/**
 * Get all the nested path maps of an object.
 * @param {T} target - Target object to get the path maps from.
 * @param {function} replace - Replace the value of the path.
 * @param {string} prefix - Prefix the path.
 * @return {NestedPathMaps<T>}
 */
export function nestedPathMaps<T extends object>(
  target: T,
  replace?: (key: NestedPath<T>, value: NestedPathValue<T, NestedPath<T>>) => NestedPathValue<T, NestedPath<T>>,
  prefix?: string
): NestedPathMaps<T> {
  const maps: NestedPathMaps<T> = {} as never;

  if (Array.isArray(target)) {
    target.forEach((value, i) => {
      const key = `${prefix ? prefix + '.' : ''}${i}` as never;
      maps[key] = typeof replace === 'function' ? (replace(key, value) as never) : (value as never);

      if (isObject(value) || isArray(value)) {
        Object.assign(maps, nestedPathMaps(value as T, replace, key));
      }
    });
  } else if (isObject(target)) {
    for (const [prop, value] of Object.entries(target)) {
      const key = `${prefix ? prefix + '.' : ''}${prop}` as never;
      maps[key] = typeof replace === 'function' ? (replace(key, value) as never) : (value as never);

      if (isObject(value) || isArray(value)) {
        Object.assign(maps, nestedPathMaps(value as T, replace, key));
      }
    }
  }

  return maps as never;
}
