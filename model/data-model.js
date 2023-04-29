const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: {type:String, default: null},
    age: {type:String, default: null},
    email: {type:String, unique: true},
    gender: {type:String},
    proofType: {type:String},
    proofId: {type:String}
});

module.exports = mongoose.model("data", dataSchema);