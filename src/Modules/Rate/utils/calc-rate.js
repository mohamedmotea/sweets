import Product from "../../../../DB/Models/product.model.js"
import Rate from './../../../../DB/Models/rate.model.js';

export const calcRate = async(productId)=>{
  let rateArr = []
  const rates = await Rate.find({productId})
  for (const rate of rates) {rateArr.push(rate.rating)}
  const reduceRate = rateArr.reduce((accumulator,currentValue)=> accumulator + currentValue,0 ) / rates.length
  const updateProduct = await Product.findByIdAndUpdate(productId,{avgRating:reduceRate.toFixed(1)},{new:true})
  return updateProduct
}