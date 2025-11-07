const listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.addreview=async(req,res)=>{
    let list=await listing.findById(req.params.id);
    /*console.log(req.params);
    console.log(req.body);*/
    let newReview=new Review(req.body.review);
    /*console.log(newReview);*/
    newReview.author=req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("Success","New Review Added Successfully!")
    res.redirect(`/listings/${req.params.id}`);
}
module.exports.destroyreview=async(req,res)=>{
    console.log(req.params);
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}