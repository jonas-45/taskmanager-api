import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(`DB connection error: ${err}`))

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.redirect('./login');
})

app.get('/signup', (req, res) => {
    res.render('signup', {title: 'Signup'});
})

app.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    console.log(req.body)
    res.json({message: 'Your data is successfully saved'});
})

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));