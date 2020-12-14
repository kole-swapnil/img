const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");

  
const storage = multer.diskStorage({
    destination : './upload/images',
    filename : (req ,file,cb) => {
        return cb(null,`image_${Date.now()}${(path.extname(file.originalname)).toLowerCase()}`)
    }
})

const upload = multer({
    storage : storage
})

app.use('/profile',express.static('upload/images'));

app.post("/upload",upload.single('profile'),(req,res) => {
    console.log("req",req.file)
    uploadFile(req.file, function(url){
        res.json({
            success : 1,
            profile_url: url
        })    
    });
    
})

app.listen(4000, () => {
    console.log("server up and running");
})