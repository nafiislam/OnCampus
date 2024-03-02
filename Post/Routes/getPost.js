import express from 'express';
import { Tag, Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { email, admin } = req.headers;
        const { id } = req.body;

        if (!email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user_url = await getRegistry("user");
        const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
            email: email,
        });
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({ message: "User not found" });
            return;
        }
        //have to shift to user service
        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            },
            select:{
                id:true,
                name:true,
                email:true,
                profilePicture:true,
                role:true
            }
        })

        var post = await prisma.post.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                type: true,
                author: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        likedBy: true,
                        parentCommentID: true,
                        parentPostId: true,
                        author: {
                            select: {
                                profilePicture: true,
                                name: true,
                                id: true,
                                email: true,
                            }
                        },
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                images: true,
                imageNames: true,
                attachments: true,
                attachmentNames: true,
                anonymous: true,
                isPoll: true,
                options: {
                    select: {
                        optionID: true,
                        title: true,
                        votedBy: {
                            select: {
                                profilePicture: true,
                                name: true,
                                id: true,
                                email: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                tags: true,
                likedBy: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                viewedBy: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                savedBy: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                intBy:{
                    select:{
                        profilePicture:true,
                        name:true,
                        id:true,
                        email:true,
                    }
                },
                reportedBy:{
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
                bloodInfo:true,
                tuitionInfo:true,
                productInfo:true,
                open:true,
            }
        })

        if(!post){
            res.status(400).json({message: "Post not found"});
            return;
        }

        if(post.type=="Dept" && user.accessDept=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        if(post.type=="Batch" && user.accessBatch=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        if(post.type=="BatchDept" && user.accessDeptBatch=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        if(post.type=="General" && user.accessGeneral=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        post = {
            ...post,
            user: user,
        }

        await prisma.post.update({
            where: {
                id: id
            },
            data: {
                viewedBy: {
                    connect: {
                        id: user_id
                    }
                }
            }
        })

        console.log(post);

        res.status(200).json({ post });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/update', async (req, res) => {
    try {
        console.log(req.body);
        const { email, admin } = req.headers;
        const { id } = req.body;

        if (!email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user_url = await getRegistry("user");
        const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
            email: email,
        });
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({ message: "User not found" });
            return;
        }
        //have to shift to user service
        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            },
            select:{
                id:true,
                name:true,
                email:true,
                profilePicture:true,
                role:true,
                accessGeneral: true,
                accessDept:true,
                accessBatch:true,
                accessDeptBatch:true
            }
        })

        var post = await prisma.post.findUnique({
            where: {
                id: id,
                authorId: user_id
            },
            select: {
                id: true,
                title: true,
                content: true,
                type: true,
                author: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        likedBy: true,
                        parentCommentID: true,
                        parentPostId: true,
                        author: {
                            select: {
                                profilePicture: true,
                                name: true,
                                id: true,
                                email: true,
                            }
                        },
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                images: true,
                imageNames: true,
                attachments: true,
                attachmentNames: true,
                anonymous: true,
                isPoll: true,
                options: {
                    select: {
                        optionID: true,
                        title: true,
                        votedBy: {
                            select: {
                                profilePicture: true,
                                name: true,
                                id: true,
                                email: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                tags: true,
                likedBy: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                viewedBy: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                savedBy: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                intBy:{
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
                bloodInfo:true,
                tuitionInfo:true,
                productInfo:true,
                open:true,
            }
        })

        if(!post){
            res.status(400).json({message: "Post not found"});
            return;
        }

        if(post.type=="Dept" && user.accessDept=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        if(post.type=="Batch" && user.accessBatch=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        if(post.type=="BatchDept" && user.accessDeptBatch=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        if(post.type=="General" && user.accessGeneral=="BANNED"){
            res.status(401).json({message: "Banned"});
            return;
        }

        post = {
            ...post,
            user: user,
        }

        await prisma.post.update({
            where: {
                id: id
            },
            data: {
                viewedBy: {
                    connect: {
                        id: user_id
                    }
                }
            }
        })

        res.status(200).json({ post });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;