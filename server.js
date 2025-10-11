import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(`DB connection error: ${err}`))

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('You are welcome');
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));