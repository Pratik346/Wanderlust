const User=require("../models/user.js");
module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const newuser=await User.register(newUser,password);
    console.log(newuser);
    req.login(newuser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","Welcome to Wanderlust!");
    res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("Success","Welcome to Wanderlust");
    let redireturl=res.locals.redirectUrl || "/listings";
    res.redirect(redireturl);
}
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);
        }
        req.flash("Success","Logged Out");
        res.redirect("/listings");
    });
}