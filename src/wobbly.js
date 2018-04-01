/* @flow */

import type { StateAndHelpers, RenderProp, SytheticMoveEvent } from './types';

import React, { Component } from 'react';
import { Animated } from 'react-vr';

import { unwrapArray, callAll, noop } from './utils';

const MOVE_INPUT_RANGE = [0, 1];

type Props = {
  parallaxDegreeLowerBound: number,
  parallaxDegreeUpperBound: number,
  slop: number,
  initialX: number,
  initialY: number,
  onExitSpringFriction: number,
  onExitSpringTension: number,
  children: RenderProp,
  render: RenderProp,
};

type State = {
  rotation: {
    x: number,
    y: number,
  },
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
   *
   * @typedef {object} Props
   *
   * @property {number} [parallaxDegreeLowerBound=-15] - lower rotation degree bound
   * @property {number} [parallaxDegreeUpperBound=15] - upper rotation degree bound
   * @property {number} [slop=0.1] - slop to add to wrapper via prop getter
   * @property {number} [initialX=0] - initial x value in view, between 0 and 1
   * @property {number} [initialY=0] - initial y value in view, between 0 and 1
   * @property {number} [onExitSpringFriction=4] - controls "bounciness"/overshoot of the onExit animation
   * @property {number} [onExitSpringTension=40] - controls speed of onExit animation
   * @property {function} [children] - Is called with the StateAndHelpers of wobbly.
   * @property {function} [render] - Is called with the StateAndHelpers of wobbly.
   * @see {@link https://facebook.github.io/react-vr/docs/view.html#hitslop|hitSlop react-vr docs}
   */
  static defaultProps = {
    parallaxDegreeLowerBound: -15,
    parallaxDegreeUpperBound: 15,
    slop: 0.1,
    initialX: 0.5,
    initialY: 0.5,
    onExitSpringFriction: 4,
    onExitSpringTension: 40,
  };

  /**
   * @type {object}
   * @private
   * @property {Object} rotation - state - The current x,y state
   */
  state = {
    rotation: {
      x: new Animated.Value(this.props.initialX),
      y: new Animated.Value(this.props.initialY),
    },
  };

  parallaxDegreeRange = [
    this.props.parallaxDegreeLowerBound,
    this.props.parallaxDegreeUpperBound,
  ];

  interpolateMoveOffset = (value: Animated.Value) =>
    value.interpolate({
      inputRange: MOVE_INPUT_RANGE,
      outputRange: this.parallaxDegreeRange,
    });

  handleExit = () => {
    Animated.spring(this.state.rotation.x, {
      toValue: this.props.initialX,
      friction: this.props.onExitSpringFriction,
      tension: this.props.onExitSpringTension,
    }).start();
    Animated.spring(this.state.rotation.y, {
      toValue: this.props.initialY,
      friction: this.props.onExitSpringFriction,
      tension: this.props.onExitSpringTension,
    }).start();
  };

  /**
   * The state of wobbly and prop getters are exposed as a parameter to the render prop.
   *
   * @typedef {object} StateAndHelpers
   *
   * @property {function} getMoveWrapperProps - prop getter - returns the props to spread into the element which controls the parallax effect by moving over it.
   * @property {function} getWrapperTransformStyle - prop getter - returns the x,y state in a format the transform style property will take. Spread this into the style.transform array on an "Animated" element to which a parallax effect should be added. NOTE: This element must be "Animated" like "Animated.VrButton".
   * @property {number} x - state - x state value
   * @property {number} y - state - y state value
   */
  getMoveWrapperProps = (
    props: { onMove: () => void, onExit: () => void } = {
      onMove: () => {},
      onExit: () => {},
    }
  ) => ({
    ...props,
    onMove: callAll(
      props.onMove,
      Animated.event([
        {
          nativeEvent: {
            offset: [this.state.rotation.y, this.state.rotation.x],
          },
        },
      ])
    ),
    onExit: callAll(props.onExit, this.handleExit),
    hitSlop: {
      top: this.props.slop,
      bottom: this.props.slop,
      left: this.props.slop,
      right: this.props.slop,
    },
  });
  getWrapperTransformStyle = () => [
    {
      rotateX: this.interpolateMoveOffset(this.state.rotation.x),
    },
    {
      rotateY: this.interpolateMoveOffset(this.state.rotation.y),
    },
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
      getMoveWrapperProps: this.getMoveWrapperProps,
      getWrapperTransformStyle: this.getWrapperTransformStyle,
      // State
      x: this.state.rotation.x,
      y: this.state.rotation.y,
    };
  }

  render() {
    const children = unwrapArray(
      this.props.render || this.props.children || noop
    );
    const element = unwrapArray(children(this.getStateAndHelpers()));
    if (!element) {
      return null;
    }
    return element;
  }
}

export default Wobbly;
