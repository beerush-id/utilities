# Inspector

The Inspector is a set of utilities that help you strictly check the variable types in your code, includes the type
guard.

## isString

The `isString` function is a type guard that helps you to check if a variable is a string.

```typescript
import { isString } from '@beerush/utilities';

let value: string | null = 'Hello, World!';

if (isString(value)) {
  // Even though the type of value is string | null, isString will infer the type of value as string.
  console.log(value.replace('World', 'Internet')); // Hello, Internet!
}
```

## isNumber

The `isNumber` function is a type guard that helps you to check if a variable is a number. It will return `true` if the
variable is a number and not `NaN`, and `false` otherwise.

```typescript
import { isNumber } from '@beerush/utilities';

let value: number | null = 10;
if (isNumber(value)) {
  // Even though the type of value is number | null, isNumber will infer the type of value as number.
  console.log(value + 10); // 20
}
```

## isInt

The `isInt` function is a type guard that helps you to check if a variable is an integer.

```typescript
import { isInt } from '@beerush/utilities';

const int = 10;
const float = 10.5;

if (isInt(int)) {
  console.log('This is an integer.');
}

if (isInt(float)) {
  console.log('This is an integer.');
} else {
  console.log('This is not an integer.');
}
```

## isFloat

The `isFloat` function is a type guard that helps you to check if a variable is a float.

```typescript
import { isFloat } from '@beerush/utilities';

const int = 10;
const float = 10.5;

if (isFloat(int)) {
  console.log('This is a float.');
} else {
  console.log('This is not a float.');
}

if (isFloat(float)) {
  console.log('This is a float.');
}
```

## isEven

The `isEven` function is a type guard that helps you to check if a variable is an even number.

```typescript
import { isEven } from '@beerush/utilities';

const even = 10;

if (isEven(even)) {
  console.log('This is an even number.');
}
```

## isOdd

The `isOdd` function is a type guard that helps you to check if a variable is an odd number.

```typescript
import { isOdd } from '@beerush/utilities';

const odd = 11;

if (isOdd(odd)) {
  console.log('This is an odd number.');
}
```

## isBoolean

The `isBoolean` function is a type guard that helps you to check if a variable is a boolean.

```typescript
import { isBoolean } from '@beerush/utilities';

const bool = true;

if (isBoolean(bool)) {
  console.log('This is a boolean.');
}
```

## isBooleanString

The `isBooleanString` function is a type guard that helps you to check if a variable is a boolean string.

```typescript
import { isBooleanString } from '@beerush/utilities';

const bool = 'true';

if (isBooleanString(bool)) {
  console.log('This is a boolean string.');
}
```

## isObject

The `isObject` function is a type guard that helps you to check if a variable is a key-value object.

```typescript
import { isObject } from '@beerush/utilities';

const obj = {};
const arr = [];

if (isObject(obj)) {
  console.log('This is an object.');
}

if (isObject(arr)) {
  console.log('This is an object.');
} else {
  console.log('This is not an object.'); // Output
}
```

You can also check if a variable is an object with a specific structure by using the generic version of `isObject`.

```typescript
import { isObject } from '@beerush/utilities';

type User = { id: number; name: string };
let user = { id: 1, name: 'John Doe' };

if (isObject<User>(user)) {
  console.log(`Hello, ${ user.name }!`); // Hello, John Doe!
}
```

## isObjectLike

The `isObjectLike` function is a type guard that helps you to check if a variable is an object-like, such as an instance
of a class.

```typescript
import { isObjectLike } from '@beerush/utilities';

class User {
  constructor(public id: number, public name: string) { }
}

const obj = {};
const arr = [];
const user = new User(1, 'John Doe');

if (isObjectLike(obj)) {
  console.log('This is an object-like.');
}

if (isObjectLike(user)) {
  console.log('This is an object-like.');
}

if (isObjectLike(arr)) {
  console.log('This is an object-like.');
} else {
  console.log('This is not an object-like.'); // Output
}
```

## isArray

The `isArray` function is a type guard that helps you to check if a variable is an array.

```typescript
import { isArray } from '@beerush/utilities';

const obj = {};
const arr = [];

if (isArray(obj)) {
  console.log('This is an array.');
} else {
  console.log('This is not an array.'); // Output
}

if (isArray(arr)) {
  console.log('This is an array.');
}
```

## isFunction

The `isFunction` function is a type guard that helps you to check if a variable is a function.

```typescript
import { isFunction } from '@beerush/utilities';

const func = () => { };

if (isFunction(func)) {
  console.log('This is a function.');
}
```

## isDate

The `isDate` function is a type guard that helps you to check if a variable is a date.

```typescript
import { isDate } from '@beerush/utilities';

const date = new Date();

if (isDate(date)) {
  console.log('This is a date.');
}
```

## isDateString

The `isDateString` function is a type guard that helps you to check if a variable is a date string.

```typescript
import { isDateString } from '@beerush/utilities';

const date = '2024-05-09';

if (isDateString(date)) {
  console.log('This is a date string.');
}
```

## isRegExp

The `isRegExp` function is a type guard that helps you to check if a variable is a regular expression.

```typescript
import { isRegExp } from '@beerush/utilities';

const regex = /Hello, World/;

if (isRegExp(regex)) {
  console.log('This is a regular expression.');
}
```

## isError

The `isError` function is a type guard that helps you to check if a variable is an error.

```typescript
import { isError } from '@beerush/utilities';

const error = new Error('Something went wrong!');

if (isError(error)) {
  console.log('This is an error.');
}
```

## isNullish

The `isNullish` function is a type guard that helps you to check if a variable is `null` or `undefined`.

```typescript
import { isNullish } from '@beerush/utilities';

let value: string | null = null;
let other: number | null = NaN;

if (isNullish(value)) {
  console.log('This is null, NaN, or undefined.');
}

if (isNullish(other)) {
  console.log('This is null, NaN, or undefined.');
}
```

## isTruthy

The `isTruthy` function is a type guard that helps you to check if a variable is truthy.

```typescript
import { isTruthy } from '@beerush/utilities';

let value: string | null = 'Hello, World!';

if (isTruthy(value)) {
  console.log('This is a truthy value.');
}
```

## isFalsy

The `isFalsy` function is a type guard that helps you to check if a variable is falsy, but excluding `0`, negative
number, and empty string.

```typescript
import { isFalsy } from '@beerush/utilities';

let value: string | null = null;
const foo = false;
const bar = '';
const baz = -1;

if (isFalsy(value)) {
  console.log('This is a falsy value.');
}

if (isFalsy(foo)) {
  console.log('This is a falsy value.');
}

if (isFalsy(bar)) {
  console.log('This is not a falsy value.');
}

if (isFalsy(baz)) {
  console.log('This is not a falsy value.');
}
```

## isPositive

The `isPositive` function is a type guard that helps you to check if a variable is a positive number.

```typescript
import { isPositive } from '@beerush/utilities';

const positive = 10;
const negative = -10;

if (isPositive(positive)) {
  console.log('This is a positive number.');
}

if (isPositive(negative)) {
  console.log('This is not a positive number.');
}
```

## isEmpty

The `isEmpty` function is a type guard that helps you to check if a variable is empty. The function will return `true`

- If the variable is a `nullish` value.
- if the variable is a zero number.
- If the variable is an empty string.
- If the variable is an empty array.
- If the variable is an empty object.
- If the variable is an empty map.
- If the variable is an empty set.

```typescript
import { isEmpty } from '@beerush/utilities';

let empty: string | null = null;
let str = '';
let arr = [];
let obj = {};
let map = new Map();
let set = new Set();

if (isEmpty(empty)) {
  console.log('This is an empty value.');
}

if (isEmpty(str)) {
  console.log('This is an empty string.');
}

if (isEmpty(arr)) {
  console.log('This is an empty array.');
}

if (isEmpty(obj)) {
  console.log('This is an empty object.');
}

if (isEmpty(map)) {
  console.log('This is an empty map.');
}

if (isEmpty(set)) {
  console.log('This is an empty set.');
}
```

## typeOf

The `typeOf` function is a utility function that helps you to check the type of a variable. Unlike the `typeof`
operator, the `typeOf` function will return the type of the variable using the `toString.call` method.

For example, `typeOf([])` will return `array` instead of `object`.

```typescript
import { typeOf } from '@beerush/utilities';

console.log(typeOf({})); // object
console.log(typeOf([])); // array
console.log(typeOf(null)); // null
console.log(typeOf('')); // string
console.log(typeOf(0)); // number
```
