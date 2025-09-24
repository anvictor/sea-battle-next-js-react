import {
  isInBounds,
  canPlaceShip,
  removeInvalidPerpendiculars,
} from "@/utils/utils";
// import { Directions, MatrixPosition } from "@/types/types";
import { board } from "../test-data/testConstants";
import { describe, it, expect } from "@jest/globals";

/*
    0 1 2 3 4 5 6 7 8 9
  0 - - - - - - - - - 1
  1 - - - - - - - - - -
  2 - 1 - - 2 1 2 - - -
  3 - 1 - - - - - - - -
  4 - 1 - 1 - - - - - 1
  5 - - - 1 - - - - - 1
  6 - 2 - - - 1 - - - -
  7 - 2 - - - - - - - -
  8 - 2 - - - - - 1 - 1
  9 - 2 - 1 1 - - - - -
  */

describe("isInBounds", () => {
  it("should return false for negative", () => {
    expect(isInBounds(-5, -5)).toBe(false);
    expect(isInBounds(-5, 5)).toBe(false);
    expect(isInBounds(5, -5)).toBe(false);
  });

  it("should return true for inBounds", () => {
    expect(isInBounds(0, 0)).toBe(true);
    expect(isInBounds(5, 5)).toBe(true);
    expect(isInBounds(9, 9)).toBe(true);
  });
  it("should return false for overflow", () => {
    expect(isInBounds(9, 10)).toBe(false);
    expect(isInBounds(10, 9)).toBe(false);
  });
});

const length = 1;
describe("canPlaceShip", () => {
  it("no fit bottom right should return false", () => {
    const startIndex = 97;
    const isVertical = false;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(false);
  });
  it("no fit bottom down should return false", () => {
    const startIndex = 79;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(false);
  });
  it("out of range +++ should return false", () => {
    const startIndex = 179;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(false);
  });
  it("out of range --- should return false", () => {
    const startIndex = -79;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(false);
  });
  it("can place near to ship 65 --- should return true", () => {
    const startIndex = 67;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(true);
  });
  it("to close to ship 65 --- should return false", () => {
    const startIndex = 56;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(false);
  });
  it("to close to ship 65 --- should return false", () => {
    const startIndex = 66;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(false);
  });

  it("index 0 vertical should return true", () => {
    const startIndex = 0;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(true);
  });
  it("index 0 horizontal should return true", () => {
    const startIndex = 0;
    const isVertical = false;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(true);
  });
  it("index 1 vertical should return true", () => {
    const startIndex = 1;
    const isVertical = true;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(true);
  });
  it("index 1 horizontal should return true", () => {
    const startIndex = 1;
    const isVertical = false;
    expect(canPlaceShip(board, startIndex, length, isVertical)).toBe(true);
  });
});

describe("checkVerticalSunk", () => {});

describe("checkHorizontalSunk", () => {});

describe("clearWrongPerpendicular", () => {
  it("check down", () => {
    expect(
      removeInvalidPerpendiculars(31, {
        down: [31, 41, 51],
        left: [20, 19, 18],
        right: [22, 23, 24],
        up: [11, 1],
      })
    ).toStrictEqual({
      down: [31, 41, 51],
      left: [],
      right: [],
      up: [11, 1],
    });
  });

  it("check up", () => {
    expect(
      removeInvalidPerpendiculars(11, {
        down: [31, 41, 51],
        left: [20, 19, 18],
        right: [22, 23, 24],
        up: [11, 1],
      })
    ).toStrictEqual({
      down: [31, 41, 51],
      left: [],
      right: [],
      up: [11, 1],
    });
  });

  it("check left", () => {
    expect(
      removeInvalidPerpendiculars(20, {
        down: [31, 41, 51],
        left: [20, 19, 18],
        right: [22, 23, 24],
        up: [11, 1],
      })
    ).toStrictEqual({
      down: [],
      left: [20, 19, 18],
      right: [22, 23, 24],
      up: [],
    });
  });
  it("check right", () => {
    expect(
      removeInvalidPerpendiculars(22, {
        down: [31, 41, 51],
        left: [20, 19, 18],
        right: [22, 23, 24],
        up: [11, 1],
      })
    ).toStrictEqual({
      down: [],
      left: [20, 19, 18],
      right: [22, 23, 24],
      up: [],
    });
  });
});
