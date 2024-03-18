import { Schema, model } from "mongoose";
import { systemRole } from "../../src/utils/system.js";

const user_schema = new Schema({
  userName:{
    type:String,
    required:true,
    trim:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    minLength:3
  },
  role:{
    type:String,
    enum:Object.values(systemRole),
    default:systemRole.USER
  },
  phoneNumber:{
    type:String,
    minLength:11,
  },
  isLoggedIn:{
    type:Boolean,
    default:false
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
  isEmailVerified:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

const User = model('User',user_schema)

export default User