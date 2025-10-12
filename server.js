import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(`DB connection error: ${err}`))

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.redirect('./login');
})

app.get('/signup', (req, res) => {
    res.render('signup', {title: 'Signup'});
})

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));