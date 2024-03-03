import axios from 'axios';
import cokieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors_middleware from './cors_middleware.js';

dotenv.config();
const app = express();
const port = 5004;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cokieParser());
app.use(cors_middleware);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));//set the static files dir of express app

//server register
try {
    const response = await axios.post('http://localhost:5003/registerService', {
        serverName: "event",
        url: `http://localhost:${port}`
    });

    if (response.status !== 200) {
        console.log(response.data.message);
        process.exit(0);
    }
} catch (error) {
    console.error("An error occurred while making the request:", error.message);
    process.exit(0);
}

import createEvent from './Routes/createEvent.js';
app.use('/createEvent',createEvent);

import getEvent from './Routes/getEvent.js';
app.use('/getEvent',getEvent);

import getEvents from './Routes/getEvents.js';
app.use('/getEvents',getEvents);


import notice from './Routes/notice.js';
app.use('/notice',notice);

import checkLocation from './Routes/checkLocation.js';
app.use('/checkLocation',checkLocation);

import addToGoogleCalender from './Routes/addToGoogleCalender.js';
app.use('/addToGoogleCalender',addToGoogleCalender);

import participateEvent from './Routes/participateEvent.js';
app.use('/participateEvent',participateEvent);

import myParticipatingEvents from './Routes/myParticipatingEvents.js';
app.use('/myParticipatingEvents',myParticipatingEvents);

import saveEvent from './Routes/saveEvent.js';
app.use('/saveEvent',saveEvent);

import getMySavedEvents from './Routes/getMySavedEvents.js';
app.use('/getMySavedEvents',getMySavedEvents);

import getMyCreatedEvents from './Routes/getMyCreatedEvents.js';
app.use('/getMyCreatedEvents',getMyCreatedEvents);


//404 error handler
app.use((req, res, next) => {
    res.status(404).json({message: "Not Found"});
});

//custom error handler
app.use((err, req, res, next) => {
    console.error(err);
    if(res.headersSent){
        next(err);//if headers already sent, pass the error to the default error handler
    }
    if(err.message){
        res.status(500).json({message: err.message});
    }
    else{
        res.status(500).json({message: "There was an Error"});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});

// Listen for termination and interrupt signals
process.on('SIGTERM', gracefulShutdown); // For termination signal
process.on('SIGINT', gracefulShutdown); // For interrupt signal

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // You might want to handle this differently based on your application's needs
});

// Graceful shutdown function
async function gracefulShutdown() {
    console.log('Received shutdown signal. Closing connections and cleaning up...');
    try {
        const response = await axios.post('http://localhost:5003/unRegisterService', {
            serverName: "event",
        });
    
        if (response.status !== 200) {
            console.log(response.data.message);
            process.exit(0);
        }
    } catch (error) {
        console.error("An error occurred while making the request:", error.message);
        process.exit(0);
    }
    // Exit the process
    process.exit(0);
}