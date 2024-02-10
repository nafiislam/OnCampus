import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {uid, pid} = req.body;

        const post_id = await prisma.post.findMany({
            where:{
                id: pid,
                author:{
                    id: uid
                }
            },
            select:{
                id: true
            }
        })

        if(post_id.length === 0){
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