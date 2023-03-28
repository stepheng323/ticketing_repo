import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@zion_system/common';
import User from '../models/users';
import Password from '../services/hash';
import { catchAsync } from '../utils';

const signin = Router();

signin.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('please enter a password')],
validateRequest,
catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const badRequestMessage = 'Invalid email and password combination';
  if (!user) {
    throw new BadRequestError(badRequestMessage);
  }
  const passwordMatch = Password.compare(user.password, password);
  if (!passwordMatch) {
    throw new BadRequestError(badRequestMessage);
  }
  const token = jwt.sign({
    id: user.id,
    email,
  }, process.env.JWT_KEY!);
  req.session = {
    jwt: token,
  };
  res.status(200).send(user);
}));

export default signin;
