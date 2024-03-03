import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.get('/writtenPosts', async(req, res) => {
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

        const posts = await prisma.post.findMany({
            select:{
                createdAt:true,
            }
        });
        
        res.status(200).json({posts:posts});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});


router.get('/addedNotices', async(req, res) => {
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

        const notices = await prisma.notice.findMany({
            select:{
                createdAt:true,
            }
        });
        
        res.status(200).json({notices:notices});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/createdEvents', async(req, res) => {
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

        const events = await prisma.event.findMany({
            select:{
                createdAt:true,
            }
        });
        
        res.status(200).json({events:events});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/postAll', async(req, res) => {
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

        const posts = await prisma.post.findMany({
            select:{
                likedBy: true,
                savedBy: true,
                viewedBy: true,
                type: true,
                tags: true,
                reportedCount: true,
            },
        });
        
        var mapper = {
            "General":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
                "TUITION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "BLOOD":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "DISCUSSION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "PRODUCT":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
            },
            "Batch":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
                "TUITION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "BLOOD":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "DISCUSSION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "PRODUCT":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
            },
            "Dept":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
                "TUITION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "BLOOD":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "DISCUSSION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "PRODUCT":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
            },
            "BatchDept":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
                "TUITION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "BLOOD":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "DISCUSSION":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
                "PRODUCT":{
                    "likedBy":0,
                    "savedBy":0,
                    "viewedBy":0,
                    "reportedCount":0,
                },
            },
            "TUITION":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
            },
            "BLOOD":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
            },
            "DISCUSSION":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
            },
            "PRODUCT":{
                "likedBy":0,
                "savedBy":0,
                "viewedBy":0,
                "reportedCount":0,
            },
        }
        
        posts.map((post) => {
            mapper[post.type].likedBy += post.likedBy.length;
            mapper[post.type].savedBy += post.savedBy.length;
            mapper[post.type].viewedBy += post.viewedBy.length;
            mapper[post.type].reportedCount += post.reportedCount;
            //
            post.tags.map((tag) => {
                console.log(post.type,tag);
                mapper[post.type][tag].likedBy += post.likedBy.length;
                mapper[post.type][tag].savedBy += post.savedBy.length;
                mapper[post.type][tag].viewedBy += post.viewedBy.length;
                mapper[post.type][tag].reportedCount += post.reportedCount;
        
                mapper[tag].likedBy += post.likedBy.length;
                mapper[tag].savedBy += post.savedBy.length;
                mapper[tag].viewedBy += post.viewedBy.length;
                mapper[tag].reportedCount += post.reportedCount;
            });
            //
            return null;
        });
        // console.log(mapper);
        
        res.status(200).json({mapper:mapper});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/eventAll', async(req, res) => {
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
        
        const events = await prisma.event.findMany({
            select:{
                participatedBy: true,
                savedBy:true,
                tag:true
            },
        });
        
        var mapper = {
            "Workshop":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Seminar":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Sports":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Competition":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Rag_concert":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Shapa_day":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Flashmob":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Cultural":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Picnic":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Tour":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Normal_Online_Event":{
                "participatedBy":0,
                "savedBy":0,
            },
            "Normal_Offline_Event":{
                "participatedBy":0,
                "savedBy":0,
            },
        }
        
        events.map((event) => {

            mapper[event.tag].participatedBy += event.participatedBy.length;
            mapper[event.tag].savedBy += event.savedBy.length;
            return null;
        });
        // console.log(mapper);
        
        res.status(200).json({mapper:mapper});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;