
import Rate from '../../../DB/Models/rate.model.js';
import Product from './../../../DB/Models/product.model.js';
import { calcRate } from './utils/calc-rate.js';

export const addRate = async (req,res,next)=>{
  // destructuring required data from request body
  const {rate} = req.body;
  // destructuring required data from request params
  const {productId} = req.params
  // get product by id
  const product = await Product.findById(productId)
  if(!product) return next(new Error('هذا المنتج غير موجود',{casuse:404}));
  // destructuring user data from authenticated request
  const {id:userId} = req.user
  const checkRate = await Rate.findOne({userId,productId}).populate('productId')
  if(checkRate){
    checkRate.rating = rate
    const calcProductRate = await calcRate(productId)
    // save new rate in database
    await checkRate.save()
    return res.status(200).json({message:"تم تحديث التقيم بنجاح",rate:checkRate,productRate:calcProductRate.rate,success:true})
  }
  const newRate = new Rate({
    userId,
    productId,
    rating:rate
  })
  // save new rate in database
  await newRate.save()
  const calcProductRate = await calcRate(productId)
  res.status(201).json({message:"تم التقييم بنجاح",rate:newRate,success:true,productRate:calcProductRate.rate})
}
