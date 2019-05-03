import express from 'express';
import bodyParcer from 'body-parser';
import User from '../routers/UserRouter';
import UserMessage from '../routers/WelcomeRouter';
import loanRouter from './../routers/LoanRouter';
// const express =require('express');
// const User=require('./../routers/UserRouter');

const app = express();
const PORT = process.env.PORT || 7070;
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

app.listen(PORT, () => {
  console.log(`Server is started on ${PORT}`);
});
