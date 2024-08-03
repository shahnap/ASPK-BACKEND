// Import Mongoose
const mongoose = require('mongoose');

// Define the login schema
const mainexpenseSchema
 = new mongoose.Schema({
    Amount: {
        type: Number,
        required: true,
       
    },
    Expense: {
        type: String,
        required: true,
       
    },
    PaymentType: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now // Sets default value to current date/time
    }
});

// Create a model from the schema
const AddExpense = mongoose.model('AddExpense', mainexpenseSchema

);

// Export the model
module.exports = AddExpense;
