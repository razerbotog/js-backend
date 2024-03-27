// this is another approach using Promise
const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
          .catch((err)=>next(err))  //to pass the error to the next error-handling middleware.
    }
}


export {asyncHandler}


// higher order function
// const asyncHandler = (fn) => {(fn)=>{}}
// const asyncHandler = (fn) => (fn)=>{} // another syntax without curly bracket

// this is another approach using try catch
// const asyncHandler = (requestHandler) => async(req, res, next)=>{
//     try {
//         await requestHandler(req, res, next)
//     } catch (error) {
//         res.status(error.coden || 500).json({
//             success: true,
//             message: error.message
//         })
//     }
// }