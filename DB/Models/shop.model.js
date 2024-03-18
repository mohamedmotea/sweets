import { Schema, model } from "mongoose";

const shop_schema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  shop_name:{
    type:String,
    required:true,
    trim:true,
    unique:true
  },
  location:{
    type:String,
    required:true,
  },
  delivery_Number:{
    type:Array,
    required:true,
  }
},{timestamps:true})

const Shop = model('Shop',shop_schema)

export default Shop;