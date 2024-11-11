if(process.env.NODE_ENV !="production") {
  require('dotenv').config();
}
const express= require("express");
const app=express();
const mongoose =require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
//const {listingSchema,reviewSchema} = require("./schema.js");
const Review=require("./models/review.js"); //requring review model....

const listingRouter=require("./routes/listing.js");  //requring routes listing
const reviewRouter=require("./routes/review.js"); //requring routes review..
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo'); //mongo session
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local"); //authentication...
const User=require("./models/user.js");





// const mongo_url="mongodb://127.0.0.1:27017/Let'sGo"; //local storage
const dbUrl=process.env.ATLASDB_URL;

main()
 .then(()=>{
  console.log("connection is established");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main() {
    await mongoose.connect(dbUrl);
    // await mongoose.connect(mongo_url);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true})); //parse data into url format
app.use(methodOverride("_method")); //to convert post into put...
app.engine("ejs",ejsMate); //for ejsmate
app.use(express.static(path.join(__dirname,"public"))); 

const store=MongoStore.create({
  mongoUrl:dbUrl,
    //  mongoUrl:mongo_url,
  crypto:{
   secret:process.env.SECRET,
  },
  touchAfter:24*3600,
 });

 store.on("error",()=>{
  console.log("error in mongo session store",error);
 });

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:Date.now() + 7*24*60*60*1000,
    httpOnly:true,
  },

};

app.get("/", (req,res)=>{
  res.redirect("/listings");
}
);


app.use(session(sessionOptions));
app.use(flash());
//always use passport after session middleware.
app.use(passport.initialize());   // Initialize Passport middleware correctly
app.use(passport.session());      // Enable persistent login sessions
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error"); //checking for flash..
  res.locals.currUser=req.user;

  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeUser= new User({
//     email:"student@gmail.com",
//     username:"student123",
//   });
//    let registered= await User.register(fakeUser,"helloworld");
//    res.send(registered);
// });


//middlewares for listing routes..
app.use("/listings",listingRouter);

//middleware for review routes..
app.use("/listings/:id/reviews",reviewRouter);

//middleware for user routes..
app.use("/",userRouter);

app.all("/*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!!"));

});

app.use((err, req, res, next)=>{

  let {statusCode=500, message="something went wrong!!"} =err;

  res.status(statusCode).render("error.ejs",{message});
  //res.status(statusCode).send(message);

});

app.listen(8080, ()=>{
    console.log("server is listening at port 8080");
});