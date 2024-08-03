// const { MongoClient } = require('mongodb');

// const uri = 'mongodb://localhost:27017'; 

// const client = new MongoClient(uri);

// async function connectToMongoDB() {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');

//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//     }
// }

// connectToMongoDB();

require('dotenv').config({ path: 'url.env' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        // Perform database operations here if needed

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

connectToMongoDB();
