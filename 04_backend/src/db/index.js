import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async()=>{
    try {
          
       const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`) 

    // for more timeout
    //    const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`,  {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     serverSelectionTimeoutMS: 5000, // Set a higher value, e.g., 5000ms (5 seconds)
    //   }) 
       console.log(`\n MongoDD connected !! DB Host: ${connectionInstance.connection.host}`); //It contains the host or server address of the MongoDB database to which Mongoose is connected.
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1) //method instructs Node.js to terminate the process synchronously with an exit status of code
    }
}

export default connectDB