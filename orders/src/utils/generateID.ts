import mongoose from "mongoose";

console.log("ddd")
const generateID = () => mongoose.Types.ObjectId().toHexString()
export default generateID
