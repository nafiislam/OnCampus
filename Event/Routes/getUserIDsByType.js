import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        const {email,type} = req.body;
        const user = await prisma.user.findMany({
            where:{
                email: email
            },
            select:{
                batch: true,
                department: true,
            }
        })
        console.log(user);
        if(user.length === 0 || user.length > 1){
            res.status(404).json(user);
            return;
        }
        const batch = user[0].batch;
        const department = user[0].department;
        let users = [];
        if(type === "Batch"){
            users = await prisma.user.findMany({
                where:{
                    batch: batch,
                    email: {
                        not: email
                    }
                },
                select:{
                    id: true
                }
            })
        }
        else if(type === "Dept"){
            users = await prisma.user.findMany({
                where:{
                    department: department,
                    email: {
                        not: email
                    }
                },
                select:{
                    id: true
                }
            })
        }
        else if(type === "General"){
            users = await prisma.user.findMany({
                where:{
                    email: {
                        not: email
                    }
                },
                select:{
                    id: true
                }
            })
        }
        else if(type === "BatchDept"){
            users = await prisma.user.findMany({
                where:{
                    batch: batch,
                    department: department,
                    email: {
                        not: email
                    }
                },
                select:{
                    id: true
                }
            })
        }
        else{
            res.status(404).json(user);
            return;
        }
        console.log(users);
        res.status(200).json(users);
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;