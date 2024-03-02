import express from 'express'
import cokieParser from 'cookie-parser'
import dotenv from 'dotenv';
import cors_middleware from './cors_middleware.js';
import path from 'path';
import axios from 'axios';

dotenv.config();
const app = express();
const port = 5002;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cokieParser());
app.use(cors_middleware);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));//set the static files dir of express app

//server register
try {
    const response = await axios.post('http://localhost:5003/registerService', {
        serverName: "post",
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

import createPost from './Routes/createPost.js';
app.use('/createPost',createPost);

import getPost from './Routes/getPost.js';
app.use('/getPost',getPost);

import createComment from './Routes/createComment.js';
app.use('/createComment',createComment);

import like from './Routes/like.js';
app.use('/like',like);

import save from './Routes/save.js';
app.use('/save',save);

import vote from './Routes/vote.js';
app.use('/vote',vote);

import getPosts from './Routes/getPosts.js';
app.use('/getPosts',getPosts);

import int from './Routes/int.js';
app.use('/int',int);

import status from './Routes/status.js';
app.use('/status',status);

import commentStatus from './Routes/commentStatus.js';
app.use('/commentStatus',commentStatus);

import deletePost from './Routes/deletePost.js';
app.use('/deletePost',deletePost);

import deleteComment from './Routes/deleteComment.js';
app.use('/deleteComment',deleteComment);

import updateComment from './Routes/updateComment.js';
app.use('/updateComment',updateComment);

import getNotification from './Routes/getNotification.js';
app.use('/getNotification',getNotification);

import updatePost from './Routes/updatePost.js';
app.use('/updatePost',updatePost);

import report from './Routes/report.js';
app.use('/report',report);

import reportedPosts from './Routes/reportedPosts.js';
app.use('/reportedPosts',reportedPosts);

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
            serverName: "post",
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