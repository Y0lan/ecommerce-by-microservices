import mongoose from "mongoose";

const generateID = () => mongoose.Types.ObjectId().toHexString()
export default generateID
