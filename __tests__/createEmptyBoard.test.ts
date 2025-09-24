import { describe, it, expect } from "@jest/globals";
import { createEmptyBoard } from "@/utils/utils";
import { BOARD_SIZE } from "@/constants/constants";

describe("createEmptyBoard", () => {
  const board = createEmptyBoard();

  it("creates a board with correct size", () => {
    expect(board.length).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it("initializes each cell with defaults", () => {
    board.forEach((cell, index) => {
      expect(cell.index).toBe(index);
      expect(cell.value).toBe(0);
      expect(cell.isVertical).toBeNull();
      expect(Array.isArray(cell.diagonals)).toBe(true);
      expect(Array.isArray(cell.verticals)).toBe(true);
    });
  });

  it("stores only in-bounds indices in neighbors", () => {
    const maxIndex = BOARD_SIZE * BOARD_SIZE - 1;
    board.forEach((cell) => {
      for (const idx of cell.diagonals) {
        expect(typeof idx).toBe("number");
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThanOrEqual(maxIndex);
      }
      for (const idx of cell.verticals) {
        expect(typeof idx).toBe("number");
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThanOrEqual(maxIndex);
      }
    });
  });
});

