import { Publisher, Subjects, OrderCancelledEvents } from "@zion_system/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvents> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;


}