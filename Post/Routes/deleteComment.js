import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.get('/:id', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        console.log(admin);
        const {id} = req.params;
        
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

        if(id==undefined){
            res.status(400).json({message: "Post id are required"});
            return;
        }

        if (id === "") {
            res.status(400).json({message: "Post id is required"});
            return;
        }

        if(!admin){
            const status = await axios.post(`${user_url.url}/commentUserAuth`, {
                uid: user_id,
                cid: id
            });
            if(status.status !== 200){
                res.status(400).json({message: "User does not have the permission to perform this action"});
                return;
            }
        }

        const post_id = await prisma.comment.delete({
            where:{
                id:id
            },
            select:{
                post:{
                    select:{
                        id:true
                    }
                }
            }
        })

        const post = await prisma.post.findMany({
            where:{
                id:post_id.post.id
            },
            select:{
                comments:{
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
                    },
                    orderBy:{
                        createdAt:'desc'
                    }
                }
            }
        })

        res.status(200).json({comments: post[0].comments});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
})

export default router;