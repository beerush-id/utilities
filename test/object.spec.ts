import { expect, test } from 'vitest';
import {
  clone,
  merge,
  nestedPathMaps,
  nestedPaths,
  read,
  remove,
  replace,
  replaceItems,
  write,
} from '../dist/object.js';
import { splitCols, splitRows } from '../src/index.js';

test('read function', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, { e: 5 }],
    },
  };

  expect(read(obj, 'a')).toBe(1);
  expect(read(obj, 'b.c')).toBe(2);
  expect(read(obj, 'b.d.1')).toBe(4);
  expect(read(obj, 'b.d.2.e' as never)).toBe(5);
  expect(read(obj, 'x' as never, 'fallback')).toBe('fallback');
});

test('write function', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, { e: 5 }],
    },
  };

  write(obj, 'a', 10);
  expect(obj.a).toBe(10);

  write(obj, 'b.c', 20);
  expect(obj.b.c).toBe(20);

  write(obj, 'b.d.1', 40);
  expect(obj.b.d[1]).toBe(40);

  write(obj, 'b.d.2.e' as never, 50 as never);
  expect((obj.b.d[2] as Record<string, number>).e).toBe(50);
});

test('remove function', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, { e: 5 }],
    },
  };

  remove(obj, 'a');
  expect(obj.a).toBeUndefined();

  remove(obj, 'b.c');
  expect(obj.b.c).toBeUndefined();

  remove(obj, 'b.d.1');
  expect(obj.b.d[1]).toEqual({ e: 5 });

  remove(obj, 'b.d.1.e' as never);
  expect((obj.b.d[1] as Record<string, number>).e).toBeUndefined();
});

test('clone function', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, { e: 5 }],
    },
  };

  const clonedObj = clone(obj);
  expect(JSON.stringify(clonedObj)).toEqual(JSON.stringify(obj));

  clonedObj.a = 10;
  expect(obj.a).toBe(1);
  expect(clonedObj.a).toBe(10);
});

test('merge function', () => {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { b: 3, c: 4 };

  merge(obj1, obj2);
  expect(obj1).toEqual({ a: 1, b: 3, c: 4 });
});

test('replace function', () => {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { b: 3, c: 4 };

  replace(obj1, obj2);
  expect(obj1).toEqual({ b: 3, c: 4 });
});

test('replaceItems function', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  replaceItems(items, [2, 3, 4]);

  expect(items).toEqual([2, 3, 4]);
});

test('splitRows function', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const split = splitRows(items, 2);

  expect(split).toEqual([
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
  ]);
});

test('splitCols function', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const split = splitCols(items, 2);

  expect(split).toEqual([
    [1, 3, 5, 7, 9],
    [2, 4, 6, 8, 10],
  ]);
});

test('entries function', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };

  const entries = Object.entries(obj);
  expect(entries).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

test('nestedPaths function', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, { e: 5 }],
    },
  };

  const paths = nestedPaths(obj);
  expect(paths).toEqual(['a', 'b', 'b.c', 'b.d', 'b.d.0', 'b.d.1', 'b.d.2', 'b.d.2.e']);
});

test('nestedPathMaps function', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, { e: 5 }],
    },
  };

  const maps = nestedPathMaps(obj);
  expect(maps).toEqual({
    a: 1,
    b: obj.b,
    'b.c': 2,
    'b.d': obj.b.d,
    'b.d.0': 3,
    'b.d.1': 4,
    'b.d.2': obj.b.d[2],
    'b.d.2.e': 5,
  });
});
