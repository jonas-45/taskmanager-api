import { Router } from 'express';
import verifyToken from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import userModel from '../model/user.js';
import taskModel from '../model/task.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/login');
})

router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Signup'});
})

router.post('/signup', async (req, res) => {
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

router.get('/login', (req, res) => {
    //const {username, password} = req.body;
    res.render('login', {title: 'Login'});
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    try {
        if(user) {
            if(await bcrypt.compare(password, user.password)){
                //Generate jwt tokens
                const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

                res.json({message: 'Password verified', success: true, token, redirect: "/dashboard" })
            }else {
                res.json({message: 'Invalid password'})
            }
        }else {
            res.json({message: 'User not defined'})
        }
    } catch (error) {
        res.json({message: `An error occured: ${error}`})
    }
    
});

router.post('/add', verifyToken, async (req, res) => {
    console.log("Decoded user:", req.user);
    try {
        const {title, description, priorty, duedate} = req.body;
        const newTask = new taskModel({
            title,
            description,
            priorty,
            duedate,
            createdBy: req.user.userId
        });

        await newTask.save()
        res.status(201).json({success: true, message: 'task sucessfully saved'})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Error creating task', error})
    }

})

export default router;