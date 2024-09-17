import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, set: (date) => isValidDate(date) ? new Date(date) : date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, set: (date) => date && isValidDate(date) ? new Date(date) : date },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the updatedAt field
TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

TaskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date();
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.createdAt = formatInTimeZone(obj.createdAt, clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
  obj.dueDate = obj.dueDate ? formatInTimeZone(obj.dueDate, clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  obj.completedAt = obj.completedAt ? formatInTimeZone(obj.completedAt, clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  obj.updatedAt = formatInTimeZone(obj.updatedAt, clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
  return obj;
};

// Helper function to check if a date is valid
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;