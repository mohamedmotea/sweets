import { Schema, model } from "mongoose";


const wishList_schema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  },
  products:[
    {type:Schema.Types.ObjectId,  ref: "Product",  required:true}
  ],
},{timestamps:true});

const WishList = model('WishList',wishList_schema);

export default WishList