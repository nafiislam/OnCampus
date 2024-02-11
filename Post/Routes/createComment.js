import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.post('/comment', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {content,cid,pid} = req.body;
        
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

        if(content==undefined || pid==undefined || cid==undefined){
            res.status(400).json({message: "Content, post id and comment id are required"});
            return;
        }

        if (content === "") {
            res.status(400).json({message: "Content is required"});
            return;
        }

        if (pid === "") {
            res.status(400).json({message: "Post id is required"});
            return;
        }

        if (cid === "") {
            res.status(400).json({message: "Comment id is required"});
            return;
        }

        const r = await axios.post(`${user_url.url}/checkBan`, {
            pid: pid,
            uid:user_id
        });

        if(r.status!=200){
        res.sendStatus(400).send({message:"Banned"})
        }

        const comment = await prisma.comment.create({
            data:{
                content:content,
                author:{
                    connect:{
                        id:user_id
                    }
                },
                post:{
                    connect:{
                        id:pid
                    }
                },
                comment:{
                    connect:{
                        id:cid
                    }
                }
            },
            select:{
                id:true,
                content:true,
                likedBy:true,
                parentCommentID:true,
                parentPostId:true,
                author:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                createdAt:true,
            }
        })

        res.status(200).json({comment});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/post', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {content,pid} = req.body;
        
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

        if(content==undefined || pid==undefined){
            res.status(400).json({message: "Content, post id are required"});
            return;
        }

        if (content === "") {
            res.status(400).json({message: "Content is required"});
            return;
        }

        if (pid === "") {
            res.status(400).json({message: "Post id is required"});
            return;
        }

        const r = await axios.post(`${user_url.url}/checkBan`, {
            pid: pid,
            uid:user_id
        });

        if(r.status!=200){
        res.sendStatus(400).send({message:"Banned"})
        }

        const comment = await prisma.comment.create({
            data:{
                content:content,
                author:{
                    connect:{
                        id:user_id
                    }
                },
                post:{
                    connect:{
                        id:pid
                    }
                }
            },
            select:{
                id:true,
                content:true,
                likedBy:true,
                parentCommentID:true,
                parentPostId:true,
                author:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                createdAt:true,
            }
        })

        res.status(200).json({comment});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;