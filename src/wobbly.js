/* @flow */

import React, { Component } from 'react';
import throttle from 'lodash.throttle';

import { linearTransform, unwrapArray, callAll, noop } from './utils';

type StateAndHelpers = {
  // Prop Getters
  getWrapperProps: () => {},
  getWrapperTransformStyle: () => {},
  // State
  x: number,
  y: number,
};

type RenderProp = StateAndHelpers => {};

type Props = {
  moveThrottleMs: number,
  parallaxDegreeLowerBound: number,
  parallaxDegreeUpperBound: number,
  slop: number,
  initialRotateX: number,
  initialRotateY: number,
  children: RenderProp,
  render: RenderProp,
};

type State = {
  rotation: {
    x: number,
    y: number,
  },
};

type SytheticMoveEvent = {
  persist: () => {},
  nativeEvent: { offset: [number, number] },
};

/**
 * # Wobbly
 * <h1 align="center">
 *   〰️ wobbly
 *   </br>
 *   <img src="https://user-images.githubusercontent.com/1127238/38072922-8250c22a-32dd-11e8-8259-fb8ea3346dfc.png" alt="wobbly logo" title="wobbly logo" width="100">
 * </h1>
 * <p align="center">parallax all the things in react-vr</p>
 * <hr />
 * </br>
 * wobbly manages the state needed to calculate `x, y` rotations for a parallax effect, allowing you to focus the UI, and apply the effect how/where you want.
 */
class Wobbly extends Component<Props, State> {
  /**
   * @type {object}
   * @private
   *
   * @property {number} [parallaxDegreeLowerBound=-15] - lower rotation degree bound
   * @property {number} [parallaxDegreeUpperBound=15] - upper rotation degree bound
   * @property {number} [slop=0.1] - slop to add to wrapper via prop getter
   * @property {number} [initialRotateX=0] - initial rotateX value
   * @property {number} [initialRotateY=0] - initial rotateY value
   * @see {@link https://facebook.github.io/react-vr/docs/view.html#hitslop|hitSlop react-vr docs}
   */
  static defaultProps = {
    parallaxDegreeLowerBound: -15,
    parallaxDegreeUpperBound: 15,
    initialRotateX: 0,
    initialRotateY: 0,
    slop: 0.1,
  };

  /**
   * @type {object}
   * @private
   * @property {Object} rotation - state - The current x,y rotation state
   */
  state = {
    rotation: {
      x: this.props.initialRotateX,
      y: this.props.initialRotateY,
    },
  };

  /**
   * Sets the rotation state with the transformed x,y values throttled
   * @private
   *
   * @param {number[]} offsets - array of values representing the move offset
   * @returns void
   */
  updateParallax = throttle((offsets: [number, number]) => {
    this.setState(() => ({
      rotation: {
        x: linearTransform(
          offsets[1],
          0,
          1,
          this.props.parallaxDegreeLowerBound,
          this.props.parallaxDegreeUpperBound
        ),
        y: linearTransform(
          offsets[0],
          0,
          1,
          this.props.parallaxDegreeLowerBound,
          this.props.parallaxDegreeUpperBound
        ),
      },
    }));
  }, this.props.moveThrottleMs);

  handleMove = (event: SytheticMoveEvent): void => {
    event.persist();
    this.updateParallax(event.nativeEvent.offset);
  };

  handleExit = (): void => {
    this.setState(() => ({
      rotation: {
        x: this.props.initialRotateX,
        y: this.props.initialRotateY,
      },
    }));
  };

  /**
   * The state of wobbly and prop getters are exposed as a parameter to the render prop.
   *
   * @typedef {object} StateAndHelpers
   *
   * @property {function} getWrapperProps - prop getter - returns the props to spread into the element to which a parallax effect should be added
   * @property {function} getWrapperTransformStyle - prop getter - returns the x,y state in a format the transform style property will take. Spread this into the style.transform array on the element to which a parallax effect should be added.
   * @property {number} x - state - x rotation state value
   * @property {number} y - state - y rotation state value
   */
  getWrapperProps = (props = {}) => ({
    ...props,
    onMove: callAll(props.onMove, this.handleMove),
    onExit: callAll(props.onExit, this.handleExit),
    hitSlop: {
      top: this.props.slop,
      bottom: this.props.slop,
      left: this.props.slop,
      right: this.props.slop,
    },
  });
  getWrapperTransformStyle = () => [
    { rotateX: this.state.rotation.x },
    { rotateY: this.state.rotation.y },
  ];

  /**
   * Returns state and helpers for render callback.
   * @private
   *
   * @return {StateAndHelpers}
   *  The state and helper functions exposed as a parameter to the render callback
   */
  getStateAndHelpers(): StateAndHelpers {
    return {
      // Prop Getters
      getWrapperProps: this.getWrapperProps,
      getWrapperTransformStyle: this.getWrapperTransformStyle,
      // State
      x: this.state.rotation.x,
      y: this.state.rotation.y,
    };
  }

  render() {
    const children = unwrapArray(
      this.props.render || this.props.children,
      noop
    );
    const element = unwrapArray(children(this.getStateAndHelpers()));
    if (!element) {
      return null;
    }
    return element;
  }
}

export default Wobbly;
