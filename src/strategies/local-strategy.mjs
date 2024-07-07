import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

//taking the user object validated and storing that in the session 
//does well with expressjs
//serialize the data into the session 
passport.serializeUser((user, done) => {
    console.log(`inside the serialize User`);
    console.log(user);
    done(null, user.id); //pass in something that is unique to look for in the array or db
    //done(null, user.name); //we can use the username as well to validate the user in db
});
//what we pass into the serializer is passed into the deserializer 
//so the argument needs to be exaclty that 
//take the id from the session and unpack/retrieve and storing it into the request itself
//we can take either id or username based on the serializer above which is id in this case
//for the passport object mapping to the identity , id here
passport.deserializeUser((id, done) => {
    console.log(`inside the deserialize User`);
    console.log(id);
    //search for the user in the array or database
    try {
        const findUser = mockUsers.find((user) => user.id === id);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    }
    catch (error) {
        done(error, null);
    }
});

//all the passport modules have a strategy class 
//e.g passport-http-bearer , passport-facebook, passport-google-oauth , passport-twitter ,
//passport-auth0 , passport-oauth2 , openid-client , passport-microsoft etc.
//finally register this in the index file i.e import 
//and use this in the endpoint and passport witll interface in the call for auth
export default passport.use(
    //first parameter tell passport the actual request username/password field sent from 
    //request body as application might be using fields like email , or name or anything else 
    //as two properties to authenticate.
    //in out case here the username/password matches with what we actually use
    // 
    new Strategy({ usernameField: "username", passwordField: "password" },
        (username, password, done) => {
            console.log(`username: ${username}`);
            console.log(`password: ${password}`);
            //validate the user and check if the passwords are thesame db vs req
            //1.get the username from boy and search for it in the database
            //2.when username found in db then match the password of body with the password of db
            try {
                const findUser = mockUsers.find((user) => user.name === username);
                if (!findUser) throw new Error('User not found');
                if (findUser.password !== password) throw Error("Invalid Credentials");
                done(null, findUser);
            }
            catch (error) {
                done(error, null);
            }

        })
);
//everytime a user sends a post request for authentication
// passport will look for the username and password inside that request body
//and pass that in inside the callback function "done"




