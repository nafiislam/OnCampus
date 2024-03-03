import express from 'express';
import { Tag,Role, ReminderTag, MeetingType } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.post('/addNotice', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin,br} = req.headers;
        const {title,
            content,
            imgList,
            list} = req.body;

        if(title==undefined || content==undefined || imgList==undefined || list==undefined){
            res.status(400).json({message: "All fields are required"});
            return;
        }
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        if (title === "") {
            res.status(400).json({message: "Title is required"});
            return;
        }
    
        if (content === "") {
            res.status(400).json({message: "Content is required"});
            return;
        }
    
        if (imgList?.length > 6) {
            res.status(400).json({message: "Maximum 6 images are allowed"});
            return;
        }
    
        if (list?.length > 6) {
            res.status(400).json({message: "Maximum 6 files are allowed"});
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

        if(!br&&!admin){
            res.status(401).json({message: "Not eligible to perform this action"});
            return;
        }

        var images = [];
        var files = [];
        var imageNames = [];
        var fileNames = [];
        if(imgList){
            imgList.forEach((img) => {
                images.push(img.url);
                imageNames.push(img.name);
            });
        }
        if(list){
            list.forEach((file) => {
            files.push(file.url);
            fileNames.push(file.name);
            });
        }

        console.log("notice");
        const notice = await prisma.notice.create({
            data: {
                title: title,
                description: content,
                images: images,
                imageNames: imageNames,
                attachments: files,
                attachmentNames: fileNames,
                author: {
                    connect: {
                        id: user_id,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        res.status(200).json({message: "Notice added successfully"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.post("/getNotice", async (req, res) => {
    try {
        const { email, admin } = req.headers;
        const { id } = req.body;

        if (!email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (id === undefined) {
            res.status(400).json({ message: "Notice id is required" });
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

        var notice = await prisma.notice.findUnique({
            where: {
                id: id,
            },
            select: {
                id:true,
                title: true,
                description: true,
                author: {
                    select: {
                        profilePicture: true,
                        name: true,
                        id: true,
                        email: true,
                    }
                },
                images: true,
                imageNames: true,
                attachments: true,
                attachmentNames: true,
                createdAt: true,
                updatedAt: true,
            },
        });

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

        if (notice === null) {
            res.status(400).json({ message: "Notice not found" });
            return;
        }

        notice = {
            ...notice,
            user: user,
        }

        res.status(200).json({ notice: notice });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get("/getAllNotices", async (req, res) => {
    try {
        const { email, admin } = req.headers;

        if (!email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const notices = await prisma.notice.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                images: true,
                imageNames: true,
                attachments: true,
                attachmentNames: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        // console.log(notices);
        res.status(200).json({ notices: notices });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/updateNotice', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin,br} = req.headers;
        const {title,
            content,
            imgList,
            list,nid} = req.body;

        if(title==undefined || content==undefined || imgList==undefined || list==undefined){
            res.status(400).json({message: "All fields are required"});
            return;
        }
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        if (title === "") {
            res.status(400).json({message: "Title is required"});
            return;
        }
    
        if (content === "") {
            res.status(400).json({message: "Content is required"});
            return;
        }
    
        if (imgList?.length > 6) {
            res.status(400).json({message: "Maximum 6 images are allowed"});
            return;
        }
    
        if (list?.length > 6) {
            res.status(400).json({message: "Maximum 6 files are allowed"});
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

        if(!br&&!admin){
            res.status(401).json({message: "Not eligible to perform this action"});
            return;
        }

        var images = [];
        var files = [];
        var imageNames = [];
        var fileNames = [];
        if(imgList){
            imgList.forEach((img) => {
                images.push(img.url);
                imageNames.push(img.name);
            });
        }
        if(list){
            list.forEach((file) => {
            files.push(file.url);
            fileNames.push(file.name);
            });
        }

        console.log("notice update");
        const notice = await prisma.notice.update({
            where: {
                id: nid,
                userId: user_id
            },
            data: {
                title: title,
                description: content,
                images: images,
                imageNames: imageNames,
                attachments: files,
                attachmentNames: fileNames,
            },
        });

        res.status(200).json({message: "Notice updated successfully"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/deleteNotice/:id', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
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
            res.status(400).json({message: "Notice id are required"});
            return;
        }

        if (id === "") {
            res.status(400).json({message: "Notice id is required"});
            return;
        }

        if(!admin){
            const status = await axios.post(`${user_url.url}/postUserAuth`, {
                uid: user_id,
                pid: id
            });
            if(status.status !== 200){
                res.status(400).json({message: "User does not have the permission to perform this action"});
                return;
            }
        }

        const post = await prisma.notice.delete({
            where:{
                id:id
            }
        })

        res.status(200).json({message: "Success"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
})

export default router;