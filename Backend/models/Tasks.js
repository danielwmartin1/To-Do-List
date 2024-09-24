import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

// Helper function to check if a date is valid
function isValidate(date) {
  return !isNaN(Date.parse(date));
}

// Helper function to format dates
function formatDate(date) {
  const format = 'MMMM d, yyyy h:mm a zzz';
  return formatInTimeZone(date, 'UTC', format);
}

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, set: (date) => isValidate(date) ? new Date(date) : date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, set: (date) => date && isValidate(date) ? new Date(date) : date },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field
TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to update the updatedAt field
TaskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date();
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.createdAt = formatDate(obj.createdAt);
  obj.dueDate = obj.dueDate ? formatDate(obj.dueDate) : null;
  obj.completedAt = obj.completedAt ? formatDate(obj.completedAt) : null;
  obj.updatedAt = formatDate(obj.updatedAt);
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;
