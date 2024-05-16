import { isArray, isDateString, isObject } from './inspector.js';

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
