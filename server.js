const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);



mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB o');
});

mongoose.connection.on('error', (error)=>{
    console.error('Error connecting to MongoDB', error);
});

async function startServer(){
    await mongoose.connect(process.env.MONGO_URL);
    server.listen(
        PORT,()=>{
            console.log(`Server running o on port ${PORT}`);
        }
    )
}

startServer();




