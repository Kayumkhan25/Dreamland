const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const PORT = process.env.PORT || 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/dreamland";

// Connect to MongoDB
main()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Middleware and Configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.engine("ejs", ejsMate);

// Session and Flash Middleware
app.use(
    session({
      secret: "thisshouldbeasecret",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: MONGO_URL,  // Use MongoDB for session storage
        ttl: 14 * 24 * 60 * 60, // 14 days session TTL
      }),
    })
  );
    
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Validation Middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

// Routes

// Index Route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

// New Route (Form)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route (Details)
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/");
  })
);

// Edit Route (Form)
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/");
  })
);

// Catch-All Route for Non-Existent Pages
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { err });
});

// Start the Server with Fallback
const server = app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is in use, trying another port...`);
    server.listen(0); // Assign a random available port
  } else {
    console.error("Server error:", err);
  }
});
