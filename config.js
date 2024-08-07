const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://shahnapshahna243:shahnapshahna243@cluster0.xmbzkh2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();
