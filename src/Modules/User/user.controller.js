import User from "../../../DB/Models/user.model.js"


export const getAllUsers = async(req,res,next) => {
  const users = await User.find({}).select('-password')
  res.status(200).json(users)
}

export const getUser = async(req,res,next) => {
  const {userId} = req.params
  const users = await User.findById(userId).select('-password')
  if(!users) return next(new Error('هذا الحساب غير موجود',{cause:404}))
  res.status(200).json(users)
}