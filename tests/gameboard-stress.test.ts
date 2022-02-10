import { EntityFactory } from '../src/factories';
import { Gameboard, Player, PlayerOptions } from '../src/core';
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

describe('Stress test the board to fill with players', () => {
  for(let i = 0; i < (board.width * board.height) - 1; i++) {
    const player = EntityFactory.create(EntityFactory.ENTITY_TYPES.PLAYER, {
      id: `${i}`,
      nickname: `player_${i}`,
      cell: null,
      board: null,
    } as PlayerOptions) as Player;
    board.addEntity(player);
    players.push(player);
  }  

  GameboardLogger(board, true);
});
