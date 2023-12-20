const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseTitle: String,
    courseDetails: String,
    teacherName: String,
    category:String,
    rating: String,
    price: String,
    mrp: String,
},{ timestamps:{ createdAt: 'created_at', updatedAt: 'updated_at'}});
    module.exports = mongoose.model("Course", courseSchema);