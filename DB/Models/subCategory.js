
import { Schema, model } from 'mongoose';

const subCategory_schema = new Schema({
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
  },
  categoryId:{
    type:Schema.Types.ObjectId,
    ref:'Category',
    required:true,
  }
  
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})
subCategory_schema.virtual('products',{
  ref:'Product',
  localField:'_id',
  foreignField:'subCategoryId'
})

const SubCategory = model('SubCategory',subCategory_schema)

export default SubCategory