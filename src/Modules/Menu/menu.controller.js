
import Shop from './../../../DB/Models/shop.model.js';
import Menu from './../../../DB/Models/menu.model.js';
import { systemRole } from '../../utils/system.js';
import cloudinaryConnection from './../../utils/cloudinary.js';
import uniqueString from './../../utils/generate-unique-string.js';

export const addMenu = async(req,res,next)=>{
  // destructure the required data for request params
  const {shopId} = req.params
  // User Account
  const {id:userId,role} = req.user
  // find this account
  const shop = await Shop.findById(shopId)
  if(!shop) return next(new Error("هذا المتجر غير موجود",{cause:404}))
  if(role != shop.userId && role != systemRole.SUPERADMIN) return next(new Error('لا تمتلك الصلاحية',{cause:403}))
  // uploud image
const folderId = uniqueString(4)
if(!req.files) return next(new Error('يجب ارسال صور المينو',{cause:404}))
let image = []
for(const file of req.files){
  const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(file.path,{
    folder:`${process.env.MAIN_FOLDER}/menu/${folderId}`
  })
  image.push({secure_url,public_id})
}
req.folder = folderId
  const menu = new Menu({
    shopId,
    userId,
    image,
    folderId,
  })
  req.savedDocument = {model:Menu,_id:menu._id}
  // save menu
  await menu.save()
  res.status(201).json({message:'تم اضافه المينو بنجاح',data:menu,success:true})

}

export const updateMenu = async(req,res,next)=>{
  // destructure the required data for request body
  const {oldPublicId,shopId} = req.body
  // destructure the required data for request params
  const {menuId} = req.params
  // User Account
  const {id:userId,role} = req.user
  // find this account
  const menu = await Menu.findById(menuId)
  if(!menu) return next(new Error("هذا المنتج غير موجود",{cause:404}))
  if(role != menu.userId && role != systemRole.SUPERADMIN) return next(new Error('لا تمتلك الصلاحية',{cause:403}))
  // uploud image
  if(oldPublicId){
    await cloudinaryConnection().uploader.destroy(oldPublicId)
    const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
      folder:`${process.env.MAIN_FOLDER}/menu/${menu.folderId}`
    })
    for (const image of menu.image) {
      if(image.public_id == oldPublicId){
        image.secure_url = secure_url
        image.public_id = public_id
        await menu.save()
      }
    }

  }
  if(shopId){
    const shop = await Shop.findById(shopId)
    if(!shop) return next(new Error("هذا المتجر غير موجود",{cause:404}))
    menu.shopId = shopId
await menu.save()
  }
  res.status(200).json({message:'تم تعديل المينو بنجاح',data:menu,success:true})
}

export const deleteMenu = async(req,res,next)=>{
  // destructure the required data for request params
  const {menuId} = req.params
  // User Account
  const {role} = req.user
  // find this account
  const menu = await Menu.findById(menuId)
  if(!menu) return next(new Error("هذا المينو غير موجود",{cause:404}))
  if(role != menu.userId && role != systemRole.SUPERADMIN) return next(new Error('لا تمتلك الصلاحية',{cause:403}))
  const dltMenu = await Menu.findByIdAndDelete(menuId)
  res.status(200).json({message:'تم حذف المينو بنجاح',data:dltMenu,success:true})
}

export const getMenu = async(req,res,next)=>{
  // destructure the required data for request params
  const {shopId} = req.params
  // find this account
  const shop = await Shop.findById(shopId)
  if(!shop) return next(new Error("هذا المتجر غير موجود",{cause:404}))
  // get menu
  const menu = await Menu.findOne({shopId})
  res.status(200).json({message:"تم الحصول عن المنيو",data:menu,success:true})
}

export const getAllMenus = async(req,res,next)=>{
const menus = await Menu.find()
  res.status(200).json({message:"تم الحصول عن المنيو",data:menus,success:true})
}