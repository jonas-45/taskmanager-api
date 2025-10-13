import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userModel from './model/user.js';
import jwt from 'jsonwebtoken';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(`DB connection error: ${err}`))

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.redirect('/login');
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
    //const {username, password} = req.body;
    res.render('login', {title: 'Login'});
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    try {
        if(user) {
            if(await bcrypt.compare(password, user.password)){
                //Generate jwt tokens
                const user = {email}
                const token = jwt.sign(user, process.env.JWT_SECRET);

                res.json({message: 'Password verified', success: true, token, redirect: `/dashboard?email=${email}`})
            }else {
                res.json({message: 'Invalid password'})
            }
        }else {
            res.json({message: 'User not defined'})
        }
    } catch (error) {
        res.json({message: `An error occured: ${error}`})
    }
    
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard.ejs', {title: 'Dashboard | Taskmanager', email: req.query.email});
})

function verifyToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];

    if (!token)
        res.status(401).json({message: 'Access denied, no token provided'})

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({message: 'Invalid or expired token'});
    }

    
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));