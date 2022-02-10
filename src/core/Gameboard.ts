import { randomInRange } from "../utils";
import { Entity, Cell, Player } from ".";

export enum BOARD_MOVES {
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
};

export enum MOVEMENT_RESULT {
  HAD_COLLISION,
  INVALID_MOVEMENT,
  SUCCESS,
};

type CellChecker = {
  hasCollision: boolean,
  cell: Cell,
};

type SchedulerMove = {
  entity: Entity,
  move: BOARD_MOVES,
  onMoveEnd: (movement: MOVEMENT_RESULT) => void,
};

export class Gameboard {

  public width: number;
  public height: number;
  public cells: Cell[]

  private moveScheduler: SchedulerMove[] = [];
  private schedulerRunning: boolean;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.schedulerRunning = false;

    this.reset();
  }

  public moveEntity(entity: Entity, move: BOARD_MOVES): Promise<MOVEMENT_RESULT> {
    return new Promise((resolve, _reject) => {
      this.moveScheduler.push({ entity, move, onMoveEnd: resolve });
      if(!this.schedulerRunning) this.runScheduler();
    });
  }

  private runScheduler() {
    if(this.moveScheduler.length > 0) {
      const {entity, move, onMoveEnd} = this.moveScheduler.pop();
      const { cell, hasCollision } = this.getNextCell(entity.cell, move);

      if(cell === null) onMoveEnd(MOVEMENT_RESULT.INVALID_MOVEMENT);
      if(hasCollision) onMoveEnd(MOVEMENT_RESULT.HAD_COLLISION);

      if(cell !== null && !hasCollision) {
        entity.cell.clearEntity();
        cell.setEntity(entity);
        onMoveEnd(MOVEMENT_RESULT.SUCCESS);
      }
    }

    if(this.moveScheduler.length === 0) {
      this.schedulerRunning = false;
    } else {
      this.runScheduler();
    }
  }

  public addEntity(entity: Entity) {
    const emptyCells = this.getEmptyCells();
    const randomIndex = randomInRange(0, emptyCells.length)
    const randomEmptyCell = this.cells[emptyCells[randomIndex]];
    randomEmptyCell.setEntity(entity);
    entity.board = this;
  }

  public clearEntity(entity: Entity) {
    entity.cell.clearEntity();
    entity.board = null;
  }

  public serialize(): object {
    const cellsInfo = this.cells.map(cell => {
      return {
        entity: (cell.entity as Player)?.nickname,
        index: cell.index,
      }
    });

    return {
      width: this.width,
      height: this.height,
      cells: cellsInfo,
    };
  }

  public updateDimensions(height: number, width: number) {
    // TODO: Implement expansion and reorganization of the entities
  }

  // #region private

  private getEmptyCells(): number[] {
    return this.cells.reduce((acc, cell) => {
      if(cell.entity === null) acc.push(cell.index);
      return acc;
    },[])
  }

  private reset() {
    this.cells = [];
    for(let i = 0; i < this.width * this.height; i++) {
      this.cells.push(new Cell(i));
    }
  }

  private getNextCell(cell: Cell, move: BOARD_MOVES): CellChecker {
    let nextCell: Cell = null;

    const currentIndex = cell.index;
    const currentRow = Math.floor(currentIndex / this.height);
    const currentCol = currentIndex % this.width;

    if(move === BOARD_MOVES.MOVE_LEFT) {
      if(currentCol > 0) {
        nextCell = this.cells[currentIndex - 1];
      }
    } else if (move === BOARD_MOVES.MOVE_UP) {
      if(currentRow > 0) {
        const aboveCell = ((currentRow - 1) * this.width) + currentCol;
        nextCell = this.cells[aboveCell];
      }
    } else if (move === BOARD_MOVES.MOVE_RIGHT) {
      if(currentCol <= (this.width - 2)) {
        nextCell = this.cells[currentIndex + 1];
      }
    } else if (move === BOARD_MOVES.MOVE_DOWN) {
      if(currentRow <= (this.height - 2)) {
        const belowCell = ((currentRow + 1) * this.height) + currentCol;
        nextCell = this.cells[belowCell];
      }
    }

    return {
      cell: nextCell,
      hasCollision: nextCell !== null && nextCell.hasEntity(),
    };

    // TODO: Make logic fully dynamic depending on the board dimensions
  }

  // #endregion

};
