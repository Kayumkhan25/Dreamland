const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_Url = "mongodb://127.0.0.1:27017/dreamland";

main()
.then(() => {
    console.log("database connected successfully");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_Url);    
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();