import express from 'express';
import prisma from '../db.js'
import axios from 'axios';
import getRegistry from '../server.js';
const router = express.Router();


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
        console.log(email);
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
                id:true,
                name:true,
                email:true,
                profilePicture:true,
            }
        })         


        var event = await prisma.event.findUnique({
                where:{
                    id:id
                },
                select:{
                    id:true,
                    title:true,
                    description:true,
                    startDate:true,
                    finishDate:true,
                    eventType:true,
                    location:true,
                    onlineLink:true,
                    createdAt:true,
                    updatedAt:true,
                    organizers:true,
                    Sponsors:true,
                    registration:true,
                    rules:true,
                    prizes:true,
                    participatedBy:true,
                    timeline: {
                        select: {
                            id:true,
                            name:true,
                            description:true,
                            startDate:true,
                            finishDate:true,
                            meetingType:true,
                            location:true,
                            onlineLink:true,
                        }
                    },
                    resources: {
                        select :{
                            id:true,
                            description:true,
                            link:true,
                        }
                    },
                    tag : true,
                    participatedBy: {
                        select: {
                            id:true,
                            name:true,
                            email:true,
                            profilePicture:true,
                        }
                    },
                    savedBy: {
                        select: {
                            id:true,
                            name:true,
                            email:true,
                            profilePicture:true,
                        }
                    },   
                }
            })   
            const isParticipating = event.participatedBy.some(user => user.id === user_id);
            const isSaved = event.savedBy.some(user => user.id === user_id);

            


            event = {
                ...event,
                user: user,
                isParticipating : isParticipating,
                isSaved : isSaved
            }

            console.log(event);

        if(event){
            res.status(200).json({event});
        }
        else{
            res.status(400).json({message: "Event not found"});
        }
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;