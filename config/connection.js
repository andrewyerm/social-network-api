const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/socialNetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection successful!'))
.catch(err => console.error('Connection error:', err));

module.exports = mongoose.connection;
