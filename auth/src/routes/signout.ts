import express from 'express';

const signout = express.Router();

signout.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

export default signout;
