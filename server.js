const http = require('http');

const app = require('./index');

const mongoose = require('mongoose');

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://hms-api:9YqzjKCDmTm0kEV3@hms-cluster-one.cu9iuvz.mongodb.net/?retryWrites=true&w=majority&appName=hms-cluster-one'

const server = http.createServer(app);

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB o');
});

mongoose.connection.on('error', (error)=>{
    console.error('Error connecting to MongoDB', error);
});

async function startServer(){
    await mongoose.connect(MONGO_URL);
    server.listen(
        PORT,()=>{
            console.log(`Server running o on port ${PORT}`);
        }
    )
}

startServer();




