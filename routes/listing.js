const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.createnewlist));
router.get("/new",isLoggedIn,(listingcontroller.rendernewform));
router.route("/:id")
.get(wrapAsync(listingcontroller.showlist))
.put(isLoggedIn,isowner,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.editlisting))
.delete(isLoggedIn,isowner,wrapAsync(listingcontroller.destroylisting))
router.get("/:id/edit",isLoggedIn,isowner,wrapAsync(listingcontroller.getlisting));
router.get("/listings",wrapAsync(listingcontroller.index))
module.exports=router;