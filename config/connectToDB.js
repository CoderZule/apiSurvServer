if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require("mongoose");
const socketIO = require('socket.io');

let io;

async function connectToDB(server) {
    try {
        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 5000,  
             
        });
        console.log("Connected to DB");

        const db = mongoose.connection;

       
        io = socketIO(server);

        // Set up change stream for collections
        
        const usersChangeStream = db.collection('users').watch();
        usersChangeStream.on('change', (change) => {
            console.log('User collection change:', change);
            io.emit('usersChange', change);
        });

        const foragesChangeStream = db.collection('forages').watch();
        foragesChangeStream.on('change', (change) => {
            console.log('Forage collection change:', change);
            io.emit('foragesChange', change);
        });
        
       
        
    
    } catch (err) {
        console.log(err);
    }
}


function getIO() {
    return io;
}

module.exports = {
    connectToDB,
    getIO
};
