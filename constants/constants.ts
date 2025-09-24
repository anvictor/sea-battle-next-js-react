// constants.ts
import { colors, Directions } from "@/types/types";
const BOARD_SIZE = 10;
// cells colors
const UNDEFINED_CELL_COLOR: colors = 0;
const SHIP_CELL_COLOR: colors = 1;
const STRIKED_CELL_COLOR: colors = 2;
const MISSED_CELL_COLOR: colors = 3;
const CLOSED_CELL_COLOR: colors = 4;
const ATTENTION_CELL_COLOR: colors = 6; // green
const BLINK_CELL_COLOR_PINK: colors = 7; // pink

const NEIGHBOUR_SIDES = 4;

// Ship configurations: // { length: 1, count: 1 },
const SHIP_MAX_LENGTH = 4;
const SHIPS = Array.from({ length: SHIP_MAX_LENGTH }, (_, i) => ({
  length: SHIP_MAX_LENGTH - i,
  count: i + 1,
}));

const SHIPS_TOTAL_CELLS = SHIPS.reduce(
  (total, ship) => total + ship.length * ship.count,
  0
);

const DIAGONAL_CELLS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const NEAR_CELLS = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];
const STEP_UP = 0;
const STEP_LEFT = 1;
const STEP_RIGHT = 2;
const STEP_DOWN = 3;

const REMOVE_INVALID_DIRECTION = "REMOVE_INVALID_DIRECTION";
const REMOVE_INVALID_PERPENDICULARS = "REMOVE_INVALID_PERPENDICULARS";
const INITIAL_REST_OF_HITS: Directions = {
  up: [],
  left: [],
  right: [],
  down: [],
};
const NO_LAST_SUCCESS_HIT = null as unknown as number;

export {
  BOARD_SIZE,
  UNDEFINED_CELL_COLOR,
  SHIP_CELL_COLOR,
  STRIKED_CELL_COLOR,
  MISSED_CELL_COLOR,
  CLOSED_CELL_COLOR,
  ATTENTION_CELL_COLOR,
  NEIGHBOUR_SIDES,
  SHIP_MAX_LENGTH,
  SHIPS,
  DIAGONAL_CELLS,
  NEAR_CELLS,
  STEP_UP,
  STEP_LEFT,
  STEP_RIGHT,
  STEP_DOWN,
  REMOVE_INVALID_DIRECTION,
  REMOVE_INVALID_PERPENDICULARS,
  SHIPS_TOTAL_CELLS,
  INITIAL_REST_OF_HITS,
  NO_LAST_SUCCESS_HIT,
  BLINK_CELL_COLOR_PINK,
};
