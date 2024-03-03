import axios from 'axios';
import express from 'express';
import prisma from '../db.js';
import getRegistry from '../server.js';
const router = express.Router();


router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;

        console.log("email: ", email);
        
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

        var events = await prisma.event.findMany({
            select:{
                id:true,
                title:true,
                startDate:true,
                finishDate:true,
                eventType:true,
                location:true,
                organizers:true,
                tag:true,
                createdAt:true,
            }
        });

        // const currentDate = new Date();

        // const currentlyRunningEvents = events.filter(event => {
        //     return currentDate >= new Date(event.startDate) && currentDate <= new Date(event.finishDate);
        // });

        // const upcomingEvents = events.filter(event => {
        //     return new Date(event.startDate) > currentDate;
        // });

        // const pastEvents = events.filter(event => {
        //     return new Date(event.finishDate) < currentDate;
        // });


        // // Concatenate the arrays in the desired order
        // events = currentlyRunningEvents.concat(upcomingEvents, pastEvents);



        // // sort events by startDate
        // events.sort((a, b) => {
        //     return new Date(a.startDate) - new Date(b.startDate);
        // });

        // // sort events by finishDate
        // events.sort((a, b) => {
        //     return new Date(a.finishDate) - new Date(b.finishDate);
        // });

        // // filter current events
        // events = events.filter(event => {
        //     const currentDate = new Date();
        //     return currentDate >= new Date(event.startDate) && currentDate <= new Date(event.finishDate);
        // });
        
        // // filter past events
        // events = events.filter(event => {
        //     return new Date(event.startDate) <= new Date();
        // });

        // // filter upcoming events
        // events = events.filter(event => {
        //     return new Date(event.startDate) >= new Date();
        // });



        // default sorting by createdAt
        events.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });



        if(events){
            res.status(200).json({events});
        }

        else{
            res.status(400).json({message: "Event not found"});
        }
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error in Events"});
    }
});

export default router;