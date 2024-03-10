const express = require('express');
const { client } = require('../db');
const app = express();
const db = process.env.DB_NAME;
const collectionName = 'products';

app.get('/', async (req, res) => {
    try {
        const products = await client.db(db).collection(collectionName).find({}).toArray();
        res.status(200).render('../views/products', { products });
    } catch (error) {
        res.status(400).json(error);
    }
})

app.get('/all', async (req, res) => {
    try {
        const data = await client.db(db).collection(collectionName).find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
})

app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await client.db(db).collection(collectionName).findOne({ id: +id });
        if (!product) throw 'not found!';
        res.status(200).json(product);
    } catch (error) {
        res.status(404).send(error);
    }
})

app.post('/', async (req, res) => {
    try {
        const data = await client.db(db).collection(collectionName).insertOne(req.body);
        if (!data) throw 'something went wrong!';
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
})

app.patch('/', async (req, res) => {
    try {
        const data = await client.db(db).collection(collectionName).findOneAndUpdate({ id: +req.body.id }, { $set: req.body });
        if (!data) throw 'entry not found!';
        res.status(200).send('updated!');
    } catch (error) {
        res.status(404).send(error);
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const toDelete = await client.db(db).collection(collectionName).findOneAndDelete({ id: +req.params.id });
        if (!toDelete) throw 'data not found!';
        res.status(200).send('Deleted!');
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = app;