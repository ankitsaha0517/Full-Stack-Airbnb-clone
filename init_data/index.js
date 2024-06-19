const mongoose = require('mongoose')
const initdata = require("./data.js")
const Listing = require("../model/listing.js")
const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb'


main()
.then(()=>{
    console.log("C O N N E C T E D   W I T H   D B");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


const intDB = async(req,res) =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initdata.data)
    console.log("data was init");
}

intDB()