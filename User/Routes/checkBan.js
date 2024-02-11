import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        const {pid,uid} = req.body;
        
        if(!pid || !uid){
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

        const postType = await prisma.post.findUnique({
            where:{
                id:pid
            },
            select:{
                type:true
            }
        })

        if(!postType){
            res.status(401).json({message: "not found post"});
            return;
        }

        const type = postType.type
        console.log(type)
        if(type=="General" && accessGeneral=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }
        else if(type=="Batch" && accessBatch=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }
        else if(type=="Dept" && accessDept=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }
        else if(type=="BatchDept" && accessDeptBatch=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }

        res.status(200).json({message:"success"});
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/type', async(req, res) => {
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

        console.log(type)
        if(type=="General" && accessGeneral=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }
        else if(type=="Batch" && accessBatch=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }
        else if(type=="Dept" && accessDept=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }
        else if(type=="BatchDept" && accessDeptBatch=="BANNED"){
            res.status(400).json({message: "Banned"});
            return;
        }

        res.status(200).json({message:"success"});
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;