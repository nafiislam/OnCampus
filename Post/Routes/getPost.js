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
router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {id} = req.body;
        
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

        var post = await prisma.post.findUnique({
            where:{
                id:id
            },
            select:{
                id:true,
                title:true,
                content:true,
                type:true,
                author:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
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
                },
                images:true,
                imageNames:true,
                attachments:true,
                attachmentNames:true,
                anonymous:true,
                isPoll:true,
                options:{
                    select:{
                        optionID:true,
                        title:true,
                        votedBy:{
                            select:{
                                profilePicture:true,
                                name:true,
                                id:true,
                                email:true,
                            }
                        }
                    }
                },
                tags:true,
                likedBy:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                viewedBy:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                savedBy:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                createdAt:true,
                updatedAt:true,
                commentAllow:true,
            }
        })

        // post = {
        //     ...post,
        //     comments: processNestedComments(post.comments)
        // }

        post = {
            ...post,
            email: email
        }

        // console.log(post);

        res.status(200).json({post});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;