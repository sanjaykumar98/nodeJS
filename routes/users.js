const express = require('express');
const app = express();
const { client } = require('../db');
const db = process.env.DB_NAME;
const collectionName = "test";

// users homepage
app.get('/', async (req, res) => {
    try {
        const users = await client.db(db).collection(collectionName).find({}).toArray();
        res.status(200).render('../views/users', { users });
    } catch (error) {
        res.status(404).json(error);
    }
})

// get all
app.get('/all', async (req, res) => {
    try {
        const users = await client.db(db).collection(collectionName).find({}).toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json(error);
    }
})

// get by name
app.get('/:name', async (req, res) => {
    const params = req.params;
    try {
        const user = await client.db(db).collection(collectionName).findOne({ name: params?.name });
        if (!user) throw `User not found with ${params?.name}`;
        res.status(200).json(user)
    } catch (error) {
        res.status(404).send(error);
    }
})

// insertOne
app.post('/', async (req, res) => {
    const data = req.body
    try {
        const isAvailable = await client.db(db).collection(collectionName).findOne({ name: data.name });
        if (isAvailable) throw 'User already exists with same name!';
        const response = await client.db(db).collection(collectionName).insertOne(data);
        res.status(201).json('Inserted Successfully', response);
    } catch (error) {
        res.status(500).send(error);
    }
})

//insert many 
app.post('/many',async(req,res)=>{
    try {
        const toInsert = await client.db(db).collection(collectionName).insertMany(req.body);
        if(!toInsert) throw 'Unable to insert!'
        res.status(200).send('Multiple data inserted!')
    } catch (error) {
        res.status(400).send(error);
    }
})

// update one
app.patch('/:name', async (req, res) => {
    const userName = req?.params?.name;
    try {
        const isAvailable = await client.db(db).collection(collectionName).findOne({ name: userName });
        if (!isAvailable) throw `User not found with ${userName} to update!`;
        const toUpdate = await client.db(db).collection(collectionName).updateOne({name:userName},{$set:req?.body});
        if (!toUpdate) throw 'something went wrong!';
        res.status(200).send('User details updated succesfully!');
    } catch (error) {
        res.status(500).send(error);
    }
})

// delete by name
app.delete('/:name',async(req,res)=>{
    try {
        const isAvailable = await client.db(db).collection(collectionName).findOne({name:req.params.name});
        if(!isAvailable) throw 'User not found!';
        const toDelete = await client.db(db).collection(collectionName).deleteOne({name:req.params.name});
        if(toDelete.deletedCount <= 0) throw 'Something went wrong!';
        res.status(200).send('User deleted!');        
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = app;