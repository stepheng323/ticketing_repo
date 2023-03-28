import { requireAuth } from '@zion_system/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

  const order = await Order.findOne({
    id: req.params.orderId,
    userId: req.currentUser!.id
  }).populate('ticket')
  res.send(order);
});

export { router as showOrdeRouter };
