import { calcSupTotal } from "./calc-supTotal.js"


export const addNewProduct = async (cart,product,quantity,userId)=>{
  cart.products.push({
    productId:product._id,
    userId,
    quantity,
    title:product.name,
    price:product.price,
    finalPrice:product.appliedPrice,
    discount:product.discount,
    totalPrice:product.finalPrice * quantity
  })


  cart.subTotal = calcSupTotal(cart.products)
  return await cart.save()
}