const express= require("express");
const router=express.Router();
// const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js");


//using router.route
router.route("/signup")
  .get(userController.renderSignUpForm) //signup form
  .post(wrapAsync(userController.signUp)); //save data

router.route("/login")
  .get(userController.renderloginForm)
  .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true,}), userController.login);

  //logout..
router.get("/logout",userController.logout);

//signup form..
// router.get("/signup",userController.renderSignUpForm);

//save data..
// router.post("/signup", wrapAsync(userController.signUp));

//login form
// router.get("/login",userController.renderloginForm);
 
//passport.authenticate is used as a middleware to authentication...
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true,}), userController.login);

// router.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//       if (err) { return next(err); }
//       if (!user) {
//         console.log("Authentication failed:", info);
//         req.flash("error", "Incorrect username or password.");
//         return res.redirect("/login");
//       }
//       req.logIn(user, (err) => {
//         if (err) { return next(err); }
//         console.log("Authenticated User:", user);
//         console.log("Is Authenticated:", req.isAuthenticated());
//         req.flash("success", "Welcome back to Let'sGo!");
//         return res.redirect("/listings");
//       });
//     })(req, res, next);
//   });
module.exports=router;