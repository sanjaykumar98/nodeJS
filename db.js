const { MongoClient } = require("mongodb");
require('dotenv').config();
const client = new MongoClient(process.env.URL);

const connect = async () => {
    try {
        await client.connect();
        console.log('connected to DB!');
    } catch (error) {
        console.log('db connection failed!', error);
    }
}

connect();
module.exports = { client }