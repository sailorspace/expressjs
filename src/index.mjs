
import express from 'express';
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
//define route and pass a request handler/callback function 
app.get("/", (req, res) => {
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
app.put("/api/users/:id", (req, res) => {
    console.log("Put Called");
    console.log(req.body);
    const { body, params: { id } } = req;
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId))
        return res.sendStatus(400);
    //find the user by id/index
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) {
        return res.sendStatus(404);
    }
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
app.delete("/api/users", (req, res) => {

});

app.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`);
});