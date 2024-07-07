
import express, { response } from 'express';
import routes from "./routes/routes.mjs";
import cookieParser from 'cookie-parser';
/* import userRouter from "../routes/user.mjs";
import productsRouter from "../routes/products.mjs"; */

//{ query } for validating the query parameters
//here we can 
const app = express();
app.use(cookieParser());
//app.use(cookieParser("secret")); in case we have a signed cookie 
app.use(routes);

/* 
app.use(userRouter);
app.use(productsRouter); */
//app.use(express.json()); //making the application ready to server json type objects

const PORT = process.env.PORT || 3000;
//sample middleware 
//we can enable it globally for all routes 
//or at the specific routes
const loggingmiddleware = (req, res, next) => {
    console.log(`${req} - ${res.url}`);
    next();
};

app.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`);
});