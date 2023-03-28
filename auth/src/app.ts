import express from 'express';
import cookieSession from 'cookie-session';
import { errorHandler } from '@zion_system/common';
import currentUser from './routes/current-user';
import signup from './routes/signup';
import signout from './routes/signout';
import signin from './routes/signin';

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: true,
}));

app.use(currentUser);
app.use(signin);
app.use(signup);
app.use(signout);
app.use(errorHandler);

export default app;
