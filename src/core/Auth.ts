import {v4 as uuidv4} from 'uuid';
import { Socket } from "socket.io";

import { encode64, decode64 } from "../utils";
import { Player, PlayerOptions } from ".";

export type User = {
  id: string,
  socket?: Socket,
  player: Player,
};

export const authenticate = (nickname: string): User => {
  return {
    id: uuidv4(),
    player: new Player({
      id: uuidv4(),
      nickname
    } as PlayerOptions),
  }
};

export const serializeUserInfo = (user: User): string => {
  return encode64(`${user.id}`);
}

export const deserializeUserInfo = (token: string): string => {
  return decode64(token);
};