

export const calcSupTotal = (products)=>{
  let subTotal = 0;
  for(const product of products){
    subTotal  += product.totalPrice
  }
  
  return subTotal
}