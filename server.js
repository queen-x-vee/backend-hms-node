import express from 'express';
import userRouter from './routes/user-routes.js';

const app = express();

app.listen(3000, () => {
    console.log('health management backend app listening at http://localhost:3000')
})

app.use(userRouter)