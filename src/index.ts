import * as dotenv from 'dotenv';
import { APIServer } from './api/APIServer';
import { GameServer } from './core';

dotenv.config();

const gameServer = new GameServer();
const apiServer = new APIServer();