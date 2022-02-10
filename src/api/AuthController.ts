import express from 'express';
import { body, validationResult } from 'express-validator';
import { DataStorageHelper } from '../core/DataStorage';
import { authenticate, serializeUserInfo } from '../core/Auth';
import { successMessage } from './helpers';
import { _logger } from '../utils';

export const RegisterAuth = (app: express.Application) => {
  app.post('/login',
  body('nickname').isString().isLength({
    min: 1,
    max: 100,
  }),
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nickname = req.body.nickname;
    const user = authenticate(nickname);
    const userInfo = serializeUserInfo(user);

    DataStorageHelper.addUser(user);

    _logger(`User ${user.id} has logged in.`);

    res.statusCode = 200;
    res.json(successMessage({
      token: userInfo,
      webSocket: `http://localhost:${process.env.HTTP_SERVER_PORT}`,
    }));
  });
};