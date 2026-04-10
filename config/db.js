const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://parfait:kigali123@cluster0.rcatggx.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log("Mongo connection Error" + err));

function closeConnection(){
    mongoose.connection.close();
}

module.exports = {closeConnection};