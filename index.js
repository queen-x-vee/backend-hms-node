import express from 'express';

const app = express();

const port = 3000;






app.listen(port, () => {
    console.log(`health management backend app listening at http://localhost:${port}`)
})