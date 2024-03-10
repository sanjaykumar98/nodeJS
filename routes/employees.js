const express = require('express');
const { client } = require('../db');
const { error } = require('console');
const app = express();
const db = process.env.DB_NAME;
const collectionName = "employees";

app.get('/',async(req,res)=>{
    try {
        const employees = await client.db(db).collection(collectionName).find({}).toArray();
        res.status(200).render("../views/employees",{employees});
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get('/all',async(req,res)=>{
    try {
        const employees = await client.db(db).collection(collectionName).find({}).toArray();
        res.status(200).json(employees);
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get('/:id',async(req,res)=>{
    try {
        const employee = await client.db(db).collection(collectionName).findOne({id:+req.params.id});
        if(!employee) throw 'not found!'
        res.status(200).json(employee);
    } catch (error) {
        res.status(404).send(error);
    }
})


app.post('/',async(req,res)=>{
    try {
        const payload = req.body;
        const isInserted = await client.db(db).collection(collectionName).insertOne(payload);
        if(!isInserted) throw 'something went wrong!';
        res.status(201).json('data Inserted !');
    } catch (error) {
        res.status(400).json(error);
    }
})

app.patch('/',async(req,res)=>{
    const id = req.body.id
    try {
        const data = await client.db(db).collection(collectionName).findOneAndUpdate({id:+id},{$set:req.body});
        if(!data) throw 'not found!';
        res.status(200).json('updated successfully!');
    } catch (error) {
        res.status(404).json(error);
    }
})

app.delete('/:id',async(req,res)=>{
    const id = req.params.id;
    try {
        const toDelete = await client.db(db).collection(collectionName).findOneAndDelete({id:+id},{$set:req.body});
        if(!toDelete) throw 'not found!';
        res.status(200).send('entry deleted!');
    } catch (error) {
        res.status(404).send(error);        
    }
})

module.exports = app;