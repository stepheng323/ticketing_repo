import mongoose from 'mongoose';
import { natsWrapper } from './natsWrapper';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/orderCancelledListener';
import { OrderCreatedListener } from './events/listeners/orderCreatedListener'


const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Nats Client id must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Nats Cluster id must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('Nats url must be defined');
  }


  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('Nats connection closed');
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
