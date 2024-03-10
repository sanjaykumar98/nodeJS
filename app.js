const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
require('dotenv').config();
const userRouter = require('./routes/users');
const employeesRouter = require('./routes/employees');
const productsRoute = require('./routes/products');

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/users',userRouter);
app.use('/employees',employeesRouter);
app.use('/products',productsRoute);

app.listen(process.env.PORT || '3020', () => { console.log(`server listening at ${process.env.PORT || 3020}`) })