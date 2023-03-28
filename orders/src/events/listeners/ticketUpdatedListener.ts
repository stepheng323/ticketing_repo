import { Listener, NotFoundError, Subjects, TicketUpdatedEvents } from "@zion_system/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvents>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName
  async onMessage(data: TicketUpdatedEvents['data'], msg: Message) {
    console.log('ticket-updated-event-recieved');
    const { title, price } = data
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) throw new Error('No ticket found')
    ticket.set({ title, price })
    await ticket.save()
    msg.ack()
  }

}