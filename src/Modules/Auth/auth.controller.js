import {OAuth2Client} from 'google-auth-library';
import User from './../../../DB/Models/user.model.js';
import verifyEmailService from './utils/verifyEmail.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { systemRole } from '../../utils/system.js';
import uniqueString from './../../utils/generate-unique-string.js';
export const signUp = async (req, res, next) => {
  // destructuring the required data from request body
  const {userName,email,password,phoneNumber,role} = req.body
  // check if email exist
  const user = await User.findOne({email})
  if(user) return next(new Error('هذا البريد مستخدم',{cause:409}))
    // verify Email -> send code in email
    const verify = await verifyEmailService(email,req)
    // check is email valid
    if(!verify) return next(new Error('خطأ ف التحقق',{cause:400})) 
    // Hashed password 
    const hashedPassword = bcrypt.hashSync(password,+process.env.SALT_ROUNDES)
    if(!hashedPassword) return next(new Error('خطأ ف كلمة المرور',{cause:400}))
    // create new user
    const newUser = await User.create({
      userName,
      email,
      password:hashedPassword,
      phoneNumber,role
    })
    req.savedDocument = {model:User,_id:newUser._id}

    res.status(201).json({
      message:'تم التسجيل بنجاح',
      success:true
    })
}

export const verifyEmail = async (req,res,next)=>{
  // destructure email from request query
  const {email} = req.query
  // decode email by jwt 
  const decodeEmail = jwt.verify(email,process.env.VERIFICATION)
  // find this account 
  const account = await User.findOne({email: decodeEmail.email})
  if(!account) return next(new Error('هذا الحساب غير موجود',{cause:404}))
  // check if this account already verified
  if (account.isEmailVerified ) res.status(200).json({message:'تم التحقق من هذا الحساب من قبل'})
  // verified account in database
  account.isEmailVerified = true
  await account.save()
  // res.status(200).json({message:'تم التحقق بنجاح'})
  res.redirect('/')
}

export const signIn = async (req,res,next)=>{
  // destructure the required data for request body
  const {email,password} = req.body
  // find this account
  const account = await User.findOne({email})
  if(!account) return next(new Error('هذا الحساب غير موجود',{cause:404}))
  // check if this account already verified
  if (!account.isEmailVerified ) {
      // verify Email -> send code in email
      const verify = await verifyEmailService(email,req)
      if(!verify) return next(new Error('فشل التحقق',{cause:400}))   
      return next(new Error('تحقق من الحساب اولا , اذهب الي الجيميل',{cause:400}))
  }
  // check if password is correct
  const isPasswordCorrect = bcrypt.compareSync(password,account.password)
  if(!isPasswordCorrect) return next(new Error('كلمة المرور خطأ',{cause:400}))
  // update login status
  account.isLoggedIn = true
  await account.save()
  // create token
  const token = jwt.sign(
    {id:account._id,email:account.email,userName:account.userName,
      createdAt:account.createdAt,role:account.role,
      isBlocked:account.isBlocked},
      process.env.TOKEN_SIGNATURE,
      {expiresIn: '9d'})
  res.status(200).json({message: 'تم تسجيل الدخول بنجاح', token,success:true})
}

export const updateUser = async (req,res,next)=>{
  // destructure the required data for request body
  const {userName,phoneNumber,newPassword,email} = req.body 
  const {id} = req.user
  // User Account
  const user = await User.findById(id)
  if(!user) return next(new Error('تم حذف هذا الحساب',{cause:404}))
  if(email && email != user.email && user.email.length < 1 ){
    // check if email is already exists in database
    const checkEmail = await User.findOne({email})
    if(checkEmail) return next(new Error('هذا الحساب موجود من قبل',{cause:409}))
    // verify Email -> send code in email
    const verify = await verifyEmailService(email,req)
    // check is email valid
    if(!verify) return next(new Error('فشل التحقق',{cause:400})) 
      // reset email verification
      user.isEmailVerified = false
      await user.save()
  }
  if(newPassword){
      // hashed new password
      const hashedPassword = bcrypt.hashSync(newPassword,+process.env.SALT_ROUNDES)
      if(!hashedPassword) return next(new Error('تحقق من كتابه كلمه المرور الجديده',{cause:400}))
      // update password only
      user.password = hashedPassword
      await user.save()
  }
    // update account
      const update = await User.findByIdAndUpdate(id,{userName,phoneNumber,email},{new:true} ).select('-password -isEmailVerified -isLoggedIn -isBlocked')
      if(!update) return next(new Error('فشل تغير البيانات',{cause:400}))
      return res.status(200).json({message:'تم التغير بنجاح',success:true})
}

export const deleteUser = async (req,res,next)=>{
  // destructure the required data for request body
  const {id} = req.user
  // User Account
  const user = await User.findById(id)
  if(!user) return next(new Error('تم حذف هذا الحساب',{cause:404}))
  // delete account
  const deleteAccount = await User.findByIdAndDelete(id)
  if(!deleteAccount) return next(new Error('فشل حذف الحساب',{cause:400}))
  return res.status(200).json({message:'تم الحذف بنجاح',data:deleteAccount,success:true})
}

export const blockUser = async (req,res,next)=>{
  // destructure the required data for request body
  const {userId} = req.params
  const {role} = req.user
  // User Account
  const user = await User.findById(userId).select('userName phoneNumber role')
  if(!user) return next(new Error('هذا الحساب غير موجود',{cause:404}))
  if(user.role != systemRole.USER && role != systemRole.SUPERADMIN ) return next(new Error('هذا المستخدم ذات منصب لا يمكن حظره',{cause:400}))
  // block account
  user.isBlocked = true
  await user.save()
  return res.status(200).json({message:'تم الحظر بنجاح',data:user,success:true})
}
export const signUpWithGoogle = async(req, res,next) => {
const {idToken} = req.body
const client = new OAuth2Client();
async function verify() {
const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
});
const payload = ticket.getPayload();
return payload
}
const result = await verify().catch(console.error);
if(!result.email_verified) return next(new Error('لم يتم التحقق من الحساب',{cause:400}))
// check email
  const checkEmail = await User.findOne({email:result.email})
  if(checkEmail) return next(new Error('هذا الحساب مستخدم من قبل',{cause:409}))
// Hashed password 
  const defualtPassword = uniqueString(10)
const hashedPassword = bcrypt.hashSync(defualtPassword,+process.env.SALT_ROUNDES)
if(!hashedPassword) return next(new Error('فشل التسجيل',{cause:400}))
// create a new User 
const newUser = await User.create({
userName:result.name
,email:result.email
,password:hashedPassword
,isEmailVerified:result.email_verified
,provider:'Google'
})
if(!newUser) return next(new Error('فشل التسجيل',{cause:400}))
req.savedDocument = {model:User,_id:newUser._id}
res.status(201).json({msg:'تم تفعيل الحساب بنجاح',success:true})
}

// SignIn With Google
export const signInWithGoogle = async (req,res,next)=>{
  const {idToken} = req.body
  const client = new OAuth2Client();
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload
}
  const result = await verify().catch(console.error);
  if(!result.email_verified) return next(new Error('لم يتم التحقق من الحساب',{cause:400}))
  // login login
  // find this account
    const account = await User.findOne({email:result.email,provider:systemProvider.GOOGLE})
    if(!account) return next(new Error('هذا الحساب غير موجود',{cause:404}))
    account.isLoggedIn = true
  await account.save()
  // create token
  const token = jwt.sign(
    {id:account._id,email:account.email,userName:account.userName,
      createdAt:account.createdAt,role:account.role,
      isBlocked:account.isBlocked},
      process.env.TOKEN_SIGNATURE,
      {expiresIn: '9d'})

  res.status(200).json({message: 'تم تسجيل الدخول بنجاح', token,success:true})
}
