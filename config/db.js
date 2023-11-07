const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect('mongodb://127.0.0.1/storybooks', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongDB Connected: ${connect.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;