
import express, { response } from 'express';
import 'dotenv';

const app = express();

app.use(express.json()); //making the application ready to server json type objects

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, name: 'sanjay', city: "noida" },
    { id: 2, name: 'jack', city: "new york" },
    { id: 3, name: 'mouan', city: "beijing" },
    { id: 4, name: 'lee', city: "tokyo" },
    { id: 5, name: 'kobondo', city: "cairo" },
    { id: 6, name: 'jackie', city: "veinna" },
    { id: 7, name: 'ellei', city: "denmark" }
];

//sample middleware 
//we can enable it globally for all routes 
//or at the specific routes
const loggingmiddleware = (req, res, next) => {
    console.log(`${req} - ${res.url}`);
    next();
};

//the this middleware use in the PUT request , removes lot of code and makes the function need
//helps in moving the extra bunesslogic part of code outside 
const resolveIndexById = (req, res, next) => {
    const { body, params: { id } } = req;
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId))
        return res.sendStatus(400);
    //find the user by id/index
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) {
        return res.sendStatus(404);
    };

    req.findUserIndex = findUserIndex; //attaching a property to the request object
    //now we will inject these middlewares into request calls 
    next();//finally calling next 
    //next(error) next function also excepts parameters like error
};

//app.use(loggingmiddleware); //registered globally 

//define route and pass a request handler/callback function 
app.get("/", (req, res, next) => {
    console.log("Base URL");//this will get stucked in pending state as we will need to call the next 
    //middleware 
    next();//now this will allow to call the next function in the chain, without it the request will hang 
    //in waiting or end here itself
}, (req, res) => {
    //res.send("hello world");
    res.status(200).send({ msg: 'hello' });
});

app.get("/api/users", (req, res) => {
    console.log(req.query);
    const queryParam = req.query;
    const {
        query: { filter, value },
    } = req;
    console.log(filter);
    console.log(value);

    if (!filter && !value) { return res.send(mockUsers); }
    else if (filter && value) return res.send(
        mockUsers.find((user) => user[filter].includes(value))
    );
});

//define route parameters to make parameter based api calls on the same resource
app.get("/api/users/:id", (req, res) => {
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
app.post("/api/users", (req, res) => {
    console.log(req.body);
    const { body } = req;
    const newuser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body } //using spreader operator on the body
    mockUsers.push(newuser);
    res.status(200).send(newuser);
});

//update a row and all the columns i.e entire record
//even if we do not provide a property still the update will include modifying it by its default value
app.put("/api/users/:id", resolveIndexById, (req, res) => {
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
app.patch("/api/users/:id", (req, res) => {
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
app.delete("/api/users/:id", (req, res) => {
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

app.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`);
});