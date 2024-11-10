const Listing=require("../models/listing.js"); //requring listing model

module.exports.index=async(req,res)=>{
   
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=async(req,res)=>{
    
    res.render("listings/new.ejs");
};

module.exports.renderShowRoutes=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing)
    {
      req.flash("error","listing you requested does not exit!!");
      res.redirect("/listings");
    }
      console.log(listing);
      res.render("listings/show.ejs",{listing});
    
    
    
};

module.exports.createListing=async(req,res,next)=>{
     
    let url=req.file.path;
    let filename=req.file.filename;

    let listing = req.body.listing;
 
    //change by me
    if (!listing.image || !listing.image.url) {
     listing.image = {
         filename: listing.image?.filename || "",
         url: undefined, // This will trigger the default value in the schema
     };
 }
     
     let newListing=new Listing(listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};
     await newListing.save();
     req.flash("success","New listing is created!!"); //adding status to flash..
     res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;

    const listing= await Listing.findById(id);
    if(!listing)
    {
      req.flash("error","listing you requested does not exit!!");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
  
    let {id}=req.params;
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined") {
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","listing is updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
     let deletedList= await Listing.findByIdAndDelete(id);
     console.log(deletedList);
     req.flash("success","listing is deleted!!");
     res.redirect("/listings");
};

// module.exports.renderDestination=async(req,res)=>{
//      console.log(res.query.destination);
//      let destination=res.query.destination;
//      const allListings= await Listing.find({location:destination});
//     res.render("listings/destination",{allListings});

// };

module.exports.renderDestination = async (req, res) => {
    try {
        //const destination = req.query?.destination; // Optional chaining to safely access 'destination'
        const destination = req.query.destination.trim().toLowerCase();

        if (!destination) {
            // return res.status(400).send("Destination parameter is required.");
            req.flash("error","Please enter country name you want to see..");
            res.redirect("/listings");


        }
        console.log(destination);

        // Find listings where location matches the destination parameter
        const allListings = await Listing.find({ country: destination });

        // Render the template with the listings data
        if(allListings.length===0)
        {
            req.flash("error","You enter incorrect name or no listing is there with such name");
            res.redirect("/listings");
        }
        else{
            res.render("listings/destination.ejs", { allListings });
        }
        
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("An error occurred while fetching listings.");

    }
};

module.exports.renderCategory=async(req,res)=>{
       
       const category=req.params.category;
        const allListings = await Listing.find({ categories:category });

        if(allListings.length===0)
        {
            req.flash("error","Oosp at this time no such listings are exits");
            res.redirect("/listings");
        }
        else{
            res.render("listings/destination.ejs",{allListings}); // Return listings as JSON for frontend fetch
        }
        
      
    
};

