// App.tsx
import React, { useEffect, useState } from "react";
import BattleField from "./Battle-field";
import {
  fillField,
  computerTurn,
  isAllSunk,
  getNewCellColorAsStrikeResult,
  closeCellsAround,
  animateShot,
  getNearCells,
  getIsSunk,
  getDiagonalCells,
} from "@/utils/utils";
import {
  MISSED_CELL_COLOR,
  STRIKED_CELL_COLOR,
  BOARD_SIZE,
  SHIPS_TOTAL_CELLS,
  INITIAL_REST_OF_HITS,
} from "@/constants/constants";
import { CellValue, colors } from "@/types/types";

function App() {
  const [computerBoard, setComputerBoard] = useState<CellValue[]>([]);
  const [userBoard, setUserBoard] = useState<CellValue[]>([]);
  const [winMessage, setWinMessage] = useState("");
  const [restHits, setRestHits] = useState(INITIAL_REST_OF_HITS);

  const [lastSuccessDirection, setLastSuccessDirection] = useState("");
  const [restBoardIndices, setRestBoardIndices] = useState(
    Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => index)
  );

  // initialize boards on load
  useEffect(() => {
    setComputerBoard(fillField());
    setUserBoard(fillField());
  }, []);

  useEffect(() => {
    const isComputerWin = isAllSunk(SHIPS_TOTAL_CELLS, userBoard);
    if (isComputerWin) setWinMessage("Computer Win");
  }, [userBoard]);
  useEffect(() => {
    const isUserWin = isAllSunk(SHIPS_TOTAL_CELLS, computerBoard);
    if (isUserWin) setWinMessage("User Win");
  }, [computerBoard]);

  useEffect(() => {
    console.log("restBoardIndices", restBoardIndices);
  }, [restBoardIndices]);

  // Handle user click
  const handleClick = async (index: number, value: number) => {
    const colorAfterAttac = getNewCellColorAsStrikeResult(value as colors);
    let cellsToCloseOnCompField: number[] = [];
    if (value !== STRIKED_CELL_COLOR && value !== MISSED_CELL_COLOR) {
      if (colorAfterAttac === STRIKED_CELL_COLOR) {
        const { isSunk, edges } = getIsSunk(index, computerBoard, []);
        const diagonals = getDiagonalCells(index);
        if (isSunk) {
          const nearest = getNearCells(index) ?? [];
          cellsToCloseOnCompField = [
            ...new Set([
              ...(nearest ?? []),
              ...(diagonals ?? []),
              ...(edges ?? []),
            ]),
          ] as number[];
        } else {
          cellsToCloseOnCompField = [
            ...new Set([...(diagonals ?? [])]),
          ] as number[];
        }
        // paint closed diagonals
        closeCellsAround(computerBoard, cellsToCloseOnCompField);
      }
      cellsToCloseOnCompField = [];

      animateShot(computerBoard, setComputerBoard, index, colorAfterAttac, 0);

      // Computer turn get next attack index for blinking
      const { nextAttackedIndex, colorAfterStrike, celsToClose } =
        await computerTurn({
          userBoard,
          restHits,
          setRestHits,
          restBoardIndices,
          setRestBoardIndices,
          lastSuccessDirection,
          setLastSuccessDirection,
        });

      //Blink logic
      if (nextAttackedIndex !== null && userBoard.length > 0) {
        animateShot(
          userBoard,
          setUserBoard,
          nextAttackedIndex,
          colorAfterStrike,
          100
        );

        if (celsToClose.length) {
          closeCellsAround(userBoard, celsToClose);
        }
      }
    } else {
      alert("already attacked cell!!!");
    }
  };

  return (
    <div className="app-container">
      <div className="app-background">
        <div className="ocean-waves"></div>
        <div className="ocean-waves"></div>
        <div className="ocean-waves"></div>
      </div>

      <header className="app-header">
        <div className="header-content">
          <h1 className="game-title">
            <span className="title-icon">⚓</span>
            SEA BATTLE
            <span className="title-icon">⚓</span>
          </h1>
          <div className="game-subtitle">Naval Warfare Strategy Game</div>
        </div>
      </header>

      {winMessage && (
        <div
          className={`win-message ${
            winMessage.includes("Win") ? "win" : "lose"
          }`}
        >
          <div className="win-content">
            <span className="win-icon">🏆</span>
            <span className="win-text">{winMessage}</span>
            <span className="win-icon">🏆</span>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="battlefields-wrapper">
          <BattleField
            title={"computer"}
            board={computerBoard}
            handleClick={handleClick}
          />
          <BattleField
            title={"user"}
            board={userBoard}
            handleClick={handleClick}
          />
        </div>

        <div className="game-info">
          <div className="info-card">
            <h3>🎯 Game Rules</h3>
            <ul>
              <li>Click on computer&apos;s field to attack</li>
              <li>Find and destroy all enemy ships</li>
              <li>First to sink all ships wins!</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🔍 Legend</h3>
            <div className="legend-item">
              <div className="legend-color ship"></div>
              <span>Ship</span>
            </div>
            <div className="legend-item">
              <div className="legend-color hit"></div>
              <span>Hit</span>
            </div>
            <div className="legend-item">
              <div className="legend-color miss"></div>
              <span>Miss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
