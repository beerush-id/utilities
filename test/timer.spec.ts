import { describe, expect, it, suite } from 'vitest';
import { loop, once, sleep } from '../dist/timer.js';

suite('Timer', () => {
  describe('sleep', () => {
    it('should sleep for a given time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(100);
    });

    it('should not sleep for a negative time', async () => {
      const start = Date.now();
      await sleep(-100);
      const end = Date.now();

      expect(end - start).toBeLessThan(100);
    });

    it('should not sleep for a zero time', async () => {
      const start = Date.now();
      await sleep(0);
      const end = Date.now();

      expect(end - start).toBeLessThan(100);
    });
  });

  describe('once', () => {
    it('should fulfill a function', async () => {
      const fulfill = () => 'fulfilled';
      const result = await once(fulfill, 0);

      expect(result).toBe('fulfilled');
    });

    it('should fulfill a function after a few retries', async () => {
      let count = 0;
      const fulfill = () => {
        if (count++ < 3) {
          throw new Error('Not yet fulfilled');
        }

        return 'fulfilled';
      };
      const result = await once(fulfill, 0, 5);

      expect(result).toBe('fulfilled');
    });

    it('should throw an error if unable to fulfill', async () => {
      const fulfill = () => {
        throw new Error('Unable to fulfill');
      };

      await expect(once(fulfill, 0, 5)).rejects.toThrow('Unable to fulfill');
    });

    it('should throw an error if unable to fulfill after max retries', async () => {
      const fulfill = () => {
        throw new Error('Unable to fulfill');
      };

      await expect(once(fulfill, 0, 3)).rejects.toThrow('Unable to fulfill');
    });

    it('should fulfill a function after a few retries with debounce', async () => {
      const start = Date.now();
      let count = 0;
      const fulfill = () => {
        if (count++ < 3) {
          throw new Error('Not yet fulfilled');
        }

        return 'fulfilled';
      };
      const result = await once(fulfill, 100, 5);
      const end = Date.now();

      expect(result).toBe('fulfilled');
      expect(end - start).toBeGreaterThanOrEqual(300);
    });
  });

  describe('loop', () => {
    it('should loop a function', async () => {
      let count = 0;
      const stop = loop(() => {
        count++;
      }, 100);

      await sleep(400);
      stop();

      expect(count).toBe(4);
    });

    it('should loop a function with a maximum number of iterations', async () => {
      let count = 0;
      loop(
        () => {
          count++;
        },
        100,
        3
      );

      await sleep(400);

      expect(count).toBe(3);
    });
  });
});
