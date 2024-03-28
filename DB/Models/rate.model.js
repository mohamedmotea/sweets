import { Schema, model } from "mongoose";


const rate_schema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  productId:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },
  rating:{
    type:Number,
    required:true,
    min:1,
    max:5,
    default:1
  }

},{timestamps:true})

const Rate = model("Rate",rate_schema);

export default Rate;