import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {BadRequestError, validateRequest} from '@zion_system/common';
import User from '../models/users';
import { catchAsync } from '../utils';

const signup = Router();

signup.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
],
validateRequest,
catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('email in use');
  }

  const user = User.build({ email, password });
  await user.save();
  const token = jwt.sign({
    id: user.id,
    email,
  }, process.env.JWT_KEY!);
  req.session = {
    jwt: token,
  };
  res.status(201).send(user);
}));

export default signup;
