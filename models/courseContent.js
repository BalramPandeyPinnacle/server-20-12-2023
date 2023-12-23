// models/courseContent.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const daySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    topics: [topicSchema],
  });

const courseContentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  days: [daySchema],
});

const CourseContent = mongoose.model('CourseContent', courseContentSchema);

module.exports = CourseContent;
