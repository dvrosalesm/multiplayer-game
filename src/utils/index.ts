import { fstat } from 'fs';
import { BOARD_MOVES, Gameboard, Player } from '../core';
import * as fs from 'fs';
import * as path from 'path';

export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min
}

export const GameboardLogger = (gameboard: Gameboard, fileOutput = false) => {
  const cellWidth = 3;

  const matrix = [];
  for(let i = 0; i < gameboard.height; i++) {
    const initialPos = i * gameboard.width;
    matrix.push(gameboard.cells.slice(initialPos, initialPos + gameboard.width));
  }

  const fillLine = () => {
    const dashedLine = Array((gameboard.width * cellWidth) + (gameboard.width - 1)).fill("-").join("");
    return `${dashedLine}`;
  }

  let renderedBoard = "";

  matrix.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const entityName = cell.entity !== null
      ? (cell.entity as Player).nickname.charAt(0)
      : "•";

      if(cellIndex > 0) renderedBoard += "|";
      renderedBoard += ` ${entityName} `;
    });

    if(rowIndex < matrix.length - 1) {
      renderedBoard += `\n${fillLine()}\n`;
    }
  });

  if(fileOutput) {
    fs.writeFileSync(path.join(__dirname, '../../gamelog.txt'), renderedBoard);
  } else {
    console.log(renderedBoard);
  }
};

export const _logger = (msg: string): void => {
  if(process.env.ENV === 'production') {
    fs.appendFileSync(path.join(__dirname, '../../log.txt'), msg + "\n");
  } else {
    console.log(msg);
  }
}

export const getMoveFromString = (move: string): BOARD_MOVES => {
  if(move === "up") return BOARD_MOVES.MOVE_UP;
  if(move === "down") return BOARD_MOVES.MOVE_DOWN;
  if(move === "left") return BOARD_MOVES.MOVE_LEFT;
  if(move === "right") return BOARD_MOVES.MOVE_RIGHT;
}

export const decode64 = (str: string):string => Buffer.from(str, 'base64').toString('binary');
export const encode64 = (str: string):string => Buffer.from(str, 'binary').toString('base64');
