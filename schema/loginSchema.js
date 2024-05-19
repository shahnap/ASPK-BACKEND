// Import Mongoose
const mongoose = require('mongoose');

// Define the login schema
const loginSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true,
       
    },
    user2: {
        type: String,
        required: true,
       
    },
    code: {
        type: String,
        required: true
    },
    email1: {
        type: String,
        required: true,
        unique: true // Ensures uniqueness of emails
    },
    email2: {
        type: String,
        required: true,
        unique: true // Ensures uniqueness of emails
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets default value to current date/time
    }
});

// Create a model from the schema
const Login = mongoose.model('Login', loginSchema);

// Export the model
module.exports = Login;
