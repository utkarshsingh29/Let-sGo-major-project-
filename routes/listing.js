const express= require("express");
const router=express.Router();
const Listing=require("../models/listing.js"); //requring listing model
const wrapAsync = require("../utils/wrapAsync.js");
//const {listingSchema} = require("../schema.js"); //joi schema..
const ExpressError=require("../utils/ExpressError.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware");

const listingContoller=require("../controllers/listings.js");

const multer  = require('multer'); //requiring multer middleware for multipart/form-data..

const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


//using router.routes
router.route("/")
  .get(wrapAsync(listingContoller.index)) //index route..
  .post(isLoggedIn,upload.single("listing[image][url]"),validateListing, wrapAsync(listingContoller.createListing));  //create listing
  

  //new routes
router.get("/new",isLoggedIn, wrapAsync(listingContoller.renderNewForm));

router.get("/categories/:category",wrapAsync(listingContoller.renderCategory));

router.get("/destination" ,wrapAsync(listingContoller.renderDestination));

router.route("/:id")
   .get(wrapAsync(listingContoller.renderShowRoutes))  //show routes..
   .put(isLoggedIn,isOwner,isLoggedIn,upload.single("listing[image][url]"),validateListing, wrapAsync(listingContoller.updateListing)) //update routes..
   .delete(isLoggedIn,isOwner,wrapAsync(listingContoller.deleteListing)); // delete routes

 //edit routes
router.get("/:id/edit",isOwner,wrapAsync(listingContoller.renderEditForm));





//index route...
//router.get("/", wrapAsync(listingContoller.index));


  
  //show routes..
// router.get("/:id",wrapAsync(listingContoller.renderShowRoutes));

  //create routes..
//router.post("/",isLoggedIn,validateListing, wrapAsync(listingContoller.createListing));


  
  // update routes
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingContoller.updateListing));
  
  //delete routes..
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingContoller.deleteListing));

module.exports=router;
