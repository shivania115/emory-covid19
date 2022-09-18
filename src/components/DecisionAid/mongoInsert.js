const Mongoose = require('mongoose')
const express = require('express')
const app = express.Router()
app.post('/stored', (req, res) => {
    console.log(req.body);
    db.collection('quotes').insertOne(req.body, (err, data) => {
        if(err) return console.log(err);
        res.send(('saved to db: ' + data));
    })
});