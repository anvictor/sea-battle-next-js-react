import { describe, it, expect } from "@jest/globals";
import { matrixToCell, cellToMatrix } from "@/utils/utils";
import { BOARD_SIZE } from "@/constants/constants";

describe("Matrix Conversion Functions", () => {
  describe("matrixToCell", () => {
    it("should convert [0,0] to 0", () => {
      expect(matrixToCell(0, 0)).toBe(0);
    });

    it("should convert [0,9] to 9", () => {
      expect(matrixToCell(0, 9)).toBe(9);
    });

    it("should convert [1,0] to 10", () => {
      expect(matrixToCell(1, 0)).toBe(10);
    });

    it("should convert [1,5] to 15", () => {
      expect(matrixToCell(1, 5)).toBe(15);
    });

    it("should convert [9,0] to 90", () => {
      expect(matrixToCell(9, 0)).toBe(90);
    });

    it("should convert [9,9] to 99", () => {
      expect(matrixToCell(9, 9)).toBe(99);
    });

    it("should convert middle positions correctly", () => {
      expect(matrixToCell(5, 5)).toBe(55);
      expect(matrixToCell(3, 7)).toBe(37);
      expect(matrixToCell(7, 3)).toBe(73);
    });

    it("should handle edge cases", () => {
      expect(matrixToCell(0, 0)).toBe(0);
      expect(matrixToCell(BOARD_SIZE - 1, BOARD_SIZE - 1)).toBe(
        BOARD_SIZE * BOARD_SIZE - 1
      );
    });
  });

  describe("cellToMatrix", () => {
    it("should convert 0 to [0,0]", () => {
      const result = cellToMatrix(0);
      expect(result.rowIndex).toBe(0);
      expect(result.cellIndex).toBe(0);
    });

    it("should convert 9 to [0,9]", () => {
      const result = cellToMatrix(9);
      expect(result.rowIndex).toBe(0);
      expect(result.cellIndex).toBe(9);
    });

    it("should convert 10 to [1,0]", () => {
      const result = cellToMatrix(10);
      expect(result.rowIndex).toBe(1);
      expect(result.cellIndex).toBe(0);
    });

    it("should convert 15 to [1,5]", () => {
      const result = cellToMatrix(15);
      expect(result.rowIndex).toBe(1);
      expect(result.cellIndex).toBe(5);
    });

    it("should convert 90 to [9,0]", () => {
      const result = cellToMatrix(90);
      expect(result.rowIndex).toBe(9);
      expect(result.cellIndex).toBe(0);
    });

    it("should convert 99 to [9,9]", () => {
      const result = cellToMatrix(99);
      expect(result.rowIndex).toBe(9);
      expect(result.cellIndex).toBe(9);
    });

    it("should convert middle positions correctly", () => {
      const result1 = cellToMatrix(55);
      expect(result1.rowIndex).toBe(5);
      expect(result1.cellIndex).toBe(5);

      const result2 = cellToMatrix(37);
      expect(result2.rowIndex).toBe(3);
      expect(result2.cellIndex).toBe(7);

      const result3 = cellToMatrix(73);
      expect(result3.rowIndex).toBe(7);
      expect(result3.cellIndex).toBe(3);
    });

    it("should handle edge cases", () => {
      const result1 = cellToMatrix(0);
      expect(result1.rowIndex).toBe(0);
      expect(result1.cellIndex).toBe(0);

      const result2 = cellToMatrix(BOARD_SIZE * BOARD_SIZE - 1);
      expect(result2.rowIndex).toBe(BOARD_SIZE - 1);
      expect(result2.cellIndex).toBe(BOARD_SIZE - 1);
    });
  });

  describe("Round-trip conversion", () => {
    it("should convert matrix to cell and back correctly", () => {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cellIndex = matrixToCell(row, col);
          const matrix = cellToMatrix(cellIndex);
          expect(matrix.rowIndex).toBe(row);
          expect(matrix.cellIndex).toBe(col);
        }
      }
    });

    it("should convert cell to matrix and back correctly", () => {
      for (
        let cellIndex = 0;
        cellIndex < BOARD_SIZE * BOARD_SIZE;
        cellIndex++
      ) {
        const matrix = cellToMatrix(cellIndex);
        const backToCell = matrixToCell(matrix.rowIndex, matrix.cellIndex);
        expect(backToCell).toBe(cellIndex);
      }
    });
  });
});

