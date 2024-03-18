
import Category from '../../../DB/Models/category.model.js';
import ApiFeatures from '../../utils/api-features.js';
import SubCategory from './../../../DB/Models/subCategory.js';

export const addSubCategory = async(req,res,next)=>{
  // destructure the required data for request params
  const {categoryId} = req.params
  // destructure the required data for request body
  const {name} = req.body
  // User Account
  const {id:userId} = req.user
  // find this account
  const category = await Category.findById(categoryId)
  if(!category) return next(new Error("هذا القسم غير موجود",{cause:404}))
  // check name 
  const checkName = await SubCategory.findOne({name})
  if(checkName) return next(new Error('هذا الاسم مستخدم من قبل',{cause:409}))
  const newSubCategory = new SubCategory({name,userId,categoryId})
  await newSubCategory.save()
  res.status(201).json({message:'تم اضافه القسم بنجاح',data:newSubCategory,success:true})
}

export const updateSubCategory = async (req,res,next)=>{
  // destructure the required data for request body
  const {name,categoryId} = req.body
  // destructure the required data for request params
  const {subCategoryId} = req.params
  // get the category
  const subCategory = await SubCategory.findById(subCategoryId)
  if(!subCategory) return next(new Error('هذا القسم غير موجود',{cause:404}))
  // find this account
  const checkCategory = await Category.findOne({name})
  if(checkCategory) return next(new Error('هذا القسم موجود بالفعل',{cause:409}))
  if(name) subCategory.name = name
  if(categoryId) {
    const category = await Category.findById(categoryId)
    if(!category) return next(new Error('هذا القسم غير موجود',{cause:404}))
    subCategory.categoryId = categoryId
  }
  await subCategory.save()
  res.status(200).json({message:'تم تعديل القسم بنجاح',data:subCategory,success:true})
}

export const deleteSubCategory = async (req,res,next)=>{
  // destructure the required data for request params
  const {subCategoryId} = req.params
  // get the category
  const subCategory = await SubCategory.findByIdAndDelete(subCategoryId)
  if(!subCategory) return next(new Error('هذا القسم غير موجود',{cause:404}))
  res.status(200).json({message:'تم حذف القسم بنجاح',data:subCategory,success:true})
}

export const getAllSubCategories = async (req,res,next)=>{
  const {page,size,...search} = req.query
  const ApiFeature = new ApiFeatures(req.query,SubCategory.find()).pagination({page,size}).search(search)
  const subCategories = await ApiFeature.mongooseQuery
  res.status(200).json({message:'الحصول علي الاقسام بنجاح',data:subCategories,success:true})
}

export const getSubCategory = async (req,res,next)=>{
  const {subCategoryId} = req.params
  const subCategory = await SubCategory.findById(subCategoryId)
  if(!subCategory) return next(new Error('هذا القسم غير موجود',{cause:404}))
  res.status(200).json({message:'الحصول علي القسم بنجاح',data:subCategory,success:true})
}