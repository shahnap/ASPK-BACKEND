// Import Mongoose
const mongoose = require('mongoose');

// Define the login schema
const addtargetSchema
 = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
       
    },
    Date: {
        type: Date,
        default: Date.now 
       
    },
    Status: {
        type: Number,
        required: true
    },
    
   
});

const addTarget = mongoose.model('addTarget', addtargetSchema

);

module.exports = addTarget;
