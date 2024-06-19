//Review Router

const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js") //utils
const {validateReview, isAuthenticated, isauthor} = require('../middleware/middlewares.js')
const reviewController = require('../controllers/review.js')


router.get("/",reviewController.goSameReview)

//add reviews
router.post("/",validateReview,isAuthenticated,wrapAsync(reviewController.createReview))

//delete reviews
router.delete("/:reviewId",isAuthenticated,isauthor,wrapAsync(reviewController.deleteReview))


module.exports = router