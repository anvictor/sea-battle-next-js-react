import { describe, it, expect } from "@jest/globals";
import { getNewCellColorAsStrikeResult } from "@/utils/utils";
import {
  SHIP_CELL_COLOR,
  STRIKED_CELL_COLOR,
  MISSED_CELL_COLOR,
} from "@/constants/constants";

describe("getNewCellColorAsStrikeResult", () => {
  it("should return STRIKED_CELL_COLOR when hitting a ship", () => {
    const result = getNewCellColorAsStrikeResult(SHIP_CELL_COLOR);
    expect(result).toBe(STRIKED_CELL_COLOR);
  });

  it("should return MISSED_CELL_COLOR when missing (empty cell)", () => {
    const result = getNewCellColorAsStrikeResult(0);
    expect(result).toBe(MISSED_CELL_COLOR);
  });

  it("should return MISSED_CELL_COLOR for any non-ship cell", () => {
    const result = getNewCellColorAsStrikeResult(MISSED_CELL_COLOR);
    expect(result).toBe(MISSED_CELL_COLOR);
  });

  it("should return MISSED_CELL_COLOR for already striked cell", () => {
    const result = getNewCellColorAsStrikeResult(STRIKED_CELL_COLOR);
    expect(result).toBe(MISSED_CELL_COLOR);
  });

  it("should handle all possible color values", () => {
    // Test all color values from 0 to 7
    for (let color = 0; color <= 7; color++) {
      const result = getNewCellColorAsStrikeResult(color as any);
      if (color === SHIP_CELL_COLOR) {
        expect(result).toBe(STRIKED_CELL_COLOR);
      } else {
        expect(result).toBe(MISSED_CELL_COLOR);
      }
    }
  });
});

