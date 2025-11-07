const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isauthor,validatereview}=require("../middleware.js")
const reviewcontroller=require("../controllers/review.js")
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewcontroller.addreview));
router.delete("/:reviewId",isLoggedIn,isauthor,wrapAsync(reviewcontroller.destroyreview));
module.exports=router;