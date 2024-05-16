import { typify } from '../dist/transform.js';
import { expect, it, suite } from 'vitest';

suite('typify function', () => {
  // Test for boolean values
  it('should convert "true" string to boolean true', () => {
    const result = typify<boolean>('true');
    expect(result).toBe(true);
  });

  it('should convert "false" string to boolean false', () => {
    const result = typify<boolean>('false');
    expect(result).toBe(false);
  });

  // Test for numeric values
  it('should convert integer string to actual number', () => {
    const result = typify<number>('123');
    expect(result).toBe(123);
  });

  it('should convert float string to actual number', () => {
    const result = typify<number>('123.456');
    expect(result).toBe(123.456);
  });

  it('should convert negative numeric string to actual number', () => {
    const result = typify<number>('-0.5');
    expect(result).toBe(-0.5);
  });

  // Test for date strings
  it('should convert date string to Date object', () => {
    const result = typify<Date>('2022-12-12');
    expect(result).toBeInstanceOf(Date);
    expect(result.valueOf()).toBe(new Date('2022-12-12').valueOf());
  });

  // Test for JSON string
  it('should convert JSON string to JS object', () => {
    const result = typify<{ a: number }>('{"a": "2", "b": "true", "c": "2022-12-12"}');
    expect(result).toEqual({ a: 2, b: true, c: new Date('2022-12-12') });
  });

  // Test for recursive boolean
  it('recursive boolean flag to false should not parse JSON string', () => {
    const result = typify<{ a: number }>('{"a": "2", "b": "true", "c": "2022-12-12"}', false);
    expect(result).toEqual({ a: '2', b: 'true', c: '2022-12-12' });
  });

  it('should return the value if it is not a string', () => {
    const obj = { a: 1 };
    const result = typify(obj as never);
    expect(result).toBe(obj);
    expect((result as never) === obj).toBe(true);
  });
});
