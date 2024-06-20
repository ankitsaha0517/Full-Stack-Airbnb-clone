const express = require('express')
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js") //utils
const {isAuthenticated,isowner,validateListing} = require("../middleware/middlewares.js") //isAuthenticated -> login frist then create any thing
const listingController  = require('../controllers/listing.js') //listing Controller

const multer  = require('multer')
const {storage} = require('../cloudConfige.js')

const upload = multer({ storage })
const Listing = require('../model/listing.js')



router.route("/")
    .get(wrapAsync(listingController.index))// --INDEX LIST
    .post(isAuthenticated,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.CreateNewListing)); // --MAKE LIST


// --CREATE LIST
router.get("/new/list",isAuthenticated,listingController.RenderNewFrom); // -NEW LIST

router.route("/:category/filter")
        .get(listingController.filterOpction)
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show List
    .put(isowner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) // -Update list
    .delete(isAuthenticated,isowner,wrapAsync(listingController.deleteListing)) // --Delete list

// --UPDATE List
router.get("/:id/edit",isAuthenticated,isowner,wrapAsync(listingController.RenderEditFrom)) // -edit route






module.exports = router


