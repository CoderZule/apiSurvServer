// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

// Import dependencies
const express = require('express');
const cors = require('cors');
const http = require('http'); // Require http module for socket.io
const { connectToDB } = require('./config/connectToDB');
const usersController = require('./controllers/usersController');
const apiariesController = require('./controllers/apiariesController');
const hivesController = require('./controllers/hivesController');
const inspectionsController = require('./controllers/inspectionsController');
const tasksController = require('./controllers/tasksController');
const harvestsController = require('./controllers/harvestsController');
const storageController = require('./controllers/storageController');
const transactionsController = require('./controllers/transactionsController');
const foragesController = require('./controllers/foragesController');

const app = express();


app.use(express.json());
app.use(cors());


const server = http.createServer(app);


const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true  // to pass cookies or headers
  }
});


connectToDB(server);


// Add admin if not exists (seeder)
usersController.AdminUser();



// ------------------------ AUTH ROUTES ------------------------
// Route to login
app.post('/api/user/login', usersController.loginUser);

//Route to register
app.post('/api/user/register', usersController.registerUser);


// ------------------------ ADMIN ROUTES ------------------------

//********** User routing **********
// Route to get all users
app.get('/api/user/getAllUsers', usersController.fetchUsers);
// Route to create a user
app.post('/api/user/create', usersController.createUser);
// Route to get user by ID
app.get('/api/user/getUserById/:id', usersController.getUserById);
// Route to edit user
app.post('/api/user/editUser', usersController.editUser);
// Route to delete user
app.post('/api/user/deleteUser', usersController.deleteUser);


//********** Forage routing **********
// Route to get all forages
app.get('/api/forage/getAllForages', foragesController.fetchForages);
// Route to create a forage
app.post('/api/forage/create', foragesController.createForage);
// Route to get forage by ID
app.get('/api/forage/getForageById/:id', foragesController.getForageById);
// Route to edit forage
app.post('/api/forage/editForage', foragesController.editForage);
// Route to delete forage
app.post('/api/forage/deleteForage', foragesController.deleteForage);


//********** Apiary routing **********
// Route to get all apiaries
app.get('/api/apiary/getAllApiaries', apiariesController.fetchApiaries);
// Route to add a new apiary
app.post('/api/apiary/create', apiariesController.createApiary);
// Route to get apiary by ID
app.get('/api/apiary/getApiaryById/:id', apiariesController.getApiaryById);
// Route to edit apiary
app.post('/api/apiary/editApiary', apiariesController.editApiary);
// Route to delete apiary
app.delete('/api/apiary/deleteApiary/:apiaryId', apiariesController.deleteApiary);


//********** Hive routing **********
// Route to get all hives
app.get('/api/hive/getAllHives', hivesController.fetchHives);
// Route to get Hives by Apiary Id
app.get('/api/hive/getHivesByApiary', hivesController.fetchHivesByApiary);
// Route to add a new hive
app.post('/api/hive/create', hivesController.createHive);
// Route to get hive by ID
app.get('/api/hive/getHiveById/:id', hivesController.getHiveById);
// Route to edit hive
app.post('/api/hive/editHive', hivesController.editHive);
// Route to delete hive
app.post('/api/hive/deleteHive', hivesController.deleteHive);


//  ------------------------ BEEKEEPER ROUTES ------------------------

//********** Password routing **********
// Route to change password on first login
app.post('/api/user/changePasswordFirstLogin', usersController.changePasswordFirstLogin);
// Route to change profil password
app.post('/api/user/changeProfilPassword', usersController.changeProfilPassword);

//********** Inspection routing **********
// Route to get all inspections
app.get('/api/inspection/getAllInspections', inspectionsController.fetchInspections);
// Route to add a new inspection
app.post('/api/inspection/create', inspectionsController.createInspection);
// Route to get inspection by Hive ID
app.get('/api/inspection/getInspectionByHiveId/:id', inspectionsController.getInspectionByHiveId);
// Route to edit inspection
app.post('/api/inspection/editInspection', inspectionsController.editInspection);
// Route to delete inspection
app.post('/api/inspection/deleteInspection', inspectionsController.deleteInspection);
// Route to get inspections with diseases
app.get('/api/inspection/getInspectionsWithDiseases', inspectionsController.fetchInspectionsWithDiseases);


//********** Task routing **********
// Route to get all tasks
app.get('/api/task/getAllTasks', tasksController.fetchTasks);
// Route to add a new task
app.post('/api/task/create', tasksController.createTask);
// Route to get task by ID
app.get('/api/task/getTaskById/:id', tasksController.getTaskById);
// Route to edit task
app.post('/api/task/editTask', tasksController.editTask);
// Route to delete task
app.post('/api/task/deleteTask', tasksController.deleteTask);


//********** Harvest routing **********
// Route to get all harvests
app.get('/api/harvest/getAllHarvests', harvestsController.fetchHarvests);
// Route to add a new harvest
app.post('/api/harvest/create', harvestsController.createHarvest);
// Route to get harvest by ID
app.get('/api/harvest/getHarvestById/:id', harvestsController.getHarvestById);
// Route to edit harvest
app.post('/api/harvest/editHarvest', harvestsController.editHarvest);
// Route to delete harvest
app.delete('/api/harvest/deleteHarvest/:harvestId', harvestsController.deleteHarvest);
// ROute to get top regions with best harvests
app.get('/api/harvest/TopRegionsHarvests', harvestsController.getTopRegions);


//********** Storage routing **********
// Route to get all storages
app.get('/api/storage/getAllStorages', storageController.fetchStorage);
// Route to update reduce quantity
app.put('/api/storage/updateQuantity', storageController.updateStorageQuantity);


//********** Transaction routing **********
// Route to get all transactions
app.get('/api/transaction/getAllTransactions', transactionsController.fetchTransaction);
// Route to add a new transaction
app.post('/api/transaction/create', transactionsController.createTransaction);
// Route to get transaction by ID
app.get('/api/transaction/getTransactionById/:id', transactionsController.getTransactionById);
// Route to edit transaction
app.post('/api/transaction/editTransaction', transactionsController.editTransaction);
// Route to delete trasaction
app.delete('/api/transaction/deleteTransaction/:transactionId', transactionsController.deleteTransaction);













// sets up a Socket.IO server to handle real-time connections. (listens for clients connecting and disconnecting)
// Handle connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});



const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});