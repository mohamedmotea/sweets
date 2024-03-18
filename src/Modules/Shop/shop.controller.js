import Shop from "../../../DB/Models/shop.model.js"
import { systemRole } from "../../utils/system.js"
import ApiFeatures from './../../utils/api-features.js';


export const addShop = async (req, res, next) => {
  // destructuing the required data from request body
  const {shop_name,location,delivery_Number} = req.body
  // destructuring the required data from authenticated
  const {id:userId} = req.user
  // check if shop exist
  const shop = await Shop.findOne({shop_name})
  if(shop) return next(new Error('هذا المتجر موجود',{cause:409}))
  // create shop
  const newShop = new Shop({
    shop_name,
    location,
    delivery_Number,
    userId
  })
  // save shop
  await newShop.save()
  res.status(201).json({message:`تم اضافه ${shop_name} بنجاح`,data:newShop,success:true})
}

export const updateShop = async(req,res,next)=>{
    // destructuing the required data from request params
    const {shopId} = req.params
    // destructuing the required data from request body
    const {shop_name,location,newDelivery_Number,oldDelivery_Number} = req.body
    // destructuring the required data from authenticated
    const {userId,role} = req.user
    // check if shop exist
    const shop = await Shop.findById(shopId)
    if(!shop) return next(new Error('هذا المتجر غير موجود',{cause:404}))
    if(role != systemRole.SUPERADMIN && shop.userId != userId) return next(new Error('ليس لديك الصلاحية لتعديل هذا المتجر',{cause:403}))
    // update shop
    if(shop_name && shop_name != shop.shop_name) {
      const checkName = await Shop.findOne(shop_name)
      if(checkName) return next(new Error('هذا الاسم موجود من قبل',{cause:409}))
      shop.shop_name =shop_name
    } 
    if(location) shop.location = location
    if(newDelivery_Number) shop.delivery_Number.push(newDelivery_Number)
    if(oldDelivery_Number) {
      await Shop.updateOne({_id:shopId},{$pull:{delivery_Number:oldDelivery_Number}})
    }
    // save shop
    await shop.save()
    res.status(200).json({message:`تم التعديل بنجاح`,data:shop,success:true})
}

export const deleteShop = async(req,res,next)=>{
  // destructuing the required data from request params
  const {shopId} = req.params
  // destructuing the required data from authenticated
  const {userId,role} = req.user
  // check if shop exist
  const shop = await Shop.findById(shopId)
  if(!shop) return next(new Error('هذا المتجر غير موجود',{cause:404}))
  if(role!= systemRole.SUPERADMIN && shop.userId!= userId) return next(new Error('ليس لديك الصلاحية لحذف هذا المتجر',{cause:403}))
  // delete shop
  await Shop.deleteOne({_id:shopId})
  res.status(200).json({message:`تم الحذف بنجاح`,data:shop,success:true})
}

export const getAllShop = async(req,res,next)=>{
  const {size,page,...search} = req.query
  const ApiFeature = new ApiFeatures(req.query,Shop.find().populate('userId','userName')).search(search).pagination({page,size})
  const shop = await ApiFeature.mongooseQuery
  res.status(200).json({message:"الحصول علي المعلومات بنجاح",data:shop,success:true})
}

export const getShop = async(req,res,next)=>{
  const {shopId} = req.params
  const shop = await Shop.findById(shopId)
  if(!shop) return next(new Error('هذا المتجر غير موجود',{cause:404}))
  res.status(200).json({message:"الحصول علي المعلومات بنجاح",data:shop,success:true})
}