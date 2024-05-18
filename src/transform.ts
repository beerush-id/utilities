import { isArray, isDateString, isObject } from './inspector.js';

export type TransformOptions = {
  keys?: Record<string, string>;
  values?: Record<string, (value: unknown, origin: Record<string, unknown>) => unknown>;
  omittedKeys?: string[];
};

/**
 * Transform the given object based on the provided options.
 * @param {Record<string, unknown>} value
 * @param {TransformOptions} options
 * @returns {Record<string, unknown>}
 */
export function transform(value: Record<string, unknown>, options: TransformOptions) {
  if (options.values) {
    for (const [key, exec] of Object.entries(options.values)) {
      value[key] = exec(value[key], value);
    }

    if (options.keys) {
      for (const [key, mappedKey] of Object.entries(options.keys)) {
        value[mappedKey] = value[key];
        delete value[key];
      }
    }

    if (options.omittedKeys) {
      for (const key of options.omittedKeys) {
        delete value[key];
      }
    }

    return value;
  }
}

/**
 * Convert the given string value to a proper type.
 * @param {string} value
 * @param {boolean} recursive
 * @returns {unknown}
 */
export function typify<T>(value: string, recursive = true): T {
  if (typeof value !== 'string') return value;

  if (value === 'true') {
    return true as never;
  } else if (value === 'false') {
    return false as never;
  } else if (!isNaN(+value)) {
    return +value as never;
  } else if (isDateString(value)) {
    return new Date(value) as never;
  } else {
    try {
      const result = JSON.parse(value);

      if (!recursive) return result as never;

      if (isObject(result)) {
        for (const [key, value] of Object.entries(result)) {
          if (typeof value === 'string') {
            result[key as never] = typify(value);
          }
        }
      }

      if (isArray(result)) {
        for (let i = 0; i < result.length; i++) {
          if (typeof result[i] === 'string') {
            result[i] = typify(result[i] as never);
          }
        }
      }

      return result as never;
    } catch {
      return value as never;
    }
  }
}
