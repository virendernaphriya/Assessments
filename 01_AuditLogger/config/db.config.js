const mongoose = require('mongoose');

const dbConfig=async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/VISO');
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

module.exports = dbConfig;