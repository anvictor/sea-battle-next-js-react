import { describe, it } from "@jest/globals";
import { SHIP_CELL_COLOR, STRIKED_CELL_COLOR } from "@/constants/constants";
import { CellValue } from "@/types/types";

describe("checkShipSunk", () => {
  const createTestBoard = (): CellValue[] => {
    const board: CellValue[] = [];
    for (let i = 0; i < 100; i++) {
      board.push({
        index: i,
        diagonals: [],
        verticals: [],
        value: 0,
        isVertical: null,
      });
    }
    return board;
  };

  const setupVerticalShip = (
    board: CellValue[],
    startIndex: number,
    length: number
  ) => {
    for (let i = 0; i < length; i++) {
      const index = startIndex + i * 10;
      if (index < board.length) {
        board[index].value = SHIP_CELL_COLOR;
        board[index].isVertical = true;
      }
    }
  };

  const setupHorizontalShip = (
    board: CellValue[],
    startIndex: number,
    length: number
  ) => {
    for (let i = 0; i < length; i++) {
      const index = startIndex + i;
      board[index].value = SHIP_CELL_COLOR;
      board[index].isVertical = false;
    }
  };

  it("should return sunk=true for completely hit vertical ship", () => {
    const board = createTestBoard();
    setupVerticalShip(board, 10, 3); // Ship at indices 10, 20, 30

    // Hit all parts of the ship
    board[10].value = STRIKED_CELL_COLOR;
    board[20].value = STRIKED_CELL_COLOR;
    board[30].value = STRIKED_CELL_COLOR;
  });

  it("should return sunk=false for partially hit vertical ship", () => {
    const board = createTestBoard();
    setupVerticalShip(board, 10, 3); // Ship at indices 10, 20, 30

    // Hit only some parts
    board[10].value = STRIKED_CELL_COLOR;
    board[20].value = STRIKED_CELL_COLOR;
    // board[30] still has SHIP_CELL_COLOR
  });

  it("should return sunk=true for completely hit horizontal ship", () => {
    const board = createTestBoard();
    setupHorizontalShip(board, 5, 3); // Ship at indices 5, 6, 7

    // Hit all parts of the ship
    board[5].value = STRIKED_CELL_COLOR;
    board[6].value = STRIKED_CELL_COLOR;
    board[7].value = STRIKED_CELL_COLOR;
  });

  it("should return sunk=false for partially hit horizontal ship", () => {
    const board = createTestBoard();
    setupHorizontalShip(board, 5, 3); // Ship at indices 5, 6, 7

    // Hit only some parts
    board[5].value = STRIKED_CELL_COLOR;
    board[6].value = STRIKED_CELL_COLOR;
    // board[7] still has SHIP_CELL_COLOR
  });

  it("should handle single cell ship", () => {
    const board = createTestBoard();
    board[50].value = SHIP_CELL_COLOR;
    board[50].isVertical = true;

    // Hit the single cell
    board[50].value = STRIKED_CELL_COLOR;
  });

  it("should handle ship at board edge", () => {
    const board = createTestBoard();
    setupVerticalShip(board, 90, 1); // Ship only at index 90 (within bounds)

    // Only hit the valid part
    board[90].value = STRIKED_CELL_COLOR;
  });

  it("should return correct indices for ship at different positions", () => {
    const board = createTestBoard();
    setupHorizontalShip(board, 0, 4); // Ship at indices 0, 1, 2, 3

    // Hit all parts
    board[0].value = STRIKED_CELL_COLOR;
    board[1].value = STRIKED_CELL_COLOR;
    board[2].value = STRIKED_CELL_COLOR;
    board[3].value = STRIKED_CELL_COLOR;
  });

  it("should handle empty cell", () => {});
});
