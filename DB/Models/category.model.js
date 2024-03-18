
import { Schema, model } from 'mongoose';

const category_schema = new Schema({
  name:{
    type:String,
    required:true,
    trim:true,
    unique:true,
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  }
  
},{timestamps:true})

const Category = model('Category',category_schema)

export default Category