import mongoose from 'mongoose';
import app from './app'


const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connected to mongodb');
  } catch (error) {
    console.log(error);
  }
};

start();

app.listen(3000, () => console.log('auth service listening on port 3000!!!!'));
