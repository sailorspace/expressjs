
import { mockUsers } from "./constants.mjs";

export const resolveIndexById = (req, res, next) => {
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