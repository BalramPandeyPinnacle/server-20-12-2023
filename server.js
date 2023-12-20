const express=require('express');
const cors=require('cors');
const morgan =require('morgan');
const { readdirSync } = require('fs');
const mongoose=require('mongoose');
const Course=require('./models/course');
const User=require('./models/user');
require('dotenv').config();
//create express app
const app=express();
//DataBase
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
  })
  .then(() =>
  console.log("**** Database Connected ****"))
  .catch((error) => console.log(`*** Database Connection Error: ${error} ***`));
// apply Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req,res,next)=>{
console.log("Middleware Function");
next();
})

app.post("/add-course",async(req,res)=>{
  try{
    const course=new Course(req.body);
    const result=course.save();
    res.send(course);
  }
  catch(err){
    console.log(err);
  }

})
app.get("/courses",async(req,res)=>{
  const courses= await Course.find();
  res.send(courses);
})

app.get("/course/:id",async(req,res)=>{
    const result=await Course.findOne({_id:req.params.id});
  if(result){
  res.send(result)
  } 
  else{
    res.send({message: "No Course Found "})
  }
})

app.get("/student",async(req,res)=>{
  const student= await User.find();
  res.send(student);
})

app.delete('/course/:id',async(req,res)=>{
const result= await Course.deleteOne({_id:req.params.id});
  res.send(result); 0
});


app.put('/course/:id',async(req,res)=>{
  let result=await Course.updateOne({_id:req.params.id},{$set:req.body});
  res.send(result);
})
app.get("/recentCourses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: 1 });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error"});
  }
})

// Fetch items in descending order of the createdAt timestamp
app.get("/recentCoursesDescending", async (req, res) => {
  try {
    const coursesDescending = await Course.find().sort({ createdAt: -1 });
    res.json(coursesDescending);
  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Filtering ssc courses
app.get("/courses/ssc", async (req, res) => {
  try {
    const sscCourses = await Course.find({ category:"ssc" });
    res.json(sscCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Buy this course route
app.post("/purchase/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Find the user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    // Check if both user and course exist
    if (!user || !course){
      return res.status(404).json({ error: 'User or Course not found' });
    }

    // Check if the course is not already purchased by the user
    if (!user.purchasedCourses.includes(courseId))
    {
      // Add the course ID to the purchasedCourses array
      user.purchasedCourses.push(courseId);

      // Save the updated user
      await user.save();

      // You can add any other logic related to the purchase here, such as updating course details, handling payments, etc.

      // Return a success response
      return res.json({ message: 'Purchase successful', user });
    } else {
      // Handle the case where the course is already in the purchasedCourses array
      return res.status(400).json({ error: 'Course already purchased by the user' });
    }
  } catch (error) {
    console.error('Error purchasing course:', error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
});



//filtering railway

app.get("/courses/railway", async (req, res) => {
  try {
    const RailwayCourses = await Course.find({ category: "railway" });
    res.json(RailwayCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//Search API
app.get('/search/:key',async(req,res)=>{
  let result=await Product.find({
    "$or":[
      {name:{$regex:req.params.key.toUpperCase()}},
      {name:{$regex:req.params.key.toLowerCase()}},
      {name:{$regex:req.params.key}},
      {category:{$regex:req.params.key.toUpperCase()}},
      {category:{$regex:req.params.key.toLowerCase()}},
      {category:{$regex:req.params.key}}
    ]
  });
  res.send(result);
})


//routes
readdirSync("./routes").map((r)=>app.use("/api",require(`./routes/${r}`)));
//PORT
const port = process.env.PORT||8000;
app.listen(port,()=>{
console.log (`server is running on port ${port}`);
})