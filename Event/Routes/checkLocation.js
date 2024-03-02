import axios from 'axios';
import express from 'express';
import prisma from '../db.js';
import getRegistry from '../server.js';
const router = express.Router();


router.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const {email ,admin} = req.headers;
        const {startDate, finishDate, location} = req.body;
        var sdate = startDate;
        var fdate = finishDate;
        var lc = location;

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
        });

        let conflictingEvents = [];

        // first get all events that are in the same location
        const events = await prisma.event.findMany({
            where:{
                location: lc
            },
            select:{
               id:true,
               title:true,
               startDate:true,
               finishDate:true,
               organizers:true,
               location:true,
            }
        });

        console.log("events: ", events);

        // convert the start and finish date to a date object
        sdate = new Date(sdate);
        fdate = new Date(fdate);

        // convert all the start and finish dates of the events to a date object
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            event.startDate = new Date(event.startDate);
            event.finishDate = new Date(event.finishDate);
        }


        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            // check if the start date of the event is between the start and finish date of the new event
            if (event.startDate >= sdate && event.startDate <= fdate) {
                conflictingEvents.push(event);
            }
            // check if the finish date of the event is between the start and finish date of the new event
            if (event.finishDate >= sdate && event.finishDate <= fdate) {
                conflictingEvents.push(event);
            }
            // check if the start and finish date of the event is between the start and finish date of the new event
            if (event.startDate <= sdate && event.finishDate >= fdate) {
                conflictingEvents.push(event);
            }
            // check if the start and finish date of the new event is between the start and finish date of the event
            if (sdate <= event.startDate && fdate >= event.finishDate) {
                conflictingEvents.push(event);
            }
        }

        console.log("conflictingEvents: ", conflictingEvents);


        if (conflictingEvents.length === 0) {
            res.status(200).json({message: "No conflicting events", conflictingEvents: conflictingEvents});
            return;
        }

        res.status(200).json({message: "Conflicting events", conflictingEvents: conflictingEvents});


        
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error in Events"});
    }
});

export default router;