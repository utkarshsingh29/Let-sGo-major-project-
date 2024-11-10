const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,  //you no need to define schema for username and password ,passport local mongoose already define it.
        required:true
    },
});

userSchema.plugin(passportLocalMongoose); //explain above..
module.exports = mongoose.model('User', userSchema);

