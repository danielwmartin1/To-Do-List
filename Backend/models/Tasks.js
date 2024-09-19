import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

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

// Middleware to update the updatedAt field
TaskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date();
  next();
});

// Middleware to update the createdAt field
TaskSchema.pre('createdAt', function(next) {
  this.createdAt = new Date();
  next();
});

// Middleware to update the completedAt field
TaskSchema.pre('completedAt', function(next) {
  this.completedAt = new Date();
  next();
});

// Middleware to update the priority field
TaskSchema.pre('priority', function(next) {
  this.priority = this.priority || 'low';
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  const format = 'MMMM d, yyyy h:mm a zzz';
  obj.createdAt = formatInTimeZone(this.createdAt, 'UTC', format);
  obj.dueDate = obj.dueDate ? formatInTimeZone(this.dueDate, 'UTC', format) : null;
  obj.completedAt = obj.completedAt ? formatInTimeZone(this.completedAt, 'UTC', format) : null;
  obj.updatedAt = formatInTimeZone(this.updatedAt, 'UTC', format);
  obj.priority = this.priority;
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;