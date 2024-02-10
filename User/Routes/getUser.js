import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.get('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        
        const user = await prisma.user.findMany({
            where:{
                email: email
            },
            select:{
                id: true,
                email:true,
                name:true,
                profilePicture:true,
                role:true,
            }
        })

        if(user.length === 0 || user.length > 1){
            res.status(400).json({message: "User not found"});
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