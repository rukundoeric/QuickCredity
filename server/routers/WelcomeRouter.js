import express from 'express';
//const express=require('express');
//const user=require('./../controlers/User')

const router = express.Router();
//ROuters for models(V1)
router.get('/',(req,res)=>{
    res.send({
        Status:200,
        Message:"Welcome to Quick Credit"
    })
});

export default router;