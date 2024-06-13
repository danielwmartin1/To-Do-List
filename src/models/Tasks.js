import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    //absent in the frontend
  },
});

const Tasks = mongoose.model('Tasks', TaskSchema);

module.exports = Tasks;
