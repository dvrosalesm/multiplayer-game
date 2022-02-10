import express from "express"
import { RegisterAuth } from "./AuthController";
import cors from 'cors';
import { _logger } from "../utils";

export class APIServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.loadMiddlewares();
    this.loadControllers();

    const port = process.env.API_SERVER_PORT;
    this.app.listen(port, () => {
      _logger(`API Server listening on port: ${port}`);
    });
  }

  private loadMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json());
  }

  private loadControllers() {
    RegisterAuth(this.app);
  }
};