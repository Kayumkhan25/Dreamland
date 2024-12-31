const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v
    },
    price: {
        type: Number,
        required: true, // Optional field
        min: 100, 
    },
    location: {
        type: String,
        required: true 
    },
    country: {
        type: String,
        required: true 
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
