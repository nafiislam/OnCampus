import dotenv from 'dotenv';
import getRegistry from './server.js';
import cokieParser from 'cookie-parser';
import axios from 'axios';
import helmet from 'helmet';
import express from 'express';
import auth_middleware from './auth_middleware.js';
import cors_middleware from './cors_middleware.js';

dotenv.config();
const app = express();

// Middleware for handling CORS
// app.use(cors({
//     origin:['http://127.0.0.1:5000','http://localhost:5000',`${process.env.DOMAIN}`],
//     credentials: true,
//     headers:['X-Requested-With','content-type','Authorization','Access-Control-Allow-Headers','Origin'],
//     methods:['GET','POST'],
// }));

// app.use(cors({credentials: true, origin: true}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cokieParser());
app.use(auth_middleware);
app.use(cors_middleware);

app.all('/api/:apiName*', async (req, res) => {
    console.log('apiName', req.params.apiName);
    const { apiName } = req.params;
    const path = req.params[0];
    console.log('path', path);
    const url = await getRegistry(apiName)
    console.log(req.br)
    if (url) {
        axios(
            {
                method: req.method,
                url: `${url.url}${path}`,
                data: req.body,
                headers: {
                    email: req.email,
                    admin: req.admin,
                    br: req.br,
                    cr: req.cr
                },
            }
        )
            .then((response) => {
                // Save cookies from the response to the gateway's response
                if (response.headers['set-cookie']) {
                    res.set('Set-Cookie', response.headers['set-cookie']);
                }
                res.send(response.data);
            })
            .catch((e) => {
                // console.error(e);

                res.status(500).json({ message: "Internal Server Error" });
            });
    }
    else {
        res.status(404).json({ message: "Not Found" });
    }
});

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

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
