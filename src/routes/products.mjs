import { Router } from "express";
//like a mini application that can group together all the request
//and then register the router to express
const router = Router();
router.get("/api/products", (req, res) => {
    console.log(`Products Get Called: ${req.url}`)
    res.status(200).send(
        [{ "television": "lenovo", "model": "len789" },
        { "television": "samsung", "model": "samop0923r" },
        { "television": "LG", "model": "908lh102y89" },
        { "television": "panasonic", "model": "oi-89jhs-09pn-98" },
        { "television": "lensonyovo", "model": "9877-897-sa-98-ga" }]
    )
});

export default router;