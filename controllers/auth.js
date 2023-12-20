const User=require('../models/user');
const {hashPassword,comparePassword}=require('../utils/auth');
const jwt =require("jsonwebtoken");

const register = async(req, res) =>
{
    try{
        const {name,email,password}=req.body;
        //Validation
        if(!name) return res.status(400).send(" Name is Required")
        if(!password||password.length<6){
            return res.status(400).send("Password is reqired and should be min 6 charector long");
        }

    let userExist=await User.findOne({email}).exec()
    if(userExist) return res.status(400).send("email is already exist")
    //hash password
        const hashedPassword=await hashPassword(password);

    // Register

    const user = new User({
        name,
        email,
        password:hashedPassword
    }).save();
    console.log(`Saved user ${user}`)
    return res.json({ok:true})
    }
    catch{
        (err)=>{
            console.log(err)
            return  res.status(400)
        }
    }
}

//login
const login=async(req,res)=>{
    try {
        //get data from req.body-
        const {email,password}=req.body;
        // check that our user is present or not (email check)
        const user= await User.findOne({email}).exec();
        if(!user){
        return res.status(400).send("user not Found");
        }
        //password check
        const match=await comparePassword(password,user.password);
        // create Signed JWT
        const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    // return user and token to client exclude hashed password
        user.password=undefined;
        // send token to cookies
        res.cookie("token",token,
        {httpOnly:true,
    // secure:true,
    // only works on https
    });
    res.json(user)                                                            
}
    catch(err){
        console.log(`Login Related Error:${err}`)
        return res.status(400).send("Try Again");
    }
}
module.exports = {register,login};


