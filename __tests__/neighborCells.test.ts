import { describe, it, expect } from "@jest/globals";
import {
  getNeighborCells,
  getDiagonalCells,
  getNearCells,
} from "@/utils/utils";
import { BOARD_SIZE } from "@/constants/constants";

describe("Neighbor Cells Functions", () => {
  describe("getNeighborCells", () => {
    it("should return correct neighbors for center cell", () => {
      const centerIndex = 55; // [5,5]
      const offsets = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]; // up, left, right, down
      const neighbors = getNeighborCells(centerIndex, offsets);

      expect(neighbors).toContain(45); // up: [4,5]
      expect(neighbors).toContain(54); // left: [5,4]
      expect(neighbors).toContain(56); // right: [5,6]
      expect(neighbors).toContain(65); // down: [6,5]
      expect(neighbors).toHaveLength(4);
    });

    it("should return correct neighbors for corner cell", () => {
      const cornerIndex = 0; // [0,0]
      const offsets = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ];
      const neighbors = getNeighborCells(cornerIndex, offsets);

      expect(neighbors).toContain(1); // right: [0,1]
      expect(neighbors).toContain(10); // down: [1,0]
      expect(neighbors).toHaveLength(2);
      expect(neighbors).not.toContain(-1); // up: out of bounds
      expect(neighbors).not.toContain(-10); // left: out of bounds
    });

    it("should return correct neighbors for edge cell", () => {
      const edgeIndex = 5; // [0,5] - top edge
      const offsets = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ];
      const neighbors = getNeighborCells(edgeIndex, offsets);

      expect(neighbors).toContain(4); // left: [0,4]
      expect(neighbors).toContain(6); // right: [0,6]
      expect(neighbors).toContain(15); // down: [1,5]
      expect(neighbors).toHaveLength(3);
      expect(neighbors).not.toContain(-5); // up: out of bounds
    });

    it("should return correct neighbors for bottom-right corner", () => {
      const cornerIndex = 99; // [9,9]
      const offsets = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ];
      const neighbors = getNeighborCells(cornerIndex, offsets);

      expect(neighbors).toContain(89); // up: [8,9]
      expect(neighbors).toContain(98); // left: [9,8]
      expect(neighbors).toHaveLength(2);
      expect(neighbors).not.toContain(109); // right: out of bounds
      expect(neighbors).not.toContain(109); // down: out of bounds
    });

    it("should handle empty offsets array", () => {
      const neighbors = getNeighborCells(50, []);
      expect(neighbors).toHaveLength(0);
    });

    it("should handle offsets that go out of bounds", () => {
      const centerIndex = 0;
      const offsets = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      const neighbors = getNeighborCells(centerIndex, offsets);

      // Only valid neighbors should be included
      expect(neighbors).toContain(1); // [0,1]
      expect(neighbors).toContain(10); // [1,0]
      expect(neighbors).toContain(11); // [1,1]
      expect(neighbors).toHaveLength(3);
    });
  });

  describe("getDiagonalCells", () => {
    it("should return correct diagonal neighbors for center cell", () => {
      const centerIndex = 55; // [5,5]
      const diagonals = getDiagonalCells(centerIndex);

      expect(diagonals).toContain(44); // up-left: [4,4]
      expect(diagonals).toContain(46); // up-right: [4,6]
      expect(diagonals).toContain(64); // down-left: [6,4]
      expect(diagonals).toContain(66); // down-right: [6,6]
      expect(diagonals).toHaveLength(4);
    });

    it("should return correct diagonal neighbors for corner cell", () => {
      const cornerIndex = 0; // [0,0]
      const diagonals = getDiagonalCells(cornerIndex);

      expect(diagonals).toContain(11); // down-right: [1,1]
      expect(diagonals).toHaveLength(1);
      expect(diagonals).not.toContain(-11); // up-left: out of bounds
    });

    it("should return correct diagonal neighbors for edge cell", () => {
      const edgeIndex = 5; // [0,5]
      const diagonals = getDiagonalCells(edgeIndex);

      expect(diagonals).toContain(14); // down-left: [1,4]
      expect(diagonals).toContain(16); // down-right: [1,6]
      expect(diagonals).toHaveLength(2);
    });
  });

  describe("getNearCells", () => {
    it("should return correct near neighbors for center cell", () => {
      const centerIndex = 55; // [5,5]
      const nears = getNearCells(centerIndex);

      expect(nears).toContain(45); // up: [4,5]
      expect(nears).toContain(54); // left: [5,4]
      expect(nears).toContain(56); // right: [5,6]
      expect(nears).toContain(65); // down: [6,5]
      expect(nears).toHaveLength(4);
    });

    it("should return correct near neighbors for corner cell", () => {
      const cornerIndex = 0; // [0,0]
      const nears = getNearCells(cornerIndex);

      expect(nears).toContain(1); // right: [0,1]
      expect(nears).toContain(10); // down: [1,0]
      expect(nears).toHaveLength(2);
    });

    it("should return correct near neighbors for edge cell", () => {
      const edgeIndex = 5; // [0,5]
      const nears = getNearCells(edgeIndex);

      expect(nears).toContain(4); // left: [0,4]
      expect(nears).toContain(6); // right: [0,6]
      expect(nears).toContain(15); // down: [1,5]
      expect(nears).toHaveLength(3);
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle all corner positions", () => {
      const corners = [0, 9, 90, 99]; // [0,0], [0,9], [9,0], [9,9]

      corners.forEach((corner) => {
        const diagonals = getDiagonalCells(corner);
        const nears = getNearCells(corner);

        // Corners should have fewer neighbors
        expect(diagonals.length + nears.length).toBeLessThanOrEqual(6);
      });
    });

    it("should handle all edge positions", () => {
      // Test top edge
      for (let col = 1; col < BOARD_SIZE - 1; col++) {
        const index = col; // [0, col]
        const diagonals = getDiagonalCells(index);
        const nears = getNearCells(index);
        expect(diagonals.length + nears.length).toBeLessThanOrEqual(7);
      }
    });

    it("should return consistent results for same input", () => {
      const index = 50;
      const result1 = getNeighborCells(index, [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]);
      const result2 = getNeighborCells(index, [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
      ]);
      expect(result1).toEqual(result2);
    });
  });
});

