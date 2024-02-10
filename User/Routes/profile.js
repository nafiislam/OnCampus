import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {id,uid,type} = req.body;
        
        if(!email){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        
        const user = await prisma.user.findMany({
            where:{
                email: email
            },
            select:{
                id: true,
                email:true,
                name:true,
                profilePicture:true,
                posts:true,
                comments:true,
                likedPosts:{

                    take: 5,
                },
                savedPosts:true,
                viewedPosts:true,
                createdAt:true,
                role:true,
                likedComments:true,
                ClubMember:true,
                session:true,
                batch:true,
                meritPosition:true,
                department:true
            }
        })
        console.log(user);
        if(user.length === 0 || user.length > 1){
            res.status(404).json({id:-1});
            return;
        }
        const user_id = user_id_res.data.id;
        console.log("user_id: ", user_id);

        if (user_id === '-1') {
            res.status(400).json({message: "User not found"});
            return;
        }
        res.status(200).json(user[0]);
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;