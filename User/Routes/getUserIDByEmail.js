import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email} = req.body;
        console.log(email);
        const user = await prisma.user.findMany({
            where:{
                email: email
            },
            select:{
                id: true
            }
        })
        console.log(user);
        if(user.length === 0 || user.length > 1){
            res.status(404).json({id:-1});
            return;
        }
        res.status(200).json(user[0]);
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;