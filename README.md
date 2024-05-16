# @beerush/utilities

A collection of utilities for JavaScript and TypeScript.

## 🗃️ Features

- [Inspector](./src/inspector.md) - Utilities for inspecting types.
- [Object utilities](./src/object.md) - Various utilities for objects.
- [Timer](./src/timer.md) - Utilities for timing functions.
- [Transform](./src/transform.md) - Utilities for transforming value.
- [Logger](https://github.com/beerush-id/logger) - Utilities for logging.

## 📦 Installation

You can install the package via package manager such as bun, npm, or yarn.

```bash
bun add @beerush/utilities
```

## 🪄 Usage

You can use it in your typescript files like shown below:

**Initialization** in `./utilities.ts`

```typescript
import { isString, isObject } from '@beerush/utilities';

console.log(isString('Hello, World!')); // true
console.log(isObject({})); // true
console.log(isObject([])); // false
```

## License

The `@beerush/utilities` is licensed under the MIT License, ensuring a wide range of opportunities for open source use
and further development.
