import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.get('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        if(admin !== "true"){
            res.status(400).json({message: "User does not have the permission to perform this action"});
            return;
        }
        
        const u = await prisma.user.findUnique({
            where:{
                email:email,
                role:"ADMIN"
            }
        })
        if(!u){
            res.status(400).json({message: "User does not have the permission to perform this action"});
            return;
        }

        const user_url = await getRegistry("user");
        console.log(user_url);
        const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
            email: email,
        });
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({message: "User not found"});
            return;
        }

        //have to shift to user service
        const user = await prisma.user.findUnique({
            where:{
                id:user_id
            },
            select:{
                batch:true,
                department:true,
                id:true,
                name:true,
                email:true,
                profilePicture:true,
                accessGeneral: true,
            }
        })

        console.log(user); 

        var posts = await prisma.post.findMany({
            where:{
                reportedCount:{
                    not: 0
                },
            },
            select:{
                id:true,
                title:true,
                type:true,
                author:{
                    select:{
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                anonymous:true,
                isPoll:true,
                tags:true,
                reportedBy:{
                    select:{
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                reportedCount:true,
                createdAt:true,
                updatedAt:true,
                commentAllow:true,
                open:true,
            }
        });
        res.status(200).json({posts:posts,user: user});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});


export default router;