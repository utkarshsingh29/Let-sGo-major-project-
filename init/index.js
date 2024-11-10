const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/Let'sGo";

main()
 .then(()=>{
  console.log("connection is established");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main() {
    await mongoose.connect(mongo_url);
}                                                                   //data ko initialised karta hai...

const initDb =async() =>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({...obj,owner:"6721e4289bd412f8beb97ff2",})); //addiding owner to every listings.
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDb();