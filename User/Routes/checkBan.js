import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        const {type,uid} = req.body;
        
        if(!type || !uid){
            res.status(400).json({message: "All fields are required"});
            return;
        }

        const user = await prisma.user.findMany({
            where:{
                id: uid,
            },
            select:{
                accessGeneral: true,
                accessDept:true,
                accessBatch:true,
                accessDeptBatch:true
            }
        })

        if(user.length === 0){
            res.status(404).json({message: "User not found"});
            return;
        }

        const {accessGeneral,accessDept,accessBatch,accessDeptBatch} = user[0];

        res.status(200).json({accessGeneral,accessDept,accessBatch,accessDeptBatch});
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;