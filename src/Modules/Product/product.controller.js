import Product from "../../../DB/Models/product.model.js"
import cloudinaryConnection from './../../utils/cloudinary.js';
import uniqueString from './../../utils/generate-unique-string.js';
import Category from './../../../DB/Models/category.model.js';
import SubCategory from './../../../DB/Models/subCategory.js';
import { systemRole } from "../../utils/system.js";
import ApiFeatures from './../../utils/api-features.js';


export const addProduct = async(req,res,next)=>{
  // destructure the required data for request body
  const {name,description,price,categoryId,subCategoryId,stock,discount} = req.body
  // destructure the required data for request authentication
  const {id:addedBy} = req.user
  // check category
  const checkCategory = await Category.findById(categoryId)
  if(!checkCategory) return next(new Error('هذا القسم غير موجود',{cause:404}))
  // check sub category
  const checkSubCategory = await SubCategory.findById(subCategoryId)
  if(!checkSubCategory) return next(new Error('هذا القسم غير موجود',{cause:404}))

  // handle image
  const folderId = uniqueString(4)
    const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.files.image[0].path,{
      folder:`${process.env.MAIN_FOLDER}/products/${folderId}/`
    })
    // #####################################
    let imageCover = []
    for(const file of req.files.images){
      const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(file.path,{
        folder:`${process.env.MAIN_FOLDER}/products/${folderId}/`
      })
      imageCover.push({secure_url,public_id})
    }
    req.folder = folderId
  // create a new product
  const newProduct = new Product({
    name,
    description,
    price,
    categoryId,
    subCategoryId,
    addedBy,
    folderId,
    image:{secure_url,public_id},
    imageCover,
    stock,
    discount
  })
  // save the product
 await newProduct.save()
 req.savedDocuments = {model:Product,_id:newProduct._id}
  res.status(201).json({message:'تم اضافه المنتج بنجاح',data:newProduct,success:true})
}

export const updateProduct = async(req,res,next)=>{
  // destructuing the required data from request body
  const {name,description,price,newCategoryId,newSubCategoryId,oldPublicId,discount,stock} = req.body

  // destructuing the required data from request params
  const {productId} = req.params
  // destructuing the required data from authenticated
  const {userId,role} = req.user
  // get the product
  const product = await Product.findById(productId)
  if(!product) return next(new Error('هذا المنتج غير موجود',{cause:404}))
  // auth
  if(role!= systemRole.SUPERADMIN && product.addedBy!= userId) return next(new Error('ليس لديك الصلاحية لتعديل هذا المنتج',{cause:403}))
  if(newCategoryId) {
    const category = await Category.findById(newCategoryId)
    if(!category) return next(new Error('هذا القسم غير موجود',{cause:404}))
    product.categoryId = newCategoryId
  }
  if(newSubCategoryId) {
    const subCategory = await SubCategory.findById(newSubCategoryId)
    if(!subCategory) return next(new Error('هذا القسم غير موجود',{cause:404}))
    product.subCategoryId = newSubCategoryId
  }
  if(price) product.price = price
  if(discount) product.discount = discount
  if(name) product.name = name
  if(stock) product.stock = stock
  if(description) product.description = description
  if(oldPublicId&&req.files.image){
  
    const newPublic_id = oldPublicId.split(`${product.folderId}/`)[1]
    // uploud image
    const {public_id,secure_url} = await cloudinaryConnection().uploader.upload(req.files.image[0].path,{
      folder: `${process.env.MAIN_FOLDER}/products/${product.folderId}`,
      public_id:newPublic_id
    })
    product.image.secure_url = secure_url
  }
  if(oldPublicId&&req.files.images){
    const newPublic_id = oldPublicId.split(`${product.folderId}/`)[1]
    // uploud image
    const {public_id,secure_url} = await cloudinaryConnection().uploader.upload(req.files.images[0].path,{
      folder: `${process.env.MAIN_FOLDER}/products/${product.folderId}`,
      public_id:newPublic_id
    })
    product.imageCover.map((img)=> {
      if(img.public_id == oldPublicId){
          img.secure_url = secure_url  
      }
    })
  }

  await product.save()
  res.status(200).json({message:'تم التعديل بنجاح',data:product,success:true})

}


export const deleteProduct = async(req,res,next)=>{
  // destructuing the required data from request params
  const {productId} = req.params
  // destructuing the required data from authenticated
  const {userId,role} = req.user
  // get the product
  const product = await Product.findById(productId)
  if(!product) return next(new Error('هذا المنتج غير موجود',{cause:404}))
  // auth
  if(role!= systemRole.SUPERADMIN && product.addedBy!= userId) return next(new Error('ليس لديك الصلاحية لحذف هذا المنتج',{cause:403}))
  // delete images for this product 
try {
  await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/products/${product.folderId}`)
  
  await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER}/products/${product.folderId}`)
} catch (error) {

}

  const dltProduct = await Product.findByIdAndDelete(productId)
  res.status(200).json({message:'تم الحذف بنجاح',data:dltProduct,success:true})
}

export const allProducts = async (req,res,next)=>{
  const {page,size,...search} = req.query
  const ApiFeature = new ApiFeatures(req.query,Product.find().populate([{path:'categoryId'},{path:'subCategoryId'},{path:'addedBy',select:'userName'}])).search(search).pagination({page,size})
  const products = await ApiFeature.mongooseQuery
  res.status(200).json({message:'تم العثور علي المنتجات بنجاح',data:products,success:true})
}

export const getProduct = async (req, res,next) => {
  const {productId} = req.params
  const product = await Product.findById(productId)
  if(!product) return next(new Error('هذا المنتج غير موجود',{cause:404}))
  res.status(200).json({message:'الحصول علي المنتج بنجاح',data:product,success:true})
}

export const allProductsForSubCategory = async (req,res,next)=>{
  const {page,size,...search} = req.query
  const {subCategoryId} = req.params
  const ApiFeature = new ApiFeatures(req.query,Product.find({subCategoryId}).populate([{path:'categoryId'},{path:'subCategoryId'},{path:'addedBy',select:'userName'}])).search(search).pagination({page,size})
  const products = await ApiFeature.mongooseQuery
  res.status(200).json({message:'تم العثور علي المنتجات بنجاح',data:products,success:true})
}


