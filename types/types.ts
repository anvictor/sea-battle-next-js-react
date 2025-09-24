// types.ts
import { Dispatch, ReactNode, SetStateAction } from "react";

type colors = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type nearCell = number | null;

type CellValue = {
  index: number;
  diagonals: nearCell[];
  verticals: nearCell[];
  value: colors;
  isVertical: boolean | null;
};

interface TableComponentProps {
  data: CellValue[];
}

type MatrixPosition = {
  rowIndex: number;
  cellIndex: number;
};

type Directions = {
  up: number[];
  left: number[];
  right: number[];
  down: number[];
};

type AppProps = {
  children: ReactNode;
};
interface BattleFieldProps {
  title: string;
  board: CellValue[];
  handleClick: (index: number, value: number) => void;
}

interface StepParams {
  userBoard: CellValue[];
  restHits: Directions;
  setRestHits: Dispatch<SetStateAction<Directions>>;
  restBoardIndices: number[];
  setRestBoardIndices: Dispatch<SetStateAction<number[]>>;
  lastSuccessDirection: string;
  setLastSuccessDirection: Dispatch<SetStateAction<string>>;
}
interface ShipStatus {
  isSunk: boolean;
  startIndex: number;
  finishIndex: number;
  isVertical: boolean;
}

interface StrikeResult {
  nextAttackedIndex: number | null;
  restBoardIndices: number[];
  updatedRestHits: Directions;
  colorBeforeStrike: colors;
  colorAfterStrike: colors;
  celsToClose: number[];
}

type ExecuteRandomAttackParams = {
  board: CellValue[];
  restBoardIndices: number[];
};

type ExecuteTargetedAttackParams = {
  board: CellValue[];
  restHits: Directions;
  restBoardIndices: number[];
  lastSuccessDirection: string;
  setLastSuccessDirection: (s: string) => void;
};

export type {
  colors,
  Directions,
  nearCell,
  CellValue,
  TableComponentProps,
  MatrixPosition,
  AppProps,
  BattleFieldProps,
  StepParams,
  ShipStatus,
  StrikeResult,
  ExecuteRandomAttackParams,
  ExecuteTargetedAttackParams,
};
