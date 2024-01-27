import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();
function processNestedComments(comments){
    let groupedComments = {}
    comments.forEach(comment => {
        if(!groupedComments[comment.parentCommentID]){
            groupedComments[comment.parentCommentID] = []
        }
        groupedComments[comment.parentCommentID].push(comment)
    })
    return groupedComments
}

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