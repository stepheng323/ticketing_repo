import { Publisher, Subjects, ExpirationCompleteEvents } from '@zion_system/common'


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvents> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}