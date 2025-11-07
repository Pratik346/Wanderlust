if(process.env.NODE_ENV !="production"){
   require('dotenv').config(); 
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const session=require("express-session");
const mongostore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localstrategy=require("passport-local");
const User=require("./models/user.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const MongoStore = require('connect-mongo');
const dburl=process.env.ATLASDB_URL;
console.log(dburl);
async function main(){
    await mongoose.connect(dburl);
    console.log("Connected to database");
}
main().catch(err=>console.log(err));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",(err)=>{
    console.log("error",err);
});
const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("Success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});
app.get("/",(req,res)=>{
    res.send("Welcome to home page");
});
/*app.get("/demouser",async(req,res)=>{
    let fkuser=new User({
        email:"Student@gmail.com",
        username:"Sigma7Student"
    });
    let registeredUser=await User.register(fkuser,"helloworld");
    res.send(registeredUser);
});*/
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userrouter);
app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong!"}=err;
    res.render("error.ejs",{message})
    //res.status(status).send(message);
});
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});
