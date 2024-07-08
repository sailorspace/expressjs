
import express, { response } from 'express';
import routes from "./routes/routes.mjs";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from "passport";
import mongoose from "mongoose";
//import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";
import { User } from './mongoose/schema/user.mjs';
import MongoStore from 'connect-mongo';
import cors from "cors";
/* import userRouter from "../routes/user.mjs";
import productsRouter from "../routes/products.mjs"; */

//connect to mongo db mongodb://localhost:27017/
mongoose.connect("mongodb://0.0.0.0:27017/orchesturf")
    .then(() => console.log("connected to the db"))
    .catch((error) => console.log(`Error ${error}`));

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
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));

app.use(passport.initialize()); //enable passport 
app.use(passport.session()); //this takes care of tracking a user to the session and 
//figure and validate user 
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

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

app.post("/api/auth", (req, res) => {
    const { username, password } = req.body;
    //const findUser = mockUsers.find((user) => user.name === username);
    const findUser = mockUsers.find((user) => user.name === username);
    if (!findUser || (findUser.password != password))
        return res.status(401).send({ msg: "Bad Credentials" });
    //the cookie sent to the client side holds only the session id not the session value
    req.session.user = findUser; //attatch dynamic property to nodejs objects 
    //the above creates a cookie which store the sessionid 
    return res.status(200).send(findUser);
});


/* app.get("/api/auth/status", (req, res) => {
    console.log(req.session.user);
    req.sessionStore.get(req.sessionID, (error, session) => {
        console.log(session);
    });
    //for any api endpoint the way to authenticate the user is to check the session for
    //the request, every browser agent will have a different session id created
    //event if the authentication is for the same user , from different browser agent we will have
    //two different sessions created
    return req.session.user ? res.status(200).send(req.session.user)
        : res.status(401).send({ msg: "Not Authenticated" })
}); */

//##########################################
//authentication using passport 
//create an auth api endpoint and pass strategy for authentication 
app.post("/api/authenticate", passport.authenticate('local'), (req, res) => {
    res.status(200).send(true);
});
//passport auth status check 

app.get("/api/auth/status", (request, response) => {
    return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/updateuser", (req, res) => {
    const { body: item } = req; //do something with this to update the user when the session is validated
    return req.session.user ? res.send({ msf: "user updated" })
        : res.status(401).send({ msg: "Not Authenticated" });
    //for user update we can check if the sent user to update is the same as the 
    //one in the session store by matching the id or some hash value
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
	"/api/auth/discord/redirect",
	passport.authenticate("discord"),
	(request, response) => {
        console.log(request.session);
        console.log(request.user);
		response.sendStatus(200);
	}
);