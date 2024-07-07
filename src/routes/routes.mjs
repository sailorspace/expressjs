//import all the routes to be registerd here 
import { Router } from "express";
import userRouter from "./user.mjs";
import productsRouter from "./products.mjs";

const router = Router();

//register middlewares for  the routers imported
router.use(userRouter);
router.use(productsRouter);

export default router;



