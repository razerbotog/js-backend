import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET   
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded succesfully
        console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)//delete the local copy of the image after it's been uploaded to Cloudinary
        return  response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved file as the operation got failed
    }
}

const deleteOnCloudinary = async (publicId) => {
    try {
        if(!publicId) return null
        // delete file in cloudinary
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"
        })
        console.log(response);
        return response

    } catch (error) {
        console.log("Error while deleting from Cloudinary: ", error);
    }
}

export {uploadOnCloudinary, deleteOnCloudinary};
