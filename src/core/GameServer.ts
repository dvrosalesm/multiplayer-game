import * as http from "http";
import { Server, Socket } from "socket.io";
import { getMoveFromString, _logger } from "../utils";

import { Gameboard, Player } from ".";
import { deserializeUserInfo } from "./Auth";
import { DataStorageHelper } from "./DataStorage";

interface ServerToClientEvents {
  askToken: () => void,
  updateBoard: () => void,
  invalidToken: () => void,
};

interface ClientToServerEvents {
  move: () => void,
  tokenReceived: () => void,
};

export class GameServer {

  private wsServer: Server;
  private httpServer: http.Server;
  private board: Gameboard;

  constructor() {
    const width = parseInt(process.env.BOARD_WIDTH, 10);
    const height = parseInt(process.env.BOARD_HEIGHT, 10);
    this.board = new Gameboard(width, height);

    this.startServer();
  }

  private startServer() {
    this.httpServer = http.createServer();
    this.wsServer = new Server<ClientToServerEvents, ServerToClientEvents>(this.httpServer);

    this.wsServer.on("connection", (socket) => {
      socket.emit("askToken");
      socket.on("tokenReceived", this.onTokenReceived(socket));
      socket.on("move", this.onMove(socket));
      socket.on("disconnect", this.onDisconnect(socket));
    });

    const port = process.env.HTTP_SERVER_PORT;
    this.httpServer.listen(port, () => {
      _logger(`HTTP Server listening on port: ${port}`);
    });
  }

  private onTokenReceived(socket: Socket) {
    return (token: string) => {
      const userId = deserializeUserInfo(token);
      const newUser = DataStorageHelper.getUserById(userId);

      if(!newUser) {
        socket.emit("invalidToken");
        socket.disconnect();
        return;
      }

      _logger(`User ${newUser.id} has connected.`);

      newUser.socket = socket;
      this.board.addEntity(newUser.player);
      this.wsServer.sockets.emit('updateBoard', this.board.serialize());
    }
  }

  private onMove(socket: Socket) {
    return (move: string) => {
      const boardMove = getMoveFromString(move);
      const currentUser = DataStorageHelper.getUserBySocket(socket.id);
      this.board.moveEntity(currentUser.player, boardMove);

      _logger(`User ${currentUser.id} moved ${move}.`);

      this.wsServer.sockets.emit('updateBoard', this.board.serialize());
    }
  }

  private onDisconnect(socket: Socket) {
    return () => {
      const currentUser = DataStorageHelper.getUserBySocket(socket.id);

      if(!currentUser) return;

      this.board.clearEntity(currentUser.player);
      DataStorageHelper.removeUser(currentUser);

      _logger(`User ${currentUser.id} has left.`)

      this.wsServer.sockets.emit('updateBoard', this.board.serialize());
    }
  }

};

