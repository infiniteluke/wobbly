/* @flow */

/**
 * Calls all functions
 * @private
 * @param {Array<function>} fns - functions to call in sequence
 * @returns {function}
 */
export function callAll(...fns: Array<() => void>): () => void {
  return (...args) => fns.forEach(fn => fn && fn(...args));
}

/**
 * Takes an argument and if it's an array, returns the first item in the array
 * otherwise returns the argument
 * @private
 *
 * @param {*} arg the maybe-array
 * @returns {*} the arg or it's first item
 */
export function unwrapArray(arg: any | Array<any>): any {
  return Array.isArray(arg) ? arg[0] : arg;
}

export function noop() {}
