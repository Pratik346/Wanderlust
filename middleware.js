const listing=require("./models/listing.js");
const Review=require("./models/review.js");
const expresserr=require("./utils/Expresserr.js");
const {reviewSchema,listingSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Login or SignUp to Create Listings");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let currlist=await listing.findById(id);
    if(!currlist.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You are not the Owner of Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isauthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let currlist=await Review.findById(reviewId);
    if(!currlist.author._id.equals(res.locals.curruser._id)){
        req.flash("error","You are not the Author of Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserr(400,errmsg);
    }else{
        next(); 
    }
}
module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserr(400,errmsg);
    }else{
        next();
    }
};