import { Router } from "express";
import crypto from "crypto";
//like a mini application that can group together all the request
//and then register the router to express
const router = Router();

/* userinfo={"userid":"sanjaymahara","token":"b28c94b2195c8ed259f0b415aaee3f39b0b2920a4537611499fa044956917a21"}; 
Path=/; Expires=Mon, 07 Jul 2025 11:00:07 GMT; */

router.get("/api/products", (req, res) => {

    console.log(`1.Products Get Called: ${req.url}`)
    //console.log(req.header.signedCookies);
    //suppose we get these info from the databse based on the used id in the claim
    const cookieData = req.cookies.userinfo; //get the cookie as recieved from the client
    const username = cookieData.toString().split(0, cookieData.indexOf('-'))
    console.log(`2.cookiedata ${cookieData}`);
    console.log(`3.username is : ${username}`);
    //mock call to db ti get userinfo based on username 
    const dummyDBCall = (username) => {
        //passing username argument to some db proc should return data
        return { "username": "sanjaymahara", "password": "733a450e15ead43c04df07deae32720133ac5e6824eb34932d2e57223776391e" };
    };
    
    const userInfo = dummyDBCall(username); //call the getuserform db function
    console.log(`4 db user ${JSON.stringify(userInfo)}`);
    //in real world password will be a hashed value
    const hash = crypto.createHash('sha256');
    hash.update(userInfo.toString());//feed the data to the hashfunction
    const digest = hash.digest('hex'); //no make the hash ,generate the hash of the data
    //console.log(digest);
    //we have set the coookie in the postman for the api , or we can set at the collection level
    //now suppose we use the userinfo(username,password) from the session ,
    //and compare this with the cookie we can verify the call
    const salt = userInfo.username + "-"; //create a salt or secret value
    const getCookieToSet = salt + digest;
    console.log(`5. setting the cookie for browser ${getCookieToSet}`);
    if (cookieData != getCookieToSet) return res.status(401).send("Unauthorised Access");
    res.cookie("userinfo", getCookieToSet, { maxAge: 6000 });//if all good reset the cookie
    res.status(200).send(
        [{ "television": "lenovo", "model": "len789" },
        { "television": "samsung", "model": "samop0923r" },
        { "television": "LG", "model": "908lh102y89" },
        { "television": "panasonic", "model": "oi-89jhs-09pn-98" },
        { "television": "lensonyovo", "model": "9877-897-sa-98-ga" }]
    )
});

export default router;