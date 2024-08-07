// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // For password hashing
const cors = require('cors');
// Import Login model
// const Login = require('./models/Login');
const Login = require('./schema/loginSchema')
const Expense = require('./schema/expenseSchema');
const AddExpense = require('./schema/addmainexpense');
const moment = require('moment');
const addTarget = require('./schema/addtarget');


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



// ADD Expence Main 

//set
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.post('/master/main/addexpense', async (req, res) => {
    try {
        console.log("data", req.body);

        // Create a new instance of AddExpense with data from req.body
        const newExpense = new AddExpense({
            Amount: req.body.Amount,
            Expense: req.body.Expense,
            PaymentType: req.body.PaymentType
        });

        // Save the instance to the database
        await newExpense.save();

        res.status(201).json({ message: 'Expense Added successfully' });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ error: error.message }); // Send error response
    }
});


app.post('/master/main/addTarget', async (req, res) => {
    try {
        console.log("data", req.body);

        // Create a new instance of AddExpense with data from req.body
        const newTarget= new addTarget({
            name: req.body.name,
           
            Status: req.body.Status
        });

        // Save the instance to the database
        await newTarget.save();

        res.status(201).json({ message: 'Target Added successfully' });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ error: error.message }); // Send error response
    }
});

app.post('/master/main/addtourgent', async (req, res) => {
    try {
        console.log("data", req.body);

        // Extract the Id from req.body
        const targetId = req.body.Id;

        // Find the target document by Id
        const target = await addTarget.findById(targetId);

        if (!target) {
            return res.status(404).json({ error: 'Target not found' });
        }

        // Toggle the Status value
        target.Status = target.Status === 0 ? 1 : 0;

        // Save the updated target document to the database
        await target.save();

        res.status(200).json({ message: 'Target status updated successfully' });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ error: error.message }); // Send error response
    }
});

//get


app.get('/master/main/getexpense', async (req, res) => {
    try {
        // Get the current date
        const currentDate = moment().startOf('day');

        // Retrieve expenses added on the current date from the database
        const addedexpenses = await AddExpense.find({
            createdAt: {
                $gte: currentDate.toDate(), // Greater than or equal to the start of the current date
                $lt: moment(currentDate).endOf('day').toDate() // Less than the end of the current date
            }
        });

        // Send the expenses as a JSON response
        res.json(addedexpenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/master/main/gettarget', async (req, res) => {
    try {
        // Get the current date
        const currentDate = moment();
        let startOfPeriod, endOfPeriod;

        // Determine the start and end dates based on the 7th of the current month
        if (currentDate.date() < 7) {
            startOfPeriod = moment().subtract(1, 'month').date(7).startOf('day');
            endOfPeriod = moment().date(7).startOf('day');
        } else {
            startOfPeriod = moment().date(7).startOf('day');
            endOfPeriod = moment().add(1, 'month').date(7).startOf('day');
        }

        // Retrieve targets added between the start and end of the period from the database
        const addedTargets = await addTarget.find({
            Date: {
                $gte: startOfPeriod.toDate(), // Greater than or equal to the start of the period
                $lt: endOfPeriod.toDate() // Less than the end of the period
            }
        });

        // Send the targets as a JSON response
        res.json(addedTargets);
    } catch (error) {
        console.error('Error fetching targets:', error);
        res.status(500).json({ error: error.message });
    }
});



app.get('/master/main/getexpensebydate', async (req, res) => {
    try {
      // Access data from the request query (corrected)
      const { fromDate, toDate } = req.query;
  
      // Validate date formats for robustness (optional)
      if (!moment(fromDate, 'YYYY-MM-DD', true).isValid() ||
          !moment(toDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }
  
      // Convert dates to Moment objects for easy manipulation (consistent with your current code)
      const startDate = moment(fromDate);
      const endDate = moment(toDate);
  
      // Ensure fromDate <= toDate to avoid unexpected behavior
      if (startDate.isAfter(endDate)) {
        return res.status(400).json({ error: 'From date cannot be after to date.' });
      }
  
      // Build the database query with a date range filter
      const query = {
        createdAt: {
          $gte: startDate.startOf('day').toDate(), // Greater than or equal to the start of fromDate
          $lt: endDate.endOf('day').toDate() // Less than the end of toDate (inclusive)
        }
      };
  
      // Retrieve expenses from the database using Mongoose or your preferred ORM
      const expenses = await AddExpense.find(query);
  
      // Send the retrieved expenses as a JSON response
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses by date:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
