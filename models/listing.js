const { ref, types } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
        //type:String,
    //    filename:String,
    //     url:{
    //         type:String,
    //         default:"https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    //         set: (v)=> v==="" ? "https://unsplash.com/photos/the-sun-is-setting-over-the-horizon-of-a-tree-cKrlYuPEQis" : v,
    //     }
       // url:String,
       //default:"https://unsplash.com/photos/the-sun-is-setting-over-the-horizon-of-a-tree-cKrlYuPEQis",
    // set: (v)=> v==="" ? "https://unsplash.com/photos/the-sun-is-setting-over-the-horizon-of-a-tree-cKrlYuPEQis" : v,
    },
    price:Number,
    location:String,
    // country:String,
    country: {
        type: String,
        set: (v) => v.toLowerCase(), // Store country names in lowercase
    },

    reviews : [
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
        
    ],
    owner:{
          type:Schema.Types.ObjectId,
          ref:"User",
    },
    categories:{
        type:String,
        enum:["trending","rooms","iconic-cities","mountains","amazing-pools","temples","beach","hotels","restaurants","treking","monuments"],
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
     if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews }});
     }
});

const listing =mongoose.model("listing",listingSchema);
module.exports = listing;
