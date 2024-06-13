import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    
});

const tasks = mongoose.model('Tasks', todoSchema);

module.exports = Tasks;
