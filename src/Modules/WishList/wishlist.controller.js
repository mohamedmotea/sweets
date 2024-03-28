
import Product from './../../../DB/Models/product.model.js';
import WishList from './../../../DB/Models/wishlist.model.js';

export const addWishlist = async(req,res,next)=>{
  // destructure the required data for request params
  const {productId} = req.params
  // User Account
  const {id:userId} = req.user
  // find this account
  const product = await Product.findById(productId)
  if(!product) return next(new Error("هذا المنتج غير موجود",{cause:404}))
  // check name 
  const wishlist = await WishList.findOne({userId})
  const checkIfProductExist = await WishList.findOne({userId,products:{$in:productId}})
  if(checkIfProductExist) return next(new Error('هذا المنتج موجود بالفعل',{cause:409}))
  if(wishlist){
    wishlist.products.push(productId)
    await wishlist.save()
    return res.status(200).json({message:"تم اضافة المنتج بنجاح",data:wishlist,status:true})
  }
  const newWishlist = new WishList({userId,products:productId})
  await newWishlist.save()
  return res.status(201).json({message:"تم اضافة المنتج بنجاح",data:newWishlist,status:true})
}
export const removeProductWishlist = async(req,res,next)=>{
  // destructure the required data for request params
  const {productId} = req.params
  // User Account
  const {id:userId} = req.user
  // check name 
  const newWishlist = await WishList.findOneAndUpdate({userId,products:{$in:productId}},{$pull:{products:productId}},{new:true})
  if(!newWishlist) return next(new Error("لم يتم ايجاد المنتج في قائمة مفضلة",{cause:404}))
  res.status(200).json({message:"تم ازالة المنتج بنجاح",data:newWishlist,status:true})
}

export const deleteWishlist = async (req, res,next) =>{
  // destructure the required data for request authentication
  const {id:userId} = req.user
  // find wishlist
  const deleteWishlist = await WishList.findOneAndDelete({userId})
  if(!deleteWishlist) return next(new Error("لم يتم حذف ايجاد قائمة مفضلة",{cause:404}))
  res.status(200).json({message:"تم حذف القائمة بنجاح",data:deleteWishlist,status:true})
}

export const getWishlist = async(req,res,next)=>{
  // destructure the required data for request authentication
  const {id:userId} = req.user
  // find wishlist
  const wishlist = await WishList.find({userId}).populate('products')
  res.status(200).json({message:"تم الحصول عن قائمة مفضلة",data:wishlist,status:true})
}