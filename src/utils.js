/* @flow */

/**
 * Linear transform of a number between a range to a given range
 * @private
 *
 * @param {number} num - a number between the moveOffsetLower and moveOffsetUpper
 * @param {number} moveOffsetLower - lower offset bound
 * @param {number} moveOffsetUpper - upper offset bound
 * @param {number} parallaxDegreeLowerBound - lower rotation degree bound
 * @param {number} parallaxDegreeUpperBound - upper rotation degree bound
 * @returns {number} - a number between parallaxDegreeLowerBound and parallaxDegreeUpperBound
 */
export function linearTransform(
  num: number,
  moveOffsetLower: number,
  moveOffsetUpper: number,
  parallaxDegreeLowerBound: number,
  parallaxDegreeUpperBound: number
): number {
  return (
    (num - moveOffsetLower) /
      (moveOffsetUpper - moveOffsetLower) *
      (parallaxDegreeUpperBound - parallaxDegreeLowerBound) +
    parallaxDegreeLowerBound
  );
}

/**
 * Takes an argument and if it's an array, returns the first item in the array
 * otherwise returns the argument
 * @private
 *
 * @param {*} arg the maybe-array
 * @return {*} the arg or it's first item
 */
export function unwrapArray(arg: any | Array<any>): any {
  return Array.isArray(arg) ? arg[0] : arg;
}
