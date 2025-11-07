const express=require("express");
const app=express();
const path=require("path");
const flash=require("connect-flash");
const session=require("express-session");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(session({
    secret:"MysecretString",
    resave:false,
    saveUninitialized:true
}));
app.use(flash());
/*app.get("/",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You Sent request ${req.session.count} times`);
});*/
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","User not registered!");
    }else{
        req.flash("success","Registration Successful!");
    }
    res.redirect("/welcome");
});
app.get("/welcome",(req,res)=>{
    res.locals.successmsg=req.flash("success");
    res.locals.errormsg=req.flash("error");
    res.render("page.ejs",{name: req.session.name});
});
app.listen(3000,()=>{
    console.log("app is listening to port 3000");
});