const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const User = require('../model/user');
const LocalStrategy = require('passport-local');
const { saveReditredUrl } = require('../middleware/middlewares.js');

const userController = require('../controllers/user.js')


// passport midelwares
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.route('/signup')
    .get(userController.renderSignupFrom)
    .post(wrapAsync(userController.signup));

router.route('/login')
    .get(userController.renderLogInFrom)
    .post(saveReditredUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),userController.logIn)


router.get('/logout',userController.logOut)

module.exports = router;
