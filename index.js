const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const Listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Ensure .env variables are loaded
if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // Exit the process
}

// Database Connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit on database connection failure
  });

// Middleware and Configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Support for PUT/DELETE requests
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist"))); // Serve Bootstrap

// Session and Flash Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "thisshouldbeasecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.pageTitle = "Dreamland";
  res.locals.page = "";
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

// Home/Index Route
app.get("/", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.locals.pageTitle = "Home - Dreamland"; 
  res.render("listings/index.ejs", { allListing });
}));

// New Listing Route (Form)
app.get("/listings/new", (req, res) => {
  res.locals.pageTitle = "Create New Listing - Dreamland"; // Set a custom page title
  res.render("listings/new.ejs");
});

// Show Listing Route (Details)
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/");
  }
  res.locals.pageTitle = `${listing.title} - Dreamland`; // Use the listing title as page title
  res.render("listings/show.ejs", { listing });
}));

// Create Listing Route
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

// Edit Listing Route (Form)
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!"); 
      return res.redirect("/");
    }
    res.render("listings/edit.ejs", { listing, pageTitle: listing.title || "Edit - Dreamland" });
  })
);

// Update Listing Route
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

// Delete Listing Route
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
  next(new expressError(404, `Page Not Found: ${req.originalUrl}`));
});

// Error Handling Middleware
// Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { err });
});

// Start the Server with Fallback
const server = app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is in use. Trying another port...`);
    server.listen(0); // Assign a random available port
  } else {
    console.error("Server error:", err);
  }
});
