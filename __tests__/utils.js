import { unwrapArray, linearTransform } from '../src/utils';

test('unWrapArray returns the first item if an array', () => {
  expect(unwrapArray([1, 2])).toBe(1);
  expect(unwrapArray(1)).toBe(1);
});

test('linearTransform returns a value between the lower/upper bounds', () => {
  const lower = -10;
  const upper = 10;
  const val = linearTransform(0.9, 0, 1, lower, upper);
  expect(val).toBeGreaterThan(lower);
  expect(val).toBeLessThan(upper);
  expect(val).toBe(8);
});
