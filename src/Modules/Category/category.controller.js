
import Category from './../../../DB/Models/category.model.js';
import ApiFeatures from './../../utils/api-features.js';
export const addCategory = async(req,res,next)=>{
  // destructure the required data for request body
  const {name} = req.body
  // User Account
  const {id:userId} = req.user
  // find this account
  const category = await Category.findOne({name})
  if(category) return next(new Error('هذا القسم موجود بالفعل',{cause:404}))
  const newCategory = new Category({name,userId})
  await newCategory.save()
  res.status(201).json({message:'تم اضافه القسم بنجاح',data:newCategory,success:true})
}

export const updateCategory = async (req,res,next)=>{
  // destructure the required data for request params
  const {categoryId} = req.params
  // get the category
  const category = await Category.findById(categoryId)
  if(!category) return next(new Error('هذا القسم غير موجود',{cause:404}))
  // destructure the required data for request body
  const {name} = req.body
  // find this account
  const checkCategory = await Category.findOne({name})
  if(checkCategory) return next(new Error('هذا القسم موجود بالفعل',{cause:409}))
  category.name = name
  await category.save()
  res.status(200).json({message:'تم تعديل القسم بنجاح',data:category,success:true})
}

export const deleteCategory = async (req,res,next)=>{
  // destructure the required data for request params
  const {categoryId} = req.params
  // get the category
  const category = await Category.findById(categoryId)
  if(!category) return next(new Error('هذا القسم غير موجود',{cause:404}))
  const dltCategory = await Category.findByIdAndDelete(categoryId)
  res.status(200).json({message:'تم حذف القسم بنجاح',data:dltCategory,success:true})
}

export const getAllCategory = async (req,res,next)=>{
  const {page,size} = req.query
  const ApiFeature = new ApiFeatures(req.query,Category.find()).pagination({page,size})
  const categories = await ApiFeature.mongooseQuery
  res.status(200).json({message:'الحصول علي الاقسام بنجاح',data:categories,success:true})
}

export const getCategory = async (req,res,next)=>{
  const {categoryId} = req.params
  const category = await Category.findById(categoryId)
  if(!category) return next(new Error('هذا القسم غير موجود',{cause:404}))
  res.status(200).json({message:'الحصول علي القسم بنجاح',data:category,success:true})
}