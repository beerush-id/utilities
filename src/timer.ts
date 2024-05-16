import { logger } from './logger.js';

// Create a logger with the tag 'timer'
const timerLog = logger.create({ tags: ['timer'] });
// Create a logger with the tags 'timer' and 'loop'
const looperLog = timerLog.create({ tags: ['loop'] });

/**
 * Sleep for a given time.
 * @param {number} time - The time to sleep in milliseconds
 * @returns {Promise<void>} A Promise that resolves after the specified time
 */
export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Tries to execute a function until it returns a value without throwing,
 * or reaching the max number if iterations.
 * Sleeps for a provided interval between each attempt.
 *
 * @template T The type of the returned Promise
 * @param {() => T | Promise<T>} fulfill - The function to be fulfilled
 * @param {number} debounce - The interval to sleep between each attempt (in milliseconds)
 * @param {number} [maxRetries=1] - The maximum number of attempts
 * @returns {Promise<T>} A Promise with the return value of the first successful call to `fulfill`
 * @throws Will throw an error if unable to fulfill the function after `max` attempts
 */
export async function once<T>(fulfill: () => T | Promise<T>, debounce: number, maxRetries: number = 1): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fulfill();
    } catch (error) {
      if (attempt == maxRetries) {
        throw error;
      }

      await sleep(debounce);
    }
  }

  throw new Error('Unable to fulfill after ' + maxRetries + ' attempts.');
}

// Type definition for a function that stops a loop
export type Stop = () => void;

/**
 * Loop a function with a given interval in background.
 * @param {() => void} fn - The function to be looped
 * @param {number} interval - The interval between each loop (in milliseconds)
 * @param {number} [max] - Maximum number of iterations. If not provided, the loop will run indefinitely.
 * @returns {Stop} A function that stops the loop when called
 */
export function loop(fn: () => void | Promise<void>, interval: number, max?: number): Stop {
  let timer = 0;

  const start = async () => {
    if (timer) {
      clearTimeout(timer);
    }

    try {
      await fn();
    } catch (error) {
      looperLog.error('Failed to run the loop.', error as Error);
    }

    if (max && --max === 0) return;
    timer = setTimeout(start, interval) as never;
  };

  start().catch((error) => {
    looperLog.error('Failed to start the loop.', error);
  });

  return () => clearTimeout(timer);
}
