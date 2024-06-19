if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
} 

const express = require('express')
const mongoose = require('mongoose')
const app  = express()
const path = require("path")
const methodOverride = require('method-override')
const engine = require('ejs-mate')
//utils
const ExpressError = require('./utils/ExpressError.js')
//express-sessio n required
const session = require('express-session')
const MongoStore = require('connect-mongo');
//flach msg
const flash = require('connect-flash');
//passport of Authentication and authorization
const passport = require('passport')


const DbUrl = process.env.ATLAS_DB_URL

// routing
const listingR = require('./router/listing.js')
const reviewR = require('./router/review.js')
const UserR = require('./router/user.js')

const store = MongoStore.create({
    mongoUrl: DbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter:24 * 3600,   
})
store.on("error",()=>{
    console.log('Error on MONGO SESSION STORE',err);
})
const sessionOpction = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {   
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}


//MIDELLWARES
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')))
//session middellwares
app.use(session(sessionOpction))
app.use(flash());

// passport middel ware
app.use(passport.initialize());
app.use(passport.session());




app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})



//CONNECTION WITH DB
main()
.then(()=>{
    console.log("C O N N E C T E D  -  W I T H  -  D B");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(DbUrl);
}






app.get("/",(req,res)=>{
    res.redirect("/listing")
})

//routing midell-ware
app.use("/listing",listingR)
app.use("/listing/:id/review",reviewR)
app.use("/",UserR)








app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

//--Error validiction midellware
app.use((err,req,res,next)=>{
    let{statuscode = 500 , message= "Somthing Went Wrong"} = err
    res.status(statuscode).render("./listings/error.ejs",{message})
})




app.listen(process.env.PORT, () => {
    console.log(`S E V E R  C O N E T E D`)
})

