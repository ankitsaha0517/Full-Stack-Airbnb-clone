const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'airbnb_CLONDEV',
      allowerdFormates: ["png","jpg","jpeg"],
      transformation: [
        {width: 1000, crop: "scale"},
        {quality: "auto"},
        {fetch_format: "auto"}
        ]
    },
});



module.exports={cloudinary,storage}