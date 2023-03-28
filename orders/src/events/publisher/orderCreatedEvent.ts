import { Publisher, OrderCreatedEvents, Subjects } from "@zion_system/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvents> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;


}