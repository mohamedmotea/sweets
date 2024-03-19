
import paginationFun from './pagination.js';

class ApiFeatures {
  constructor(query,mongooseQuery){
    this.query = query;
    this.mongooseQuery = mongooseQuery;
  }

  pagination({page,size}){
    const {limit , skip} = paginationFun({page,size});
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
    return this
  }
  sort(sortBy){
    if(!sortBy) {
      this.mongooseQuery = this.mongooseQuery.sort({createdAt:1})
      return this
    }
    const formula = sortBy.replace(/desc/g,'-1').replace(/asc/g,'1').replace(/ /,':')
    const [key,value] = formula.split(':')
    this.mongooseQuery = this.mongooseQuery.sort({[key]:+value})
    return this
  }
  search(search){
    let searchQuery = {}
    if(search.shop_name) searchQuery.shop_name = {$regex:search.shop_name,$options:'i'}
    if(search.location) searchQuery.location = {$regex:search.location,$options:'i'}
    if(search.name) searchQuery.name = {$regex:search.name,$options:'i'}
    if(search.discount) searchQuery.discount = {$ne : 0 }
    // search Price -> 
    if(search.priceFrom && ! search.priceTo) searchQuery.price = {$gte : search.priceFrom}
    if(search.priceTo && ! search.priceFrom) searchQuery.price = {$lte : search.priceFrom}
    if(search.priceTo &&  search.priceFrom) searchQuery.price = {$lte : search.priceTo,$gte: search.priceFrom}
    this.mongooseQuery = this.mongooseQuery.find(searchQuery)
    return this
  }
  filter(filter){
    const formula = JSON.stringify(filter).replace(/"lte|"gte|"regex|"gt|"lt/g,(opretor)=> `"$${opretor.split('"')[1]}`)
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(formula))
    return this
  }
}

export default ApiFeatures