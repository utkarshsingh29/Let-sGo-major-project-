const User=require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email,username});
         const registeredUser= await User.register(newUser,password);
         console.log(registeredUser);

         req.login(registeredUser,(err)=>{
          if(err){
            next(err);                                     //login after signup
          }
          req.flash("success","Welcome to Let'sGo!");
          res.redirect("/listings");
         });
    }catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/signup");
    }

};

module.exports.renderloginForm=(req,res)=>{
    // console.log(req.originalUrl);
      res.render("users/login.ejs");
};

module.exports.login= async(req,res)=>{
  
    // console.log("Authenticated User:", req.user);
    // console.log("Is Authenticated:", req.isAuthenticated());
    req.flash("success","Welcome back to Let'sGo!");
    let redirect=res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
         return next(err);
       }
       req.flash("success","logged you out!");
       res.redirect("/listings");
    });
};