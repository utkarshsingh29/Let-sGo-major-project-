const Listing=require("./models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js"); //joi schema..
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review.js");

const isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated())
    { 
        req.session.redirectUrl=req.originalUrl; //paths stores in originalUrl
        console.log(req.originalUrl);
        req.flash("error","you need to logged in before adding listing");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

const isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error","you are not owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    
    if(error)
    {
      const errMsg=error.details.map((el)=>el.message).join(","); //validating listing at server side
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
};

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    
    if(error)
    {
      const errMsg=error.details.map((el)=>el.message).join(","); // validating review at server side
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
};

const isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review= await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error","you did not post this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports={isLoggedIn,saveRedirectUrl,isOwner,validateListing,validateReview,isReviewAuthor};