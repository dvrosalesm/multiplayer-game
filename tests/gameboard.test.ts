import { EntityFactory } from '../src/factories';
import { BOARD_MOVES, Gameboard, MOVEMENT_RESULT, Player, PlayerOptions } from '../src/core';
import { GameboardLogger } from '../src/utils';

let board: Gameboard = null;
const players: Player[] = [];

describe("Create gameboard with right dimensions", () => {

  board = new Gameboard(20, 20);

  it("matches if the received dimensions are 20 width, 20 height and 400 empty cells", () => {
    expect(board.width).toBe(20);
    expect(board.height).toBe(20);
    expect(board.cells.length).toBe(400);
  });

  it("matches if first cell has index of 0 and last one index of 399", () => {
    expect(board.cells[0].index).toBe(0);
    expect(board.cells[board.cells.length -1].index).toBe(399);
  });
})

describe("Create and add entity to the board", () => {
  const player = EntityFactory.create(EntityFactory.ENTITY_TYPES.PLAYER, {
    id: "0",
    board: null,
    cell: null,
    nickname: "Player 1",
  } as PlayerOptions) as Player;

  board.addEntity(player);
  players.push(player);

  it("matches if the cell and the board have been added to the player", () => {
    expect(player.board).toEqual(board);
    expect(player.cell).not.toBeNull();
  });
});

describe("Move entity around the board", () => {

  const currentPlayer = players[0];

  it("matches if at least one movement was valid", async () => {
    const movements = [
      await board.moveEntity(currentPlayer, BOARD_MOVES.MOVE_LEFT), 
      await board.moveEntity(currentPlayer, BOARD_MOVES.MOVE_DOWN), 
      await board.moveEntity(currentPlayer, BOARD_MOVES.MOVE_LEFT), 
      await board.moveEntity(currentPlayer, BOARD_MOVES.MOVE_RIGHT)
    ];

    const validMovements = movements.filter(movement => movement === MOVEMENT_RESULT.SUCCESS);
    expect(validMovements.length).toBeGreaterThan(0);
  });

  const checkForOutOfBounds = async (player: Player, direction: BOARD_MOVES) => {
    const steps = direction === BOARD_MOVES.MOVE_DOWN || direction === BOARD_MOVES.MOVE_UP ? board.height : board.width;
    let movementOutOfBounds = false;
    for(let i = 0; i < steps; i++) {
      const move = await board.moveEntity(player, direction);
      
      if(move === MOVEMENT_RESULT.INVALID_MOVEMENT) {
        movementOutOfBounds = true;
        break;
      }
    }

    return movementOutOfBounds;
  };

  it("matches if player moves all the way to the bottom border of the board and cannot continue to down ", async () => {
    const outOfBounds = await checkForOutOfBounds(currentPlayer, BOARD_MOVES.MOVE_DOWN); 
    expect(outOfBounds).toBe(true);
    GameboardLogger(board, true);
  });

  it("matches if player moves all the way to the top border of the board and cannot continue to move up", async () => {
    const outOfBounds = await checkForOutOfBounds(currentPlayer, BOARD_MOVES.MOVE_UP); 
    expect(outOfBounds).toBe(true);
    GameboardLogger(board, true);
  });

  it("matches if player moves all the way to the left border of the board and cannot continue to move left", async () => {
    const outOfBounds = await checkForOutOfBounds(currentPlayer, BOARD_MOVES.MOVE_LEFT); 
    expect(outOfBounds).toBe(true);
    GameboardLogger(board, true);
  });

  it("matches if player moves all the way to the right border of the board and cannot continue to move right", async () => {
    const outOfBounds = await checkForOutOfBounds(currentPlayer, BOARD_MOVES.MOVE_RIGHT); 
    expect(outOfBounds).toBe(true);
    GameboardLogger(board, true);
  });
});
