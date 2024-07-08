
import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { uservalidationscheme } from '../utils/uservalidationscheme.js';
import { mockUsers } from '../utils/constants.mjs';
import { resolveIndexById } from '../utils/middleware.js';
import crypto from "crypto";
import { hashPassword } from "../utils/bcrypt.mjs";
import { User } from "../mongoose/schema/user.mjs";
//like a mini application that can group together all the request
//and then register the router to express
const router = Router();
//registering the "api/users" to this router 
//export this router in the end , export default router
//finally and then we should import this to the index.mjs
//import 
//app.use(<router>);
//define route and pass a request handler/callback function 
router.get("/home", (req, res, next) => {
    console.log("Home Page");//this will get stucked in pending state as we will need to call the next 
    //middleware 
    next();//now this will allow to call the next function in the chain, without it the request will hang 
    //in waiting or end here itself
}, (req, res) => {
    //res.send("hello world");
    const userInfo = { "username": "sanjaymahara", "password": "sanjay12345" };
    const hash = crypto.createHash('sha256');
    hash.update(userInfo.toString());//feed the data to the hashfunction
    const digest = hash.digest('hex'); //no make the hash ,generate the hash of the data
    console.log(digest);
    res.cookie("userinfo", digest, { maxAge: 6000 });
    //cookie expires will mean the browser will not send the cookie
    res.status(200).send({ msg: 'hello' });
});

router.get("/api/users", query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
    (req, res) => {
        req.sessionStore.get(req.session.id, (err, sessionData) => {
            if (err) {
                throw err;
            }
        });
        console.log("Validating the request filters");
        const result = validationResult(req); //handle the validation result to do it for you
        //instead of doing manually
        console.log(`Result of validation ${result}`);
        console.log(`is result empty:${result.isEmpty()}`)
        if (!result.isEmpty()) return res.send(result);
        console.log("Validation to get all users passed");
        //console.log(`value used is : ${query.params}`)
        const {
            query: { filter, value },
        } = req;
        if (filter && value)
            return res.send(
                mockUsers.filter((user) => user[filter].includes(value))
            );
        return res.send(mockUsers);
    }
);

//define route parameters to make parameter based api calls on the same resource
router.get("/api/users/:id", (req, res) => {
    console.log(req.params);
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        res.status(400).send(`No such user exists`);
    }
    else {
        const findUser = mockUsers.find((user) => user.id === userId);
        if (!findUser) {
            res.sendStatus(400);
        }
        res.send(findUser);
    }
});

//update whole set of records single/many 
//mostly use to add a entirely new record
router.post("/api/users",
    checkSchema(uservalidationscheme),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
        const data = matchedData(req);
        data.password = hashPassword(data.password);
        console.log(`new user to be added`);
        console.log(data);
        //const { body } = req; 
        //const newUser = new User(body); //better get the data from the marchedData funtion
        //using the request data directly could be an hazard and dangerous 
        //better to validate the data first from middleware ..validationResult
        //and then fetch this data from the matched data to work on 
        const newUser = new User(data);
        //save the user to the database 
        try {
            const savedUser = await newUser.save();
            return res.status(201).send(savedUser);
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    });
/* router.post("/api/users", 
    // body("name")
    //.notEmpty()
    //.isString()
    //.isLength({ min: 3, max: 12 })
    //.withMessage("provide name between 3 to 12 characters only") 
    //checkSchema(uservalidationscheme), 
    (request, res) => {
        console.log("POST Called");
        const result = validationResult(request);
        console.log(result.isEmpty());
        if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
        const data = matchedData(request);
        console.log(data);
        //const { body } = request;
        const newuser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data } //using spreader operator on the body
        mockUsers.push(newuser);
        res.status(200).send(newuser);

    }); */

//update a row and all the columns i.e entire record
//even if we do not provide a property still the update will include modifying it by its default value
router.put("/api/users/:id", resolveIndexById, (req, res) => {
    console.log("Put Called");
    console.log(req.body);
    const { body, findUserIndex } = req;
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId))
        return res.sendStatus(400);
    //find the user by id/index ..this code no longer needed as it has been moved to middleware
    /*  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
     if (findUserIndex === -1) {
         return res.sendStatus(404);
     } */
    //using spreader operetator which would internally update each value one by one
    mockUsers[findUserIndex] = { id: parsedId, ...body }; //entire merge , whole record update
    return res.sendStatus(200);

});

//update a column i.e one property
router.patch("/api/users/:id", (req, res) => {
    const { body, params: { id } } = req;
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId))
        return res.sendStatus(400);
    //find the user by id/index
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) {
        return res.sendStatus(404);
    }
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...req.body };
    //using the old user info and merging with new so as to override with old only updating
    //the properties supplied from req body
    return res.status(200).send(mockUsers[findUserIndex]);
});

//update a row and all the columns i.e entire record
router.delete("/api/users/:id", (req, res) => {
    console.log("Delete Called");
    const { params: { id } } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId))
        return res.sendStatus(400);
    //find the user by id/index
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) {
        return res.sendStatus(404);
    }
    mockUsers.splice(findUserIndex, 1);//
    return response.status(200).send(true);

});

export default router;