import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import taskModel from './model/task.js';
import verifyToken from './middleware/auth.js';
import userRoutes from './routes/userRoutes.js';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(`DB connection error: ${err}`))

const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const PORT = process.env.PORT;

app.use(userRoutes);

app.get('/tasks', verifyToken, async (req, res) => {
    const id = req.user.userId;
    const tasks = await taskModel.find({createdBy: req.user.userId});
    //console.log(tasks);
    res.status(201).json({success: true, tasks});
})

app.get('/dashboard', (req, res) => {
    res.status(201).render('dashboard.ejs', {title: 'Dashboard | Taskmanager', email: req.query.email});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));