import mongoose from 'mongoose';

const TasksSchema = new mongoose.Schema({
  id: {
    type: Number,
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
  }
});

const TasksSchema = mongoose.model('TasksSchema', TasksSchema);

export default TasksSchema;
