import { unwrapArray, linearTransform, callAll } from '../src/utils';

test('unWrapArray returns the first item if an array', () => {
  expect(unwrapArray([1, 2])).toBe(1);
  expect(unwrapArray(1)).toBe(1);
});

test('callAll calls all functions', () => {
  const doThing = jest.fn();
  const doAnotherThing = jest.fn();
  callAll(doThing, doAnotherThing)('test');
  expect(doThing).toBeCalledWith('test');
  expect(doAnotherThing).toBeCalledWith('test');
});
