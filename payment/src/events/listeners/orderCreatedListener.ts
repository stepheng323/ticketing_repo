import { Listener, OrderCreatedEvents, Subjects } from "@zion_system/common"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { queueGroupName } from './queueGroupName'

export class OrderCreatedListener extends Listener<OrderCreatedEvents>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvents['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price,
      status: data.status
    })
    await order.save()
    msg.ack()
  }
}