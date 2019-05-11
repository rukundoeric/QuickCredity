import express from 'express';
import bodyParcer from 'body-parser';
import User from '../routers/UserRouter';
import UserMessage from '../routers/WelcomeRouter';
import loanRouter from '../routers/LoanRouter';
// const express =require('express');
// const User=require('./../routers/UserRouter');

const app = express();
const PORT = process.env.PORT || 6070;
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParcer.json());
app.use(bodyParcer.urlencoded({ extended: false }));
app.use('/', UserMessage);
app.use('/', User);
app.use('/', loanRouter);

const startServer = (port = '') => {
  const server = app.listen(port || PORT, () => {
    console.log(`\n Server is running on PORT  ${port || PORT}...`);
  });
  return server;
};
startServer();

export default startServer;
