const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://test:coder@cluster0.q6dhk.mongodb.net/clase44?retryWrites=true&w=majority');
    console.log('MongoDB connected');
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
