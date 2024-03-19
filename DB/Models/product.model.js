
import { Schema, model } from 'mongoose';


const product_schema = new Schema({
  addedBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  name:{
    type:String,
    required:true,
    trim:true,
  },
  slug:{
    type:String,
  },
  description:{
    type:String,
    required:true,
    trim:true,
  },
  price:{
    type:Number,
    required:true,
    default:0,
    min:0,
  },
  categoryId:{
    type:Schema.Types.ObjectId,
    ref:'Category',
    required:true,
  },
  subCategoryId:{
    type:Schema.Types.ObjectId,
    ref:'SubCategory',
    required:true,
  },
  image:{
    secure_url:{type:String, required:true},
    public_id:{type:String, required:true},
  },
  imageCover:[
    {  secure_url:{type:String},
    public_id:{type:String},
   }
  ],
  folderId:{type:String, required:true},
  avgRating:{
    type:Number,
    min:0,
    max:5,
    default:0,
  },
  stock:{
    type:Number,
    required:true,
    default:0,
    min:0,
  },
  discount:{type:Number,min:0,default:0}

},{timestamps:true})

product_schema.pre('save',function(next,_){ 
  this.slug = this.name.replace(' ','-')
  next()
})

const Product = model('Product',product_schema)

export default Product