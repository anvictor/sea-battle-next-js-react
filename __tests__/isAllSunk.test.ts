import { describe, it, expect } from "@jest/globals";
import { isAllSunk } from "@/utils/utils";
import {
  SHIPS_TOTAL_CELLS,
  STRIKED_CELL_COLOR,
  SHIP_CELL_COLOR,
} from "@/constants/constants";
import { CellValue } from "@/types/types";

describe("isAllSunk", () => {
  const createTestBoard = (strikedCount: number): CellValue[] => {
    const board: CellValue[] = [];

    // Add striked cells
    for (let i = 0; i < strikedCount; i++) {
      board.push({
        index: i,
        diagonals: [],
        verticals: [],
        value: STRIKED_CELL_COLOR,
        isVertical: null,
      });
    }

    // Add remaining cells as ship cells
    for (let i = strikedCount; i < SHIPS_TOTAL_CELLS; i++) {
      board.push({
        index: i,
        diagonals: [],
        verticals: [],
        value: SHIP_CELL_COLOR,
        isVertical: null,
      });
    }

    // Add empty cells to complete the board
    for (let i = SHIPS_TOTAL_CELLS; i < 100; i++) {
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

  it("should return true when all ships are sunk", () => {
    const board = createTestBoard(SHIPS_TOTAL_CELLS);
    expect(isAllSunk(SHIPS_TOTAL_CELLS, board)).toBe(true);
  });

  it("should return false when no ships are sunk", () => {
    const board = createTestBoard(0);
    expect(isAllSunk(SHIPS_TOTAL_CELLS, board)).toBe(false);
  });

  it("should return false when some ships are sunk", () => {
    const board = createTestBoard(10);
    expect(isAllSunk(SHIPS_TOTAL_CELLS, board)).toBe(false);
  });

  it("should return false when almost all ships are sunk", () => {
    const board = createTestBoard(SHIPS_TOTAL_CELLS - 1);
    expect(isAllSunk(SHIPS_TOTAL_CELLS, board)).toBe(false);
  });

  it("should handle empty board", () => {
    const board: CellValue[] = [];
    expect(isAllSunk(SHIPS_TOTAL_CELLS, board)).toBe(false);
  });

  it("should handle board with only empty cells", () => {});
});

