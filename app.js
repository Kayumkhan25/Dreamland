const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Major Project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); 
const expressError = require("./utils/expressError.js"); 
const {listingSchema} = require("./schema.js");

const Port = 8080;

const Mongo_Url = "mongodb://127.0.0.1:27017/dreamland";

main().then(() => {
        console.log("database connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongo_Url);
} 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.engine('ejs', ejsMate);

app.get("dreamland-nine.vercel.app
/", (req, res) => {
    res.send("welcome to the project");
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else {
    next();
    }
    
}

// Index Route
app.get("dreamland-nine.vercel.app
/listings", wrapAsync(async(req, res) => {
    const allListing = await Listing.find({});
    res.render("dreamland-nine.vercel.app
/listings/index.ejs", { allListing });
}))

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}))

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "New Villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India" 
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully tested");    
// })



app.all("*", (req, res, next) => {
    next(new expressError(404, "PAGE NOT FOUND!"))
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something Went Wrong"} = err;
    res.status(statusCode).render("listings/error", {err});
    // res.status(statusCode).send(message);
})


app.listen(Port, () => {
    console.log(`app is listen at port ${Port}`);
});
