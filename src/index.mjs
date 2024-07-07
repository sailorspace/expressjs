
import express, { response } from 'express';
import routes from "./routes/routes.mjs";
import cookieParser from 'cookie-parser';
import session from 'express-session';
/* import userRouter from "../routes/user.mjs";
import productsRouter from "../routes/products.mjs"; */

//{ query } for validating the query parameters
//here we can 
const app = express();
app.use(express.json());//middleware to handle the json requests
//there are others as well like urlencoded,raw, etc

//app.use(cookieParser());
app.use(cookieParser("secret8908"));
//by default express session use inmemory store 
app.use(session({
    secret: "908loERTYUOP",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 //1hour 
    },
}));
//app.use(cookieParser("secret")); // in case we have a signed cookie 
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

//http://localhost:3000/
//base url to set the cookie / session for us

app.get("/", (req, res) => {
    console.log(req.sessionID);
    //console.log(req);
    req.session.visited = true; //this prevents creating new sessionid for every request by client
    res.cookie("hello", "world", { maxAge: 30000, signed: true });
    res.status(201).send({ msg: "Hello There" });
});