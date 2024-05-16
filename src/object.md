# Object

Various utilities for objects.

## Reader

A reader is a function that reads a value from an object. It is useful for reading values from nested objects.

```typescript
import { read } from '@beerush/utilities';

const obj = {
  a: {
    b: {
      c: 'Hello, World!',
    },
  },
};

console.log(read(obj, 'a.b.c')); // Hello, World!
```

## Writer

A writer is a function that writes a value to an object. It is useful for writing values to nested objects.

```typescript
import { write } from '@beerush/utilities';

const obj = {};

write(obj, 'a.b.c', 'Hello, World!');
console.log(obj); // { a: { b: { c: 'Hello, World!' } } }
```

## Remover

A remover is a function that removes a value from an object. It is useful for removing values from nested objects.

```typescript
import { remove } from '@beerush/utilities';

const obj = {
  a: {
    b: {
      c: 'Hello, World!',
    },
  },
};

remove(obj, 'a.b.c');
console.log(obj); // { a: { b: {} } }
```

## Merger

A merger is a function that merges two objects. It is useful for merging two objects.

```typescript
import { merge } from '@beerush/utilities';

const obj1 = { a: 1 };
const obj2 = { b: 2 };

console.log(merge(obj1, obj2)); // { a: 1, b: 2 }
```

## Cloner

A cloner is a function that clones an object. It is useful for cloning an object.

```typescript
import { clone } from '@beerush/utilities';

const obj = { a: 1 };

console.log(clone(obj)); // { a: 1 }
```

## Replacer

A replacer is a function that replaces a value in an object. It is useful for replacing a value in an object by keeping
the reference.

```typescript
import { replace } from '@beerush/utilities';

const obj = { a: 1 };

replace(obj, { b: 2 });

console.log(obj); // { b: 2 }
```

## Splitter

A splitter is a function that splits an array into multiple columns or rows.

### Splitting an array into specified columns.

```typescript
import { splitRows } from '@beerush/utilities';

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

console.log(splitRows(arr, 3)); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
```

### Splitting an array into specified rows.

```typescript
import { splitCols } from '@beerush/utilities';

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

console.log(splitCols(arr, 3)); // [[1, 4, 7, 10], [2, 5, 8], [3, 6, 9]]
```

## Nested Paths

Get nested paths from an object.

```typescript
import { nestedPaths } from '@beerush/utilities';

const obj = {
  a: {
    b: {
      c: 'Hello, World!',
    },
  },
};

console.log(nestedPaths(obj)); // ['a', 'a.b', 'a.b.c']
```

## Nested Path Map

Get nested path map from an object.

```typescript
import { nestedPathMaps } from '@beerush/utilities';

const obj = {
  a: {
    b: {
      c: 'Hello, World!',
    },
  },
};

console.log(nestedPathMaps(obj));
```

**Output**

```bash
{
  'a': {
    'b': {
      'c': 'Hello, World!'
    }
  },
  'a.b': {
    'c': 'Hello, World!'
  },
  'a.b.c': 'Hello, World!'
}
```
