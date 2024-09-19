import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Helper function to check if a date is valid
function isValidate(date) {
  return !isNaN(Date.parse(date));
}

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, set: (date) => isValidate(date) ? new Date(date) : date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, set: (date) => date && isValidate(date) ? new Date(date) : date },
  updatedAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
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
  obj.createdAt = formatInTimeZone(this.createdAt, timezone, 'MMMM d, yyyy h:mm a zzz');
  obj.dueDate = obj.dueDate ? formatInTimeZone(this.dueDate, timezone, 'MMMM d, yyyy h:mm a zzz') : null;
  obj.completedAt = obj.completedAt ? formatInTimeZone(this.completedAt, timezone, 'MMMM d, yyyy h:mm a zzz') : null;
  obj.updatedAt = formatInTimeZone(this.updatedAt, timezone, 'MMMM d, yyyy h:mm a zzz');
  obj.priority = this.priority; // Include priority
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;