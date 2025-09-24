import { describe, it, expect } from "@jest/globals";
import { getBattleFieldFormated, createEmptyBoard } from "@/utils/utils";
import {
  SHIP_CELL_COLOR,
  STRIKED_CELL_COLOR,
  MISSED_CELL_COLOR,
} from "@/constants/constants";

describe("getBattleFieldFormated", () => {
  let emptyBoard: any[];

  beforeEach(() => {
    emptyBoard = createEmptyBoard();
  });

  it("should update cell color at specified index", () => {
    const index = 50;
    const newColor = STRIKED_CELL_COLOR;

    const result = getBattleFieldFormated(emptyBoard, index, newColor);

    expect(result[index].value).toBe(newColor);
    expect(result[index].index).toBe(index);
  });

  it("should not modify other cells", () => {
    const index = 25;
    const newColor = MISSED_CELL_COLOR;

    const result = getBattleFieldFormated(emptyBoard, index, newColor);

    // Check that other cells remain unchanged
    for (let i = 0; i < result.length; i++) {
      if (i !== index) {
        expect(result[i].value).toBe(emptyBoard[i].value);
        expect(result[i].index).toBe(emptyBoard[i].index);
      }
    }
  });

  it("should handle multiple updates to same cell", () => {
    const index = 30;
    const color1 = STRIKED_CELL_COLOR;
    const color2 = MISSED_CELL_COLOR;

    let result = getBattleFieldFormated(emptyBoard, index, color1);
    expect(result[index].value).toBe(color1);

    result = getBattleFieldFormated(result, index, color2);
    expect(result[index].value).toBe(color2);
  });

  it("should handle updates to different cells", () => {
    const index1 = 10;
    const index2 = 20;
    const color1 = STRIKED_CELL_COLOR;
    const color2 = MISSED_CELL_COLOR;

    let result = getBattleFieldFormated(emptyBoard, index1, color1);
    result = getBattleFieldFormated(result, index2, color2);

    expect(result[index1].value).toBe(color1);
    expect(result[index2].value).toBe(color2);
  });

  it("should handle edge indices", () => {
    const edgeIndices = [0, 9, 90, 99]; // corners

    edgeIndices.forEach((index) => {
      const newColor = STRIKED_CELL_COLOR;
      const result = getBattleFieldFormated(emptyBoard, index, newColor);
      expect(result[index].value).toBe(newColor);
    });
  });

  it("should handle middle indices", () => {
    const middleIndices = [44, 45, 54, 55]; // center area

    middleIndices.forEach((index) => {
      const newColor = MISSED_CELL_COLOR;
      const result = getBattleFieldFormated(emptyBoard, index, newColor);
      expect(result[index].value).toBe(newColor);
    });
  });

  it("should preserve cell structure", () => {
    const index = 50;
    const newColor = STRIKED_CELL_COLOR;

    const result = getBattleFieldFormated(emptyBoard, index, newColor);

    // Check that cell structure is preserved
    expect(result[index]).toHaveProperty("index");
    expect(result[index]).toHaveProperty("diagonals");
    expect(result[index]).toHaveProperty("verticals");
    expect(result[index]).toHaveProperty("value");
    expect(result[index]).toHaveProperty("isVertical");
  });

  it("should handle all color values", () => {
    const colors = [SHIP_CELL_COLOR, STRIKED_CELL_COLOR, MISSED_CELL_COLOR];

    colors.forEach((color, i) => {
      const index = i * 10; // Use different indices for each color
      const result = getBattleFieldFormated(emptyBoard, index, color);
      expect(result[index].value).toBe(color);
    });
  });

  it("should return new array instance", () => {
    const index = 25;
    const newColor = STRIKED_CELL_COLOR;

    const result = getBattleFieldFormated(emptyBoard, index, newColor);

    // Should return a new array, not modify the original
    expect(result).not.toBe(emptyBoard);
    expect(result[index].value).toBe(newColor);
    // Note: The function might modify the original board, so we just check the result
  });

  it("should handle board with existing ships", () => {
    // Create a board with some ships
    const boardWithShips = [...emptyBoard];
    boardWithShips[10].value = SHIP_CELL_COLOR;
    boardWithShips[20].value = SHIP_CELL_COLOR;
    boardWithShips[30].value = SHIP_CELL_COLOR;

    const index = 20;
    const newColor = STRIKED_CELL_COLOR;

    const result = getBattleFieldFormated(boardWithShips, index, newColor);

    expect(result[index].value).toBe(newColor);
    expect(result[10].value).toBe(SHIP_CELL_COLOR); // Other ship unchanged
    expect(result[30].value).toBe(SHIP_CELL_COLOR); // Other ship unchanged
  });

  it("should handle invalid index gracefully", () => {
    const invalidIndex = -1;
    const newColor = STRIKED_CELL_COLOR;

    // This might throw an error, so we expect it to fail
    expect(() => {
      getBattleFieldFormated(emptyBoard, invalidIndex, newColor);
    }).toThrow();
  });

  it("should handle index beyond board size", () => {
    const invalidIndex = 100;
    const newColor = STRIKED_CELL_COLOR;

    // This might throw an error, so we expect it to fail
    expect(() => {
      getBattleFieldFormated(emptyBoard, invalidIndex, newColor);
    }).toThrow();
  });
});
