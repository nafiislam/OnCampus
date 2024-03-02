import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.post('/General', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {type} = req.body;
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
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

        if(user.accessGeneral === "BANNED"){
            res.status(400).json({message: "You don't have access to this feature"});
            return;
        }

        console.log(user); 

        if(type === "all"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"General"
                    },
                    // author:{
                    //     batch:{
                    //         equals:user.batch,
                    //     },
                    //     department:{
                    //         equals:user.department,
                    //     }
                    // }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else if(type=="TUITION"||type=="BLOOD"||type=="DISCUSSION"||type=="PRODUCT"||type=="TECH"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"General"
                    },
                    tags:{
                        has:type
                    },
                    // author:{
                    //     batch:{
                    //         equals:user.batch,
                    //     },
                    //     department:{
                    //         equals:user.department,
                    //     }
                    // }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else{
            res.status(400).json({message: "Invalid type"});
            return;
        }

        res.status(200).json({posts:posts,user: user});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/Batch', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {type} = req.body;
        
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
                accessBatch:true,
            }
        })
        
        if(user.accessBatch === "BANNED"){
            res.status(400).json({message: "You don't have access to this feature"});
            return;
        }

        if(type === "all"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"Batch"
                    },
                    author:{
                        batch:{
                            equals:user.batch,
                        },
                    }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else if(type=="TUITION"||type=="BLOOD"||type=="DISCUSSION"||type=="PRODUCT"||type=="TECH"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"Batch"
                    },
                    tags:{
                        has:type
                    },
                    author:{
                        batch:{
                            equals:user.batch,
                        },
                    }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else{
            res.status(400).json({message: "Invalid type"});
            return;
        }

        res.status(200).json({posts:posts,user: user});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/Dept', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {type} = req.body;
        
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
                accessDept:true,
            }
        })

        if(user.accessDept === "BANNED"){
            res.status(400).json({message: "You don't have access to this feature"});
            return;
        }

        if(type === "all"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"Dept"
                    },
                    author:{
                        department:{
                            equals:user.department,
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else if(type=="TUITION"||type=="BLOOD"||type=="DISCUSSION"||type=="PRODUCT"||type=="TECH"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"Dept"
                    },
                    tags:{
                        has:type
                    },
                    author:{
                        department:{
                            equals:user.department,
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else{
            res.status(400).json({message: "Invalid type"});
            return;
        }

        res.status(200).json({posts:posts,user: user});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/BatchDept', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {type} = req.body;
        
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
                accessDeptBatch:true
            }
        })

        if(user.accessDeptBatch === "BANNED"){
            res.status(400).json({message: "You don't have access to this feature"});
            return;
        }

        if(type === "all"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"BatchDept"
                    },
                    author:{
                        batch:{
                            equals:user.batch,
                        },
                        department:{
                            equals:user.department,
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else if(type=="TUITION"||type=="BLOOD"||type=="DISCUSSION"||type=="PRODUCT"){
            var posts = await prisma.post.findMany({
                where:{
                    type:{
                        equals:"BatchDept"
                    },
                    tags:{
                        has:type
                    },
                    author:{
                        batch:{
                            equals:user.batch,
                        },
                        department:{
                            equals:user.department,
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
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
                    anonymous:true,
                    isPoll:true,
                    tags:true,
                    likedBy:{
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
                    bloodInfo:true,
                    tuitionInfo:true,
                    productInfo:true,
                    open:true,
                }
            })
        }
        else{
            res.status(400).json({message: "Invalid type"});
            return;
        }

        res.status(200).json({posts:posts,user: user});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;