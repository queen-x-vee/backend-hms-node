const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.middleware');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user-routes');
const productRouter = require('./routes/product-routes');
const cartRouter = require('./routes/cart-routes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://pharmacy-inventory-system-1vnk.onrender.com'
    ],
}));
app.use(morgan('combined'))


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/user', userRouter);
app.use('/api/product', productRouter)
app.use('/api/cart' , cartRouter)


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'index.html'));
});

app.use(errorHandler);

module.exports = app;
