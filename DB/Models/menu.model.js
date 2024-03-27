
import { Schema, model } from 'mongoose';
const menu_schema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  shopId:{
    type:Schema.Types.ObjectId,
    ref:'Shop',
    required:true,
  },
  image:[{
    secure_url:{type:String, required:true},
    public_id:{type:String, required:true},
  }],
  folderId:{type:String, required:true}
},{timestamps:true})

const Menu = model('Menu',menu_schema)

export default Menu;