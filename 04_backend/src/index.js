// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'
dotenv.config({
  path: './.env'
})

connectDB()
.then(()=>{
  console.log("Database connected successfully")
  app.on("error", (err)=>{
    console.log("error:", err);
    throw err
  })
  app.listen(process.env.PORT || 4000, ()=>{
    console.log(`Server is running at port ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("MONGODB CONNECTION Failed:", err);
})









// all This is a first approach without importing from different db file

// import {DB_NAME} from "./constants"
// import express from "express";
// const app = express()

// in general we connect db like this
// mongoose.connect(`${process.env.MONGO_DB_URL}`)
// or
// function connectDB(){
    
// }
// connectDB()

// A better aproach by using IIFE with using semi-colon before the code and using promise or try and catch.

/*;(async ()=>{
    try {
      await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
      app.on("error", (error)=>{
        console.log("error", error);
        throw error
      }) // handling if anything happen from express

      app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
      })

    } catch (error) {
        console.log("ERROR: ", error);
        throw error
    }
})()*/