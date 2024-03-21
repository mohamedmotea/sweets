import Cart from "../../../../DB/Models/cart.model.js"


export const addCart = async(userId,product,quantity)=>{
  const newCart = new Cart({
    userId,
    products:[
      {
        productId:product._id,
        quantity,
        title:product.name,
        price:product.price,
        finalPrice:product.finalPrice,
        discount:product.discount,
        totalPrice:product.finalPrice * quantity
      }
    ],
    subTotal:product.finalPrice * quantity
  })
  // save cart in database
  await newCart.save()

}