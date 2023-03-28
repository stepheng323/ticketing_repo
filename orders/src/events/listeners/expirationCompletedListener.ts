import { ExpirationCompleteEvents, Listener, OrderStatus, Subjects } from "@zion_system/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../natsWrapper";
import { OrderCancelledPublisher } from "../publisher/orderCancelledEvent";
import { queueGroupName } from "./queueGroupName";

export class ExpirationCompletedListener extends Listener<ExpirationCompleteEvents>{
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;

  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvents['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }
    order.set({
      status: OrderStatus.Cancelled
    })

    await order.save()

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })
    msg.ack()
  }
}