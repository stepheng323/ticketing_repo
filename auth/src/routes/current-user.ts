import express from 'express';
import { currentUser, requireAuth } from '@zion_system/common';

const currentUserRouter = express.Router();

currentUserRouter.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export default currentUserRouter;
