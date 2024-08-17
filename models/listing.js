const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image: {
        type: String,
        default: "https://www.istockphoto.com/photo/your-new-house-gm645239482-116953459?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhouse&utm_medium=affiliate&utm_source=unsplash&utm_term=house%3A%3A%3Ahttps://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" 
        : v
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
        
});
    const Listing = mongoose.model("Listing", listingSchema);
    
    module.exports = Listing;