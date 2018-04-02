/* @flow */

export type StateAndHelpers = {
  // Prop Getters
  getMoveTargetProps: ({ onMove: () => void, onExit: () => void }) => {
    [string]: any,
    onMove: () => void,
    onExit: () => void,
    hitSlop: { top: number, bottom: number, left: number, right: number },
  },
  getWobblyTransformStyle: () => [
    {
      rotateX: number,
    },
    {
      rotateY: number,
    },
  ],
  // State
  x: number,
  y: number,
};

export type RenderProp = StateAndHelpers => {};

export type SytheticMoveEvent = {
  persist: () => {},
  nativeEvent: {
    offset: [number, number],
  },
};
