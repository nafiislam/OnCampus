import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    const {user,admin} = req.headers;
    console.log(req.body);
    res.status(200).json({message: "Post Created"});
});

export default router;