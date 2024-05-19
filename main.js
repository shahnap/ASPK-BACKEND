// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors');
// Import Login model
// const Login = require('./models/Login');
const Login = require('./schema/loginSchema')
const Expense = require('./schema/expenseSchema')

// Initialize Express app
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/aspk', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes

// -----------------------------------------Register--------------------------------------------------------------------
app.post('/register', async (req, res) => {
    try {
        // Extract username, password, and email from request body
        const { user1, user2, code,email1,email2 } = req.body;

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new Login({
            user1,
            user2,
            // code: hashedPassword,
            code,
            email1,
            email2
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// -----------------------------------------Login--------------------------------------------------------------------

app.post('/login', async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;
console.log(req.body);
        // Find the user by username
        const user = await Login.findOne({ $or: [{ user1: username }, { user2: username }] });
        console.log("user",user);
        // If user is not found
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        let passwordMatch = false;
        if (user) {
         console.log("jdfhjkd");
            if(user.code=password){
                console.log('success');
                passwordMatch=true
            }
        } 
        console.log("passwordMatch",passwordMatch);
        // If passwords don't match
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // If passwords match, user is authenticated
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ##########################################Masters######################################################################

// -----------------------------------------Expense--------------------------------------------------------------------

app.post('/master/setexpense', async (req, res) => {
    try {
        const { expense, date } = req.body;

        // Create a new expense object based on the schema
        const newExpense = new Expense({
            expense,
            date
        });

        // Save the new expense to the database
        await newExpense.save();

        // Send success response
        res.status(201).json({ message: 'Expense Added successfully' });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ error: error.message }); // Send error response
    }
});


// Get all expenses
app.get('/master/getexpenses', async (req, res) => {
    try {
        // Retrieve all expenses from the database
        const expenses = await Expense.find({});
        // Send the expenses as a JSON response
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: error.message });
    }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
