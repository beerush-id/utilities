# Timer Utilities

This module provides a set of utilities to work with timers.

## Sleep

The `sleep` function is a utility function that allows you to pause the execution of a function for a specified amount
of time. This is useful when you want to introduce a delay in your code.

### Usage

```typescript
import { sleep } from '@beerush/utilities';

async function main() {
  console.log('Hello, World!');
  await sleep(1000); // Pause for 1 second.
  console.log('Goodbye, World!');
}
```

## Once

Tries to execute a function until it returns a value without throwing, or reaching the max number if iterations. Sleeps
for a provided interval between each attempt.

The `once` function is useful when you want to retry a function until it succeeds, or until a certain number of attempts
have been made. For example, you can use this function to retry a network request if it fails.

### Usage

```typescript
import { once } from '@beerush/utilities';

// Try to execute the function until it returns a value without throwing, or reaching the max number of iterations.
async function main() {
  const result = await once(() => {
    return Math.random() > 0.5 ? 'Success' : throw new Error('Failed');
  }, 1000, 5);

  console.log(result);
}
```

## Loop

Executes a function repeatedly with a specified interval between each execution. The function will be executed until the
stop function is called, or the max number of iterations is reached.

### Usage

```typescript
import { loop } from '@beerush/utilities';

// Execute the function repeatedly with a specified interval between each execution.
async function main() {
  const stop = loop(() => {
    console.log('Hello, World!');
  }, 1000, 6);

  await sleep(5000); // Pause for 5 seconds.
  stop(); // Stop the loop.
}
```
