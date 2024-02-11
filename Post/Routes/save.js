import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {type,id,uid} = req.body;
        
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
        if(id==undefined || uid==undefined || type==undefined){
            res.status(400).json({message: "Post id, user id and type are required"});
            return;
        }

        if (id === "") {
            res.status(400).json({message: "Post id is required"});
            return;
        }

        if (uid === "") {
            res.status(400).json({message: "User id is required"});
            return;
        }

        const r = await axios.post(`${user_url.url}/checkBan`, {
            pid: id,
            uid:user_id
        });

        if(r.status!=200){
        res.sendStatus(400).send({message:"Banned"})
        }

        if(type === "save"){
            const like = await prisma.post.update({
                where:{
                    id:id
                },
                data:{
                    savedBy:{
                        connect:{
                            id:uid
                        }
                    }
                }
            })
        }
        else if(type === "unsave"){
            const dislike = await prisma.post.update({
                where:{
                    id:id
                },
                data:{
                    savedBy:{
                        disconnect:{
                            id:uid
                        }
                    }
                }
            })
        }
        else{
            res.status(400).json({message: "Invalid type"});
            return;
        }

        res.status(200).json({message: "Success"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});


export default router;