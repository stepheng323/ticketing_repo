import { Publisher, Subjects, PaymentCreatedEvents } from "@zion_system/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvents> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

}