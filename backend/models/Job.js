import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
    },
    salary: {
      type: String,
      default: 'Not disclosed',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      required: [true, 'Job type is required'],
    },
    techStack: [String],
    experience: {
      type: String,
      default: 'Entry Level',
    },
    applicationDeadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add text index for search functionality
jobSchema.index({ 
  title: 'text', 
  company: 'text', 
  description: 'text',
  techStack: 'text',
  location: 'text'
});

const Job = mongoose.model('Job', jobSchema);

export default Job;

console.log('Job model created');