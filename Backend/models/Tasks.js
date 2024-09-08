import mongoose, { get } from 'mongoose';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Function to get the current date in a specific timezone
const getFormattedDate = () => {
  const timeZone = 'America/New_York'; // Specify your desired timezone
  return formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ssXXX');
};

// Create a schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    default: getFormattedDate,
  },
  updatedAt: {
    type: String,
    default: getFormattedDate,
  },
  dueDate: {
    type: Date,
    required: false,
    default: getFormattedDate,
  },
}, { timestamps: true }); // Add timestamps option

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;