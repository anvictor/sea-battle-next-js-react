// utils.ts

import {
  CellValue,
  Directions,
  ExecuteRandomAttackParams,
  ExecuteTargetedAttackParams,
  MatrixPosition,
  StepParams,
  StrikeResult,
  colors,
} from "@/types/types";

import {
  BOARD_SIZE,
  UNDEFINED_CELL_COLOR,
  SHIP_CELL_COLOR,
  STRIKED_CELL_COLOR,
  MISSED_CELL_COLOR,
  CLOSED_CELL_COLOR,
  SHIP_MAX_LENGTH,
  SHIPS,
  DIAGONAL_CELLS,
  NEAR_CELLS,
  STEP_UP,
  STEP_LEFT,
  STEP_RIGHT,
  STEP_DOWN,
  INITIAL_REST_OF_HITS,
  ATTENTION_CELL_COLOR,
} from "@/constants/constants";

// Converts [row, col] → cell index
const matrixToCell = (row: number, col: number): number =>
  row * BOARD_SIZE + col;

// Converts cell index → [row, col]
const cellToMatrix = (index: number): MatrixPosition => ({
  rowIndex: Math.floor(index / BOARD_SIZE),
  cellIndex: index % BOARD_SIZE,
});

// Validates matrix position
const isInBounds = (row: number, col: number): boolean =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

const filterValidClosureCells = (
  edgeIndexes: number[],
  lastStrikeIndex: number,
  isVertical: boolean
): number[] => {
  const strikePos = cellToMatrix(lastStrikeIndex);

  return edgeIndexes.filter((index) => {
    const { rowIndex, cellIndex } = cellToMatrix(index);

    // Перевірка: чи в межах матриці
    if (!isInBounds(rowIndex, cellIndex)) return false;

    // Перевірка: чи на тій самій лінії, що й останній постріл
    return isVertical
      ? cellIndex === strikePos.cellIndex // вертикально: одна колонка
      : rowIndex === strikePos.rowIndex; // горизонтально: один рядок
  });
};

// Gets diagonals or near-cells based on index and offset set
// used!
const getNeighborCells = (index: number, offsets: number[][]): number[] => {
  const { rowIndex, cellIndex } = cellToMatrix(index);
  const neighbors: number[] = [];

  for (const [dy, dx] of offsets) {
    const newRow = rowIndex + dy;
    const newCol = cellIndex + dx;
    if (isInBounds(newRow, newCol)) {
      neighbors.push(matrixToCell(newRow, newCol));
    }
  }

  return neighbors;
};

// used!
const getDiagonalCells = (index: number): (number | null)[] =>
  getNeighborCells(index, DIAGONAL_CELLS);
// used!
const getNearCells = (index: number): (number | null)[] =>
  getNeighborCells(index, NEAR_CELLS);

// Creates initial empty board with indexed neighbors
const createEmptyBoard = (): CellValue[] => {
  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => ({
    index: i,
    diagonals: getDiagonalCells(i),
    verticals: getNearCells(i),
    value: UNDEFINED_CELL_COLOR,
    isVertical: null,
  }));
};

// Checks if a ship of given length and orientation can be placed at startIndex
// used!
const canPlaceShip = (
  board: CellValue[],
  startIndex: number,
  length: number,
  isVertical: boolean
): boolean => {
  if (startIndex < 0 || startIndex >= board.length) return false;
  if (board[startIndex].value === SHIP_CELL_COLOR) return false;

  const step = isVertical ? STEP_DOWN : STEP_RIGHT;
  let currentIndex = startIndex;

  for (let i = 0; i < length; i++) {
    const cell = board[currentIndex];
    if (!cell) return false;

    const hasAdjacentShip = [...cell.verticals, ...cell.diagonals].some(
      (idx) => idx !== null && board[idx]?.value === SHIP_CELL_COLOR
    );

    if (hasAdjacentShip) return false;

    if (i < length - 1) {
      const nextIndex = cell.verticals[step];

      // 🔒 Додаткова перевірка на злам корабля
      if (
        nextIndex === null ||
        (isVertical
          ? nextIndex % BOARD_SIZE !== currentIndex % BOARD_SIZE // вертикаль зламана
          : Math.floor(nextIndex / BOARD_SIZE) !==
            Math.floor(currentIndex / BOARD_SIZE)) // горизонталь зламана
      ) {
        return false;
      }

      currentIndex = nextIndex;
    }
  }

  return true;
};

// Places a ship at startIndex in given orientation and length
// used!
const placeShip = (
  board: CellValue[],
  startIndex: number,
  length: number,
  isVertical: boolean
): void => {
  const step = isVertical ? STEP_DOWN : STEP_RIGHT;
  let currentIndex = startIndex;

  for (let i = 0; i < length; i++) {
    if (board[currentIndex]) {
      board[currentIndex].value = SHIP_CELL_COLOR;
      board[currentIndex].isVertical = isVertical;
      currentIndex = board[currentIndex].verticals[step] as number;
    }
  }
};

// used!
const fillField = (): CellValue[] => {
  const board = createEmptyBoard();

  SHIPS.forEach(({ length, count }) => {
    let placed = 0;
    while (placed < count) {
      const isVertical = Math.random() < 0.5;
      const startIndex = Math.floor(Math.random() * board.length);

      if (canPlaceShip(board, startIndex, length, isVertical)) {
        placeShip(board, startIndex, length, isVertical);
        placed++;
      }
    }
  });
  return board;
};

// Prepares board visuals after a successful strike
const closeCellsAround = (
  board: CellValue[],
  indices: (number | null)[]
): CellValue[] => {
  const updatedBoard = [...board];

  indices.forEach((idx) => {
    if (
      idx !== null &&
      idx >= 0 &&
      idx < updatedBoard.length &&
      updatedBoard[idx] &&
      updatedBoard[idx].value !== MISSED_CELL_COLOR &&
      updatedBoard[idx].value !== STRIKED_CELL_COLOR &&
      updatedBoard[idx].value !== CLOSED_CELL_COLOR
    ) {
      updatedBoard[idx].value = CLOSED_CELL_COLOR;
    }
  });
  return updatedBoard;
};

const getBattleFieldFormated = (
  board: CellValue[],
  index: number,
  newColor: colors
): CellValue[] => {
  let updatedBoard = [...board];
  updatedBoard[index].value = newColor;

  if (newColor === STRIKED_CELL_COLOR) {
    updatedBoard = closeCellsAround(
      updatedBoard,
      updatedBoard[index].diagonals
    );
  }

  return updatedBoard;
};

// Determines directions around a successful hit to continue targeting
const getPossibleHits = (
  lastSuccessHit: number,
  board: CellValue[]
): Directions => {
  const directions: Directions = JSON.parse(
    JSON.stringify(INITIAL_REST_OF_HITS)
  );
  const steps = {
    up: STEP_UP,
    left: STEP_LEFT,
    right: STEP_RIGHT,
    down: STEP_DOWN,
  };

  const isValidCell = (index: number | null): boolean =>
    index !== null &&
    index >= 0 &&
    index < board.length &&
    ![MISSED_CELL_COLOR, CLOSED_CELL_COLOR, STRIKED_CELL_COLOR].includes(
      board[index].value
    );

  (Object.keys(directions) as (keyof Directions)[]).forEach((dir) => {
    let currentIndex = lastSuccessHit;
    for (let i = 0; i < SHIP_MAX_LENGTH - 1; i++) {
      currentIndex = board[currentIndex]?.verticals[steps[dir]] ?? -1;
      if (isValidCell(currentIndex)) {
        directions[dir].push(currentIndex);
      } else break;
    }
  });

  return directions;
};

// Removes a direction from the available target directions
const removeInvalidDirection = (
  hits: Directions,
  direction: keyof Directions
): Directions => {
  const newHits = { ...hits };
  newHits[direction] = [];
  return newHits;
};

const getStep = (direction: string): number => {
  switch (direction) {
    case "left":
      return -1;
    case "right":
      return 1;
    case "up":
      return -BOARD_SIZE;
    case "down":
      return BOARD_SIZE;
    default:
      return 0;
  }
};

// used!
const getIsSunk = (
  index: number,
  board: CellValue[],
  restBoardIndices: number[]
) => {
  if (board[index].value === UNDEFINED_CELL_COLOR)
    return { isSunk: false, edges: [], restBoardIndices };
  const isVertical = board[index].isVertical;
  const backStep = isVertical ? getStep("up") : getStep("left");
  const forvardStep = isVertical ? getStep("down") : getStep("right");
  let isSunk = true;
  let backClosed = index;
  let forvardClosed = index;

  // forvard
  let i = index + backStep;
  while (i >= 0 && i < board.length) {
    const cell = board[i];
    if (cell.value === SHIP_CELL_COLOR) {
      isSunk = false;
      break;
    }
    if (cell.value !== STRIKED_CELL_COLOR) {
      backClosed = i;
      break;
    }
    i += backStep;
  }

  // backvard
  i = index + forvardStep;
  while (i >= 0 && i < board.length) {
    const cell = board[i];
    if (cell.value === SHIP_CELL_COLOR) {
      isSunk = false;
      break;
    }
    if (cell.value !== STRIKED_CELL_COLOR) {
      forvardClosed = i;
      break;
    }
    i += forvardStep;
  }
  const aroundSunk = isSunk ? getNearCells(index) : [];
  const limitsArray = isSunk
    ? filterValidClosureCells(
        [backClosed, forvardClosed],
        index,
        isVertical as boolean
      )
    : [];
  const edges = [...new Set([...(aroundSunk ?? []), ...(limitsArray ?? [])])];
  const filteredRestBoardIndices = restBoardIndices.filter(
    (idx) => !edges.includes(idx)
  );
  return {
    isSunk,
    edges,
    restBoardIndices: filteredRestBoardIndices,
  };
};

// Remove perpendicular directions based on where the latest index belongs
const removeInvalidPerpendiculars = (
  index: number,
  hits: Directions
): Directions => {
  const isVertical = hits.up.includes(index) || hits.down.includes(index);
  const isHorizontal = hits.left.includes(index) || hits.right.includes(index);
  const result: Directions = {
    up: isVertical ? [...hits.up] : [],
    left: isHorizontal ? [...hits.left] : [],
    right: isHorizontal ? [...hits.right] : [],
    down: isVertical ? [...hits.down] : [],
  };

  return result;
};

// After each successful hit, close diagonals immediately
const getIndicesWithoutDiagonals = (
  index: number,
  board: CellValue[],
  restIndices: number[]
): {
  updatedRestIndices: number[];
  diagonalsToClose: number[];
} => {
  const diagonals = board[index].diagonals.filter(
    (idx): idx is number =>
      idx !== null &&
      idx >= 0 &&
      idx < board.length &&
      board[idx].value !== STRIKED_CELL_COLOR &&
      board[idx].value !== MISSED_CELL_COLOR &&
      board[idx].value !== CLOSED_CELL_COLOR
  );

  const updatedRestIndices = restIndices.filter(
    (idx) => !diagonals.includes(idx)
  );

  return { updatedRestIndices, diagonalsToClose: diagonals };
};

const computerTurn = async ({
  userBoard,
  restHits,
  setRestHits,
  restBoardIndices,
  setRestBoardIndices,
  lastSuccessDirection,
  setLastSuccessDirection,
}: StepParams): Promise<StrikeResult> => {
  const updatedBoard = [...userBoard];
  const restHitsKeys = (Object.keys(restHits) as (keyof Directions)[]).filter(
    (key) => restHits[key].length > 0
  );

  const isTargeting = restHitsKeys.length > 0;

  const result = isTargeting
    ? await executeTargetedAttack({
        board: updatedBoard,
        restHits,
        restBoardIndices,
        lastSuccessDirection,
        setLastSuccessDirection,
      })
    : await executeRandomAttack({
        board: updatedBoard,
        restBoardIndices,
      });
  const {
    nextAttackedIndex,
    restBoardIndices: updatedRestBoardIndices,
    updatedRestHits,
    colorBeforeStrike,
    colorAfterStrike,
    celsToClose,
  } = result;
  console.log("Hits Up", result.updatedRestHits.up);
  console.log("Hits Left", result.updatedRestHits.left);
  console.log("Hits Right", result.updatedRestHits.right);
  console.log("Hits Down", result.updatedRestHits.down);
  await animateShot(
    userBoard,
    (newBoard) => Object.assign(userBoard, newBoard),
    nextAttackedIndex as number,
    colorAfterStrike,
    200
  );
  if (updatedRestBoardIndices !== undefined) {
    setRestBoardIndices(updatedRestBoardIndices);
  }
  setRestHits(updatedRestHits);
  return {
    nextAttackedIndex,
    restBoardIndices: updatedRestBoardIndices,
    updatedRestHits,
    colorBeforeStrike,
    colorAfterStrike,
    celsToClose,
  };
};
// used!
const executeRandomAttack = async ({
  board,
  restBoardIndices: initialRestBoardIndices,
}: ExecuteRandomAttackParams): Promise<StrikeResult> => {
  console.log("Random");
  const updatedBoard = [...board];
  const restIndices = [...initialRestBoardIndices];
  const randomIdx = Math.floor(Math.random() * restIndices.length);
  const nextAttackedIndex = restIndices.splice(randomIdx, 1)[0];

  const cell = board[nextAttackedIndex];
  const colorBeforeStrike = cell.value;

  if (colorBeforeStrike === SHIP_CELL_COLOR) {
    const { updatedRestIndices: indicesWithoutDiagonals, diagonalsToClose } =
      getIndicesWithoutDiagonals(nextAttackedIndex, updatedBoard, restIndices);
    const colorAfterStrike = STRIKED_CELL_COLOR;
    const {
      isSunk,
      edges,
      restBoardIndices: filteredRestBoardIndices,
    } = getIsSunk(nextAttackedIndex, updatedBoard, indicesWithoutDiagonals);
    if (!isSunk) {
      console.log("isSunk paint cells sunk around");
    }
    const updatedRestHits = !isSunk
      ? getPossibleHits(nextAttackedIndex, updatedBoard)
      : JSON.parse(JSON.stringify(INITIAL_REST_OF_HITS));

    const celsToClose = [
      ...new Set([...(diagonalsToClose ?? []), ...(edges ?? [])]),
    ] as number[];
    return {
      nextAttackedIndex,
      restBoardIndices: filteredRestBoardIndices,
      updatedRestHits,
      colorBeforeStrike,
      colorAfterStrike,
      celsToClose,
    };
  }

  return {
    nextAttackedIndex,
    restBoardIndices: restIndices,
    updatedRestHits: JSON.parse(JSON.stringify(INITIAL_REST_OF_HITS)),
    colorBeforeStrike,
    colorAfterStrike: MISSED_CELL_COLOR,
    celsToClose: [],
  };
};

const executeTargetedAttack = async ({
  board,
  restHits,
  restBoardIndices: initialRestBoardIndices,
  lastSuccessDirection,
  setLastSuccessDirection,
}: ExecuteTargetedAttackParams): Promise<StrikeResult> => {
  console.log("Target");
  const updatedBoard = [...board];
  let updatedRestHits = { ...restHits };
  let restIndices = [...initialRestBoardIndices];

  const restHitsKeys = (
    Object.keys(updatedRestHits) as (keyof Directions)[]
  ).filter((key) => updatedRestHits[key].length > 0);

  const direction = restHitsKeys.includes(
    lastSuccessDirection as keyof Directions
  )
    ? (lastSuccessDirection as keyof Directions)
    : restHitsKeys[Math.floor(Math.random() * restHitsKeys.length)];

  const nextAttackedIndex = updatedRestHits[direction].shift() as number;
  const colorBeforeStrike = updatedBoard[nextAttackedIndex].value;

  if (colorBeforeStrike === SHIP_CELL_COLOR) {
    if (lastSuccessDirection) {
      removeInvalidPerpendiculars(nextAttackedIndex, restHits);
    }
    const {
      isSunk,
      edges,
      restBoardIndices: filteredRestBoardIndices,
    } = getIsSunk(nextAttackedIndex, updatedBoard, restIndices);

    const {
      updatedRestIndices: indicesWithoutDiagonals,
      diagonalsToClose: close,
    } = getIndicesWithoutDiagonals(
      nextAttackedIndex,
      updatedBoard,
      filteredRestBoardIndices
    );
    const celsToClose = [
      ...new Set([...(edges ?? []), ...(close ?? [])]),
    ] as number[];

    restIndices = indicesWithoutDiagonals.filter(
      (idx) => idx !== nextAttackedIndex
    );

    if (isSunk) {
      setLastSuccessDirection("");
      updatedRestHits = JSON.parse(JSON.stringify(INITIAL_REST_OF_HITS));
      console.log(
        "Target ******** isSunk",
        isSunk,
        "INITIAL_REST_OF_HITS",
        INITIAL_REST_OF_HITS,
        "updatedRestHits",
        updatedRestHits
      );
    } else {
      setLastSuccessDirection(direction);
    }

    return {
      nextAttackedIndex,
      restBoardIndices: restIndices,
      updatedRestHits,
      colorBeforeStrike,
      colorAfterStrike: STRIKED_CELL_COLOR,
      celsToClose,
    };
  }

  restIndices = restIndices.filter((idx) => idx !== nextAttackedIndex);
  updatedRestHits = removeInvalidDirection(updatedRestHits, direction);
  setLastSuccessDirection("");

  return {
    nextAttackedIndex,
    restBoardIndices: restIndices,
    updatedRestHits,
    colorBeforeStrike,
    colorAfterStrike: MISSED_CELL_COLOR,
    celsToClose: [],
  };
};

// Applies a batch of color updates to board cells
const applyPaintChanges = (
  board: CellValue[],
  updates: { index: number; color: colors }[]
): CellValue[] => {
  const updatedBoard = [...board];
  updates.forEach(({ index, color }) => {
    if (updatedBoard[index]) {
      updatedBoard[index] = {
        ...updatedBoard[index],
        value: color,
      };
    }
  });
  return updatedBoard;
};

// Animates blinking effect during computer strike
const animateShot = async (
  userBoard: CellValue[],
  setUserBoard: React.Dispatch<React.SetStateAction<CellValue[]>>,
  targetIndex: number,
  colorAfterStrike: colors,
  delayMs: number,
  diagonalsToClose?: { index: number; color: colors }[]
) => {
  if (
    !Array.isArray(userBoard) ||
    targetIndex < 0 ||
    targetIndex >= userBoard.length
  ) {
    console.warn("Invalid access in animateComputerHit", {
      targetIndex,
      userBoardLength: userBoard?.length,
    });
    return;
  }
  const initialColor = userBoard[targetIndex].value;
  const blinkSequence = [ATTENTION_CELL_COLOR, initialColor];

  for (let i = 0; i < 3; i++) {
    for (const blinkColor of blinkSequence) {
      setUserBoard((prevBoard) =>
        applyPaintChanges(prevBoard, [
          { index: targetIndex, color: blinkColor },
        ])
      );
      await delay(delayMs);
    }
  }

  setUserBoard((prevBoard) => {
    return applyPaintChanges(prevBoard, [
      { index: targetIndex, color: colorAfterStrike },
      ...(diagonalsToClose ?? []),
    ]);
  });
};

// Returns true if all ship cells have been hit
// used!
const isAllSunk = (totalShipCells: number, board: CellValue[]): boolean =>
  board.filter((cell) => cell.value === STRIKED_CELL_COLOR).length ===
  totalShipCells;

// Maps cell value to STRIKED or MISSED color depending on hit
// used!
const getNewCellColorAsStrikeResult = (value: colors): colors =>
  value === SHIP_CELL_COLOR ? STRIKED_CELL_COLOR : MISSED_CELL_COLOR;

// Delay utility used across animations
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// 🔚 Exports
export {
  fillField,
  computerTurn,
  getBattleFieldFormated,
  createEmptyBoard,
  matrixToCell,
  cellToMatrix,
  isInBounds,
  canPlaceShip,
  getIsSunk,
  isAllSunk,
  getNewCellColorAsStrikeResult,
  delay,
  animateShot,
  removeInvalidPerpendiculars,
  getNeighborCells,
  getDiagonalCells,
  getNearCells,
  closeCellsAround,
};
