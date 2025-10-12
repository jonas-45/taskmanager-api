import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userModel from './model/user.js';

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

    try {
        //check if user already exists
        const existingUser = await userModel.findOne({email})
        if(existingUser) 
            return res.send({message: 'User already exists', redirect: '/login'})

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save();
        console.log(req.body)
        res.json({message: 'Your data is successfully saved'});
    } catch (error) {
        res.json({message: 'registration failed, please try again'});
    }
    
})

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));