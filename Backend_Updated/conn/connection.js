const mongoose =  require('mongoose');

// const MONGO_URI = "mongodb://0.0.0.0:27017/"

const connectToDatabase = async () => {
  try {
    // Replace 'yourMongoDBURI' with your actual MongoDB Atlas connection URI

    await mongoose.connect(process.env.MONGO_URI, {
      dbName:"univeristy-portal",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // process.exit(1);
  }
};

module.exports = connectToDatabase;
