// Import Mongoose
const mongoose = require('mongoose');
// const { DateTime } = require('msnodesqlv8');

// Define the login schema
const expenseSchema = new mongoose.Schema({
    expense: {
        type: String,
        required: true,
       
    },
    
    date: {
        type: Date,
        default: Date.now 
    }
});

// Create a model from the schema
const Expense = mongoose.model('Expense', expenseSchema);

// Export the model
module.exports = Expense;
