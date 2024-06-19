//MODEL LISTING
const Listing = require('../model/listing.js')
const {cloudinary} =require('../cloudConfige.js')
const maptilerClient = require('@maptiler/client')



module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs",{allListings})
}

module.exports.RenderNewFrom = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.CreateNewListing = async (req,res)=>{
    maptilerClient.config.apiKey = process.env.MAP_TILER_API_KEY;
    const result = await maptilerClient.geocoding.forward(req.body.listing.location,{limit:1});
    //cloudiany Image 
    let url = req.file.path
    let filename = req.file.filename
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user
    newListing.image = {url,filename}
    //map
    newListing.geometry = result.features[0].geometry
    await newListing.save()
    req.flash('sucess','List created successfully!')
    res.redirect("/listing")
}

module.exports.showListing = async(req,res) => {
    let{id} = req.params
    const listing =  await Listing.findById(id).populate({path: "reviews",populate:{path:"author"},}).populate("owner")
    if(!listing){
        req.flash('error','List you requested for does not exist!')
        res.redirect("/listing")
    }
    res.render("./listings/show.ejs",{listing})
}

module.exports.RenderEditFrom = async(req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id)
    let slatedImg = listing.image.url
    slatedImg = slatedImg.replace("/upload","/upload/c_limit/q_25/w_400/f_auto");
    if(!listing){
        req.flash('error','List you requested for does not exist!')
         res.redirect("/listing")
    }
    res.render("./listings/edit.ejs",{listing,slatedImg})
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(req.file){
        let deletedFilename = listing.image.filename
        let result = await cloudinary.uploader.destroy(deletedFilename)
        console.log(result);
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url,filename}
        await listing.save()
    }
    req.flash('sucess','List updated successfully!')
    res.redirect(`/listing/${id}`)
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params
    let Dlisting = await Listing.findById(id)
    let deletedFilename = Dlisting.image.filename
    let result = await cloudinary.uploader.destroy(deletedFilename)
    console.log(result)
    let deletedListing = await Listing.findByIdAndDelete(id)
    req.flash('sucess','List deleted successfully!')
    res.redirect(`/listing`)
}

module.exports.filterOpction = async(req,res)=>{
    const category = req.params.category;
    const allListings = await Listing.find({ category: category });
    res.render("./listings/index.ejs", { allListings });
}