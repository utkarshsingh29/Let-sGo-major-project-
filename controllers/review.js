const Listing=require("../models/listing.js"); //requring listing model
const Review=require("../models/review.js"); //requring review model....
module.exports.postReview=async(req,res)=>{
  
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
   
    listing.reviews.push(newReview);
  
    newReview.save();
    listing.save();
    req.flash("success","New review is added");
    res.redirect(`/listings/${listing._id}`);
      
};

module.exports.deleteReview=async(req,res)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //using mongo pull operator...
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
    res.redirect(`/listings/${id}`);
};