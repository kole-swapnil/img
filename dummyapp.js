const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const S3 = require("aws-sdk/clients/s3");
const AWS = require("aws-sdk");


AWS.config.update({
    region: "us-east-1",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "us-east-1:f7692b7a-0050-4823-9df7-1ab52e23b6c9"
    }),
  });
const s3 = new S3();

const uploadFile = async (file, callback) => {
    let newfilename = `image_${Date.now()}${(path.extname(file.originalname)).toLowerCase()}`;
    let params = {
    ACL: 'public-read',
    Bucket: "superworldapp",
    Key: "marketplace/" + newfilename,
    ContentType: file.type,
    Body: file,
  };

  s3.putObject(params, function (err, data) {
    console.log("err: ", err);
    if (err) {
      console.log("error :", err);
    } else {
        callback(`https://superworldapp.s3.amazonaws.com/marketplace/${newfilename}`);
   }
  });

  
}
  
// const storage = multer.diskStorage({
//     destination : './upload/images',
//     filename : (req ,file,cb) => {
//         return cb(null,`image_${Date.now()}${(path.extname(file.originalname)).toLowerCase()}`)
//     }
// })

// const upload = multer({
//     storage : storage
// })

app.use('/profile',express.static('upload/images'));

app.post("/upload",(req,res) => {
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