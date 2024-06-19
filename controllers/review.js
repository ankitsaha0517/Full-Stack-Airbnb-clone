//MODEL LISTING
const Listing = require('../model/listing.js')
const Review = require('../model/review.js')

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview  = new Review(req.body.review)
    newReview.author = req.user
    // push in listing review array
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    console.log("new review saved");
    req.flash('sucess','Review add successfully!')
    res.redirect(`/listing/${listing._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('sucess','Review deleted successfully!')
    res.redirect(`/listing/${id}`);
} 

module.exports.goSameReview = (req,res)=>{
    let {id} = req.params
    res.redirect(`/listing/${id}`)
}