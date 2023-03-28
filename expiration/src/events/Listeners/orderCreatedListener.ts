import { Listener, OrderCreatedEvents, Subjects } from "@zion_system/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queue/expirationQueue";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvents>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvents['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    expirationQueue.add({
      orderId: data.id
    }, {
      delay
    })
    msg.ack()
  }
}