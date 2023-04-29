const express = require("express");
const router = express.Router();
const Data = require("../model/data-model");

router.get('/api/users', async function (req, res) {
    try{
        docs = await Data.find({});
        res.send(docs);
    }catch(err){
        console.log(err)
    }
});

module.exports = router;