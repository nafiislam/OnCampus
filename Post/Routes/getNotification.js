import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.get('/new', async(req, res) => {
    try{
        const {email ,admin} = req.headers;
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        const user_url = await getRegistry("user");
        const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
            email: email,
        });
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({message: "User not found"});
            return;
        }
        
        const newNotifications = await prisma.notification.findMany({
            where:{
                belongsToId:user_id,
                seen:false
            },
            include:{
                author:true,
                belongsTo:true,
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        res.status(200).json({newNotifications:newNotifications});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/makeSeen', async(req, res) => {
    try{
        const {email ,admin} = req.headers;
        const {nid} = req.body
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        
        const user_url = await getRegistry("user");
        const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
            email: email,
        });
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({message: "User not found"});
            return;
        }

        if(nid==undefined || nid==""){
            res.status(400).json({message:"nid not given"})
            return
        }
        
        const makeSeen = await prisma.notification.update({
            where:{
                id:nid,
                belongsToId:user_id,
                seen:false
            },
            data:{
                seen:true
            }
        })
        
        res.status(200).json({msg:"made seen"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/all', async(req, res) => {
    try{
        const {email ,admin} = req.headers;
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        
        const user_url = await getRegistry("user");
        const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
            email: email,
        });
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({message: "User not found"});
            return;
        }
        
        const notifications = await prisma.notification.findMany({
            where:{
                belongsToId:user_id,
            },
            include:{
                author:true,
                belongsTo:true,
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        res.status(200).json({notis:notifications});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;