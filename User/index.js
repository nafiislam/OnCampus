import express from 'express';
import cokieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors_middleware from './cors_middleware.js';
import path from 'path';
import axios from 'axios';

dotenv.config();
const app = express();
const port = 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cokieParser());
app.use(cors_middleware);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));//set the static files dir of express app

//server register
try {
    const response = await axios.post('http://localhost:5003/registerService', {
        serverName: "user",
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

import getUserIDByEmail from'./Routes/getUserIDByEmail.js';
app.use('/getUserIDByEmail',getUserIDByEmail);

import getUserIDsByType from'./Routes/getUserIDsByType.js';
app.use('/getUserIDsByType',getUserIDsByType);

import admin from './Routes/admin.js';
app.use('/admin', admin);

import profile from'./Routes/profile.js';
app.use('/profile',profile);

import getUser from'./Routes/getUser.js';
app.use('/getUser',getUser);

import postUserAuth from'./Routes/postUserAuth.js';
app.use('/postUserAuth',postUserAuth);

import commentUserAuth from'./Routes/commentUserAuth.js';
app.use('/commentUserAuth',commentUserAuth);

import checkBan from'./Routes/checkBan.js';
app.use('/checkBan',checkBan);

import analysis from'./Routes/analysis.js';
app.use('/analysis',analysis);


import user from './Routes/user.js';
app.use('/', user);


//404 error handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

//custom error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) {
        next(err);//if headers already sent, pass the error to the default error handler
    }
    if (err.message) {
        res.status(500).json({ message: err.message });
    }
    else {
        res.status(500).json({ message: "There was an Error" });
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
            serverName: "user",
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