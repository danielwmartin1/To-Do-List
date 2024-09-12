import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

// Utility function to format dates in EST
const getFormattedDate = (date) => {
  const timeZone = 'America/New_York';
  return formatInTimeZone(date, timeZone, 'MMMM dd, yyyy hh:mm:ssa zzz');
};

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

// Pre-save hook to format dates
TaskSchema.pre('save', function (next) {
  if (this.dueDate) {
    this.dueDate = getFormattedDate(new Date(this.dueDate));
  }
  if (this.completed && !this.completedAt) {
    this.completedAt = getFormattedDate(new Date());
  }
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.createdAt = getFormattedDate(new Date(obj.createdAt));
  obj.updatedAt = getFormattedDate(new Date(obj.updatedAt));
  if (obj.dueDate) {
    obj.dueDate = getFormattedDate(new Date(obj.dueDate));
  }
  if (obj.completedAt) {
    obj.completedAt = getFormattedDate(new Date(obj.completedAt));
  }
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;