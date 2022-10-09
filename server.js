const connectToDatabase = require('./db');

const express = require('express');
const { request } = require('http');
const path = require('path');
const cors = require('cors');


const app = express();
app.use('/public', express.static('public'))
app.use(cors())
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false, limit: '200mb'}));
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.post('/sync', async function(request, response) {
    console.log('Sync request received');

    // Prevent all other query types
    if (request.method !== 'POST') return response.json({ error: 'Only POST requests allowed' });

    console.log('Attempted to save data to server');
    console.log(request.body);

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Options for the database action
    let query, options, update;

    query = { _id: new Date().getTime() };
    options = { upsert: true };
    update = { $set: { data: request.body } };

    // Insert data to the database 
    // Read https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne
    let data = await db.collection('carData').updateOne(query, update, options);
    
    // For some fuck off reason, if this some how fails you have an edge case to tell people it didnt save
    if (!data) return response.status(500).send('Error while saving data to the database');

    // If everything is fine, return the data
    response.json({message: 'sync point'});

})

app.get('/pull', async function(request, response) {
    console.log('Pull request received');
    // Prevent all other query types
    if (request.method !== 'GET') return response.json({ error: 'Only GET requests allowed' });

    console.log('Attempted to send data to client');

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Options for the database action
    let query, options, update;

    // Fetch data from the database
    let data = await db.collection('carData').find({}).toArray();

    data = data.map( data => {
        return data.data;
    })

    

    // For some fuck off reason, if this some how fails you have an edge case to tell people it didn't save
    if (!data) return response.status(500).send('Error while saving data to the database');

    // If everything is fine, return the data
    response.json({message: 'Brain Data', data: data });

})




app.listen(port);
console.log('Server started at http://localhost:' + port);

