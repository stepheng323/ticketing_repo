import { Listener, Subjects, PaymentCreatedEvents, OrderStatus } from "@zion_system/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroupName } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvents> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvents['data'], msg: Message) {
    const order = await Order.findById(data.orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ staus: OrderStatus.Complete })
    msg.ack();
  }
}