import mongoose from "mongoose";

const Scheme = mongoose.Schema;

const taskSchemer = new Scheme({
    title: {type: String, required: true},
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    },
    priorty: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    duedate: {type: Date},
    description: {
        type: String,
    },
    completedAt: {type: Date}
});

const taskModel = mongoose.model('task', taskSchemer);

export default taskModel;