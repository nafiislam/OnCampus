import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {cid, uid} = req.body;

        const c_id = await prisma.comment.findMany({
            where:{
                id: cid,
                author:{
                    id: uid
                }
            },
            select:{
                id: true
            }
        })

        if(c_id.length === 0){
            res.status(400).json({message: "User does not have the permission to perform this action"});
            return;
        }

        res.status(200).json({message: "User has the permission to perform this action"});
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;