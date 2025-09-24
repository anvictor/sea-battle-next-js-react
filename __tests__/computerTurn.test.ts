import { describe, it, expect, jest } from "@jest/globals";
import { computerTurn, createEmptyBoard } from "@/utils/utils";
import {
  SHIP_CELL_COLOR,
  STRIKED_CELL_COLOR,
  MISSED_CELL_COLOR,
} from "@/constants/constants";
import { CellValue, Directions } from "@/types/types";

describe("computerTurn", () => {
  let mockUserBoard: CellValue[];
  let mockRestBoardIndices: number[];
  let mockRestHits: Directions;
  let mockSetRestHits: jest.Mock;
  let mockSetLastSuccessHit: jest.Mock;
  let mockSetLastSuccessDirection: jest.Mock;
  let mockSetRestBoardIndices: jest.Mock;

  beforeEach(() => {
    mockUserBoard = createEmptyBoard();
    mockRestBoardIndices = Array.from({ length: 100 }, (_, i) => i);
    mockRestHits = {
      up: [],
      left: [],
      right: [],
      down: [],
    };
    mockSetRestHits = jest.fn();
    mockSetLastSuccessHit = jest.fn();
    mockSetLastSuccessDirection = jest.fn();
    mockSetRestBoardIndices = jest.fn();
  });

  it("should return valid result structure", async () => {
    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(result).toHaveProperty("nextAttackedIndex");
    expect(result).toHaveProperty("colorBeforeStrike");
    expect(result).toHaveProperty("colorAfterStrike");
    expect(typeof result.nextAttackedIndex).toBe("number");
    expect(typeof result.colorBeforeStrike).toBe("number");
    expect(typeof result.colorAfterStrike).toBe("number");
  });

  it("should attack valid index when no previous hits", async () => {
    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(result.nextAttackedIndex).toBeGreaterThanOrEqual(0);
    expect(result.nextAttackedIndex).toBeLessThan(100);
  });

  it("should handle board with ships", async () => {
    // Add some ships to the board
    mockUserBoard[10].value = SHIP_CELL_COLOR;
    mockUserBoard[20].value = SHIP_CELL_COLOR;
    mockUserBoard[30].value = SHIP_CELL_COLOR;

    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(result.nextAttackedIndex).toBeGreaterThanOrEqual(0);
    expect(result.nextAttackedIndex).toBeLessThan(100);
  });

  it("should handle board with already hit cells", async () => {
    // Mark some cells as already hit
    mockUserBoard[10].value = STRIKED_CELL_COLOR;
    mockUserBoard[20].value = MISSED_CELL_COLOR;
    mockUserBoard[30].value = STRIKED_CELL_COLOR;

    // Remove these indices from available targets
    mockRestBoardIndices = mockRestBoardIndices.filter(
      (i) => ![10, 20, 30].includes(i)
    );

    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(result.nextAttackedIndex).toBeGreaterThanOrEqual(0);
    expect(result.nextAttackedIndex).toBeLessThan(100);
    expect([10, 20, 30]).not.toContain(result.nextAttackedIndex);
  });

  it("should handle targeted attack when previous hit exists", async () => {
    const mockRestHitsWithTargets = {
      up: [5],
      left: [],
      right: [15],
      down: [25],
    };

    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHitsWithTargets,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "right",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(result.nextAttackedIndex).toBeGreaterThanOrEqual(0);
    expect(result.nextAttackedIndex).toBeLessThan(100);
  });

  it("should call setter functions", async () => {
    await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(mockSetRestBoardIndices).toHaveBeenCalled();
    expect(mockSetRestHits).toHaveBeenCalled();
  });

  it("should handle empty restBoardIndices", async () => {
    const emptyRestBoardIndices: number[] = [];

    // This should throw an error when trying to access undefined cell
    await expect(
      computerTurn({
        userBoard: mockUserBoard,
        restBoardIndices: emptyRestBoardIndices,
        setRestBoardIndices: mockSetRestBoardIndices,
        restHits: mockRestHits,
        setRestHits: mockSetRestHits,
        setLastSuccessHit: mockSetLastSuccessHit,
        lastSuccessDirection: "",
        setLastSuccessDirection: mockSetLastSuccessDirection,
      })
    ).rejects.toThrow();
  });

  it("should handle board with mixed cell types", async () => {
    // Create a board with various cell types
    mockUserBoard[0].value = SHIP_CELL_COLOR;
    mockUserBoard[1].value = STRIKED_CELL_COLOR;
    mockUserBoard[2].value = MISSED_CELL_COLOR;
    mockUserBoard[3].value = 0;

    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    expect(result.nextAttackedIndex).toBeGreaterThanOrEqual(0);
    expect(result.nextAttackedIndex).toBeLessThan(100);
  });

  it("should return consistent color values", async () => {
    const result = await computerTurn({
      userBoard: mockUserBoard,
      restBoardIndices: mockRestBoardIndices,
      setRestBoardIndices: mockSetRestBoardIndices,
      restHits: mockRestHits,
      setRestHits: mockSetRestHits,
      setLastSuccessHit: mockSetLastSuccessHit,
      lastSuccessDirection: "",
      setLastSuccessDirection: mockSetLastSuccessDirection,
    });

    // Color values should be valid
    expect([SHIP_CELL_COLOR, STRIKED_CELL_COLOR, MISSED_CELL_COLOR]).toContain(
      result.colorBeforeStrike
    );
    expect([STRIKED_CELL_COLOR, MISSED_CELL_COLOR]).toContain(
      result.colorAfterStrike
    );
  });
});
