import mongoose from "mongoose";

const generateID = () => new mongoose.Types.ObjectId().toHexString()
export default generateID
