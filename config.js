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
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://shahnapshahna243:6epZ28gLnfbexSEI@cluster0.xmbzkh2.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();

