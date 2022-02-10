import { BOARD_MOVES, Cell, Gameboard } from ".";

export interface Entity {
  id: string;
  board: Gameboard;
  cell?: Cell;
  move(direction: BOARD_MOVES): void;
};

export interface EntityOptions {
  id: string;
  board: Gameboard;
  cell: Cell;
}

export interface PlayerOptions extends EntityOptions {
  nickname: string;
}

export class Player implements Entity {
  id: string;
  cell: Cell;
  board: Gameboard;
  nickname: string;
  score: number;

  constructor(options: PlayerOptions) {
    this.id = options.id;
    this.nickname = options.nickname;
    this.cell = options.cell;
    this.board = options.board;
  }

  public move(direction: BOARD_MOVES): void {
    this.board.moveEntity(this, direction);
  }
}

// TODO: Implementation of obstacle and coin logic