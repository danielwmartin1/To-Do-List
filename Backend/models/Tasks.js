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
    type: String, // Change to String to store ISO string
    required: false,
    default: getFormattedDate,
  },
}, { timestamps: true }); // Add timestamps option

// Pre-save hook to format dueDate as ISO string
TaskSchema.pre('save', function (next) {
  if (this.dueDate) {
    this.dueDate = new Date(this.dueDate).toISOString();
  }
  next();
});

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;