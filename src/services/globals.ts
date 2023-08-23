export var MAX_SURROUNDING_NODES = 5; // TODO: User input for sample size

export const MAX_REFRESH_NODES = 50;

export const setGlobalSurroundingNodes = (newMax: number) => {
  MAX_SURROUNDING_NODES = newMax;
}