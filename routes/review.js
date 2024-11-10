const express= require("express");
const router=express.Router({mergeParams:true}); //mergeParams help to merge parent and child route..
//const Review=require("../models/review.js"); //requring review model....
const wrapAsync = require("../utils/wrapAsync.js");
//const ExpressError=require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js"); //joi schema
//const Listing=require("../models/listing.js"); //requring listing model
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware");

const reviewController=require("../controllers/review.js");

//review post route..
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));
  
//delete review route..
  
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;
