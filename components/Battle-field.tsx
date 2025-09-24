// Battle-field.tsx
import { CellValue, BattleFieldProps } from "@/types/types";
import {
  BOARD_SIZE,
  CLOSED_CELL_COLOR,
  MISSED_CELL_COLOR,
  SHIP_CELL_COLOR,
  STRIKED_CELL_COLOR,
  ATTENTION_CELL_COLOR,
  BLINK_CELL_COLOR_PINK,
} from "@/constants/constants";
import { matrixToCell } from "@/utils/utils";

const BattleField = ({ title, board, handleClick }: BattleFieldProps) => {
  const rows = [];
  for (let i = 0; i < board.length; i += BOARD_SIZE) {
    rows.push(board.slice(i, i + BOARD_SIZE));
  }

  const localHandleClick = (
    rowIndex: number,
    cellIndex: number,
    cellData: CellValue,
    title: string
  ) => {
    // on click computer field only
    if (title === "computer") {
      const value = cellData.value;
      const index = matrixToCell(rowIndex, cellIndex);
      handleClick(index, value);
    }
  };

  const getComputerCellColor = (cell: CellValue): string => {
    switch (cell.value) {
      case SHIP_CELL_COLOR:
        return "rgba(59, 130, 246, 0.15)"; // water-like, hide ships
      case STRIKED_CELL_COLOR:
        return "red";
      case MISSED_CELL_COLOR:
        return "yellow";
      case CLOSED_CELL_COLOR:
        return "aquamarine";
      default:
        return "rgba(59, 130, 246, 0.15)"; // water-like default
    }
  };

  const getUserCellColor = (cell: CellValue): string => {
    switch (cell.value) {
      case SHIP_CELL_COLOR:
        return "blue";
      case STRIKED_CELL_COLOR:
        return "red";
      case MISSED_CELL_COLOR:
        return "yellow";
      case CLOSED_CELL_COLOR:
        return "aquamarine";
      case ATTENTION_CELL_COLOR:
        return "palegoldenrod";
      case BLINK_CELL_COLOR_PINK:
        return "#9e9e9e"; //grey
      default:
        return "rgba(59, 130, 246, 0.15)"; // water-like default
    }
  };

  const isItCompOrUserColors = (cell: CellValue, title: string) => {
    if (title === "computer") {
      return getComputerCellColor(cell);
    }

    return getUserCellColor(cell);
  };

  return (
    <div className="battle-field-container">
      <div className="battle-field-header">
        <h2 className="battle-field-title">{title.toUpperCase()}</h2>
        <div className="battle-field-subtitle">BATTLEFIELD</div>
      </div>

      <div className="battle-field-grid">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="battle-field-row">
            {row.map((cellData: CellValue, cellIndex: number) => (
              <div
                key={cellIndex}
                className={`battle-field-cell ${
                  title === "computer" ? "computer-cell" : "user-cell"
                }`}
                style={{
                  backgroundColor: isItCompOrUserColors(cellData, title),
                }}
                onClick={() =>
                  localHandleClick(rowIndex, cellIndex, cellData, title)
                }
              >
                {cellData.value === STRIKED_CELL_COLOR && (
                  <div className="hit-indicator">💥</div>
                )}
                {cellData.value === MISSED_CELL_COLOR && (
                  <div className="miss-indicator">💧</div>
                )}
                {cellData.value === SHIP_CELL_COLOR && title === "user" && (
                  <div className="ship-indicator">🚢</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleField;
