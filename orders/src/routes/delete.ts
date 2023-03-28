import { NotFoundError, OrderStatus, requireAuth } from '@zion_system/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publisher/orderCancelledEvent';
import { Order } from '../models/orders';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    id: orderId
  }).populate('ticket')
  if (!order) throw new NotFoundError()
  order.status = OrderStatus.Cancelled
  await order.save()
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: orderId,
    version: order.version,
    ticket: { id: order.ticket.id }
  })
  res.status(204).send(order);
});

export { router as deleteOrdeRouter };
