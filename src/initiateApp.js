import cors from 'cors'
import db_connection from '../DB/connection.js'
import * as router from './Modules/index.routers.js'
import globalResponse from './Middlewares/global-response.middleware.js';
import rollbackSavedDocuments from './Middlewares/rollback-saved-documents.middleware.js';
import rollbackUploudedFiles from './Middlewares/rollback-uplouded-files-middleware.js';

const initiateApp = (app,express)=>{
  const port = process.env.PORT
  app.use(cors())
  db_connection()
  // parse data by express
  app.use(express.json())
  // routes
  app.use('/api/v1/auth',router.auth)
  app.use('/api/v1/user',router.user)
  app.use('/api/v1/shop',router.shop)
  app.use('/api/v1/category',router.category)
  app.use('/api/v1/subCategory',router.subCategory)
  app.use('/api/v1/product',router.product)
  app.use('/api/v1/cart',router.cart)
  app.use('/api/v1/menu',router.menu)
  app.use('/api/v1/wishlist',router.wishlist)
  app.use('/api/v1/rate',router.rate)

  app.use('*',(req,res,next)=> res.status(404).json({message:'page not found'}))
  
  // middleware to handle any errors
  app.use(globalResponse,rollbackSavedDocuments,rollbackUploudedFiles)

  app.listen(port, () => console.log(`server app listening on port ${port}!`))
}
export default initiateApp