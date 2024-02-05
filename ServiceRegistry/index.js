import express from 'express'
import cokieParser from 'cookie-parser'
import dotenv from 'dotenv';
import cors_middleware from './cors_middleware.js';
import path from 'path';

dotenv.config();
const app = express();
const port = 5003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cokieParser());
app.use(cors_middleware);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));//set the static files dir of express app

var registry = {
    "services": {
    }
}

app.post('/getServiceUrl', (req, res) => {
    const { serverName } = req.body;
    if (!registry.services[serverName]) {
        res.status(404).json({ message: "Service Not Found" });
    }
    else {
        res.status(200).json(registry.services[serverName]);
    }
})

app.post('/registerService', (req, res) => {
    const { serverName, url } = req.body;
    registry.services[serverName] = {
        "url": url
    }
    res.status(200).json({ message: "Service Registered" });
})

app.post('/unRegisterService', (req, res) => {
    const { serverName } = req.body;
    registry.services[serverName] = null;
    res.status(200).json({ message: "Service Registered" });
})

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
