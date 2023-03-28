import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@zion_system/common';
import { body } from 'express-validator';
import { Ticket } from '../models/tickets';
import { Order } from '../models/orders';
import { natsWrapper } from '../natsWrapper';
import { OrderCreatedPublisher } from '../events/publisher/orderCreatedEvent';


const ORDER_EXPIRATTION_WINDOW = 15 * 60


const router = express.Router();

router.post('/api/orders', requireAuth, [
  body('ticketId').not().isEmpty().withMessage('Ticket id must be provided')
], validateRequest, async (req: Request, res: Response) => {

  const { ticketId } = req.body

  const ticket = await Ticket.findById(ticketId)


  if (!ticket) throw new NotFoundError()
  const reserved = await ticket.isReserved()
  if (reserved) throw new BadRequestError('Ticket already reserved')

  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + ORDER_EXPIRATTION_WINDOW)

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    ticket,
    expiresAt: expiration
  })

  await order.save()
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    version: order.version,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  })
  res.status(201).send(order);
});

export { router as newOrdeRouter };
