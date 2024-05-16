import { describe, expect, it, suite } from 'vitest';
import {
  isArray,
  isBoolean,
  isBooleanString,
  isDate,
  isDateString,
  isDefined,
  isEmpty,
  isError,
  isEven,
  isFalsy,
  isFloat,
  isFunction,
  isInt,
  isMap,
  isNullish,
  isNumber,
  isNumberString,
  isObject,
  isObjectLike,
  isOdd,
  isPositive,
  isRegExp,
  isSet,
  isString,
  isUnitString,
} from '../dist/inspector.js';

suite('Inspector', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('a')).toBe(true);
      expect(isString('')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(1)).toBe(false);
      expect(isString(null)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(1)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(1.5)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('a')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(NaN)).toBe(false);
    });
  });

  describe('isNumberString', () => {
    it('should return true for numeric strings', () => {
      expect(isNumberString('1')).toBe(true);
      expect(isNumberString('0')).toBe(true);
      expect(isNumberString('-1')).toBe(true);
      expect(isNumberString('1.5')).toBe(true);
    });

    it('should return false for non-numeric strings', () => {
      expect(isNumberString('a')).toBe(false);
      expect(isNumberString('')).toBe(false);
    });
  });

  describe('isUnitString', () => {
    it('should return true for unit strings', () => {
      expect(isUnitString('1px')).toBe(true);
      expect(isUnitString('1em')).toBe(true);
      expect(isUnitString('1rem')).toBe(true);
      expect(isUnitString('29.3mm')).toBe(true);
      expect(isUnitString('1%')).toBe(true);
      expect(isUnitString('-1.5pt')).toBe(true);
      expect(isUnitString('-1.5cm')).toBe(true);
    });

    it('should return false for non-unit strings', () => {
      expect(isUnitString('1')).toBe(false);
      expect(isUnitString('px')).toBe(false);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(-1)).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('should return true for odd numbers', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(-1)).toBe(true);
    });

    it('should return false for even numbers', () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(0)).toBe(false);
    });
  });

  describe('isInt', () => {
    it('should return true for integers', () => {
      expect(isInt(1)).toBe(true);
      expect(isInt(0)).toBe(true);
    });

    it('should return false for non-integers', () => {
      expect(isInt(1.5)).toBe(false);
      expect(isInt(-1.5)).toBe(false);
    });
  });

  describe('isFloat', () => {
    it('should return true for floats', () => {
      expect(isFloat(1.5)).toBe(true);
      expect(isFloat(-1.5)).toBe(true);
    });

    it('should return false for non-floats', () => {
      expect(isFloat(1)).toBe(false);
      expect(isFloat(0)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });
  });

  describe('isBooleanString', () => {
    it('should return true for boolean strings', () => {
      expect(isBooleanString('true')).toBe(true);
      expect(isBooleanString('false')).toBe(true);
    });

    it('should return false for non-boolean strings', () => {
      expect(isBooleanString('1')).toBe(false);
      expect(isBooleanString('0')).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for dates', () => {
      expect(isDate(new Date())).toBe(true);
    });

    it('should return false for non-dates', () => {
      expect(isDate('2021-01-01')).toBe(false);
    });
  });

  describe('isDateString', () => {
    it('should return true for date strings', () => {
      expect(isDateString('2021-01-01')).toBe(true);
    });

    it('should return false for non-date strings', () => {
      expect(isDateString('a')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
    });
  });

  describe('isMap', () => {
    it('should return true for maps', () => {
      expect(isMap(new Map())).toBe(true);
    });

    it('should return false for non-maps', () => {
      expect(isMap({})).toBe(false);
    });
  });

  describe('isSet', () => {
    it('should return true for sets', () => {
      expect(isSet(new Set())).toBe(true);
    });

    it('should return false for non-sets', () => {
      expect(isSet({})).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject([])).toBe(false);
    });
  });

  describe('isObjectLike', () => {
    class User {
      constructor(
        public id: string,
        public name: string
      ) {}
    }

    const user = new User('1', 'John Doe');

    it('should return true for object-like values', () => {
      expect(isObjectLike({})).toBe(true);
      expect(isObjectLike(user)).toBe(true);
    });

    it('should return false for non-object-like values', () => {
      expect(isObjectLike(null)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
    });
  });

  describe('isRegExp', () => {
    it('should return true for regular expressions', () => {
      expect(isRegExp(/.*/)).toBe(true);
    });

    it('should return false for non-regular expressions', () => {
      expect(isRegExp({})).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for error objects', () => {
      expect(isError(new Error())).toBe(true);
    });

    it('should return false for non-error objects', () => {
      expect(isError({})).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
    });

    it('should return false for undefined values', () => {
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('should return true for nullish values', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
      expect(isNullish(NaN)).toBe(true);
    });

    it('should return false for defined values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(isPositive(1)).toBe(true);
    });

    it('should return false for non-positive numbers', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-1)).toBe(false);
      expect(isPositive('10' as never)).toBe(false);
    });
  });

  describe('isFalsy', () => {
    it('should return true for falsy values', () => {
      expect(isFalsy(null)).toBe(true);
      expect(isFalsy(undefined)).toBe(true);
      expect(isFalsy(false)).toBe(true);
    });

    it('should return false for truthy values', () => {
      expect(isFalsy(1)).toBe(false);
      expect(isFalsy(true)).toBe(false);
      expect(isFalsy('')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('a')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });
});
