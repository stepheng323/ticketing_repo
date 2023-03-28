import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@zion_system/common';
import { indexOrdeRouter } from '../src/routes/index'
import { showOrdeRouter } from '../src/routes/show'
import { deleteOrdeRouter } from '../src/routes/delete'
import { newOrdeRouter } from '../src/routes/new'

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(indexOrdeRouter);
app.use(showOrdeRouter);
app.use(deleteOrdeRouter);
app.use(newOrdeRouter);




app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
