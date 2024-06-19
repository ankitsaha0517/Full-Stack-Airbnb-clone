//utills
const ExpressError = require('../utils/ExpressError.js')
//Server site validation
const {listingSchema,reviewSchema} = require('../schemaValidator.js');
//MongoDB Model
const Listing = require('../model/listing.js')
const Review = require("../model/review.js")

const {cloudinary} = require('../cloudConfige.js')


module.exports.isAuthenticated = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error','You must be logged in to created list')
        return res.redirect("/login")
    }
    next()
}

module.exports.saveReditredUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}
module.exports.isowner = async(req,res,next)=>{
    let {id} = req.params
    const listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','You are not the owner of this listing! ') 
        return res.redirect(`/listing/${id}`)
    } 
    next()
}

//listing server side validiction
module.exports.validateListing =  async(req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        if (req.file) {
            let deletedFilename = req.file.filename
            let result = await cloudinary.uploader.destroy(deletedFilename)
            console.log(result);
        }
        let errMsg  = error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400, errMsg)) ;
    }
    else{
        next();
    }
}

//review server side validiction 
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg  = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}
module.exports.isauthor = async(req,res,next)=>{
    let {id,reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash('error','You are not the owner of this review! ') 
        return res.redirect(`/listing/${id}`)
    } 
    next()
}