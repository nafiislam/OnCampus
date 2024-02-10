import express from 'express';
// import prisma from '../db.js'
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient()

router.post('/', async(req, res) => {
    try{
      console.log(req.body);
      const {email ,admin} = req.headers;
      const {title, 
              description, 
              startDate, 
              finishDate, 
              eventType, 
              location, 
              onlineLink, 
              organizers, 
              Sponsors, 
              registration, 
              rules, 
              prizes, 
              timeline, 
              resources, 
              tag} = req.body;

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

      const event = await prisma.event.create({
          data: {
              title: title,
              description: description,
              startDate: startDate,
              finishDate: finishDate,
              eventType: eventType,
              location: location,
              onlineLink: onlineLink,
              organizers: organizers,
              Sponsors: Sponsors,
              registration: registration,
              rules: rules,
              prizes: prizes,
              tag: tag, 
          },
          select : {
            id: true,
          }
      });

      if(timeline){
        timeline.forEach(async (t) => {
          await prisma.timeline.create({
            data: {
              name: t.name,
              description: t.description,
              startDate: t.startDate,
              finishDate: t.finishDate,
              meetingType: t.meetingType,
              location: t.location,
              onlineLink: t.onlineLink,
              Event:{
                connect:{
                  id: event.id,
                },
              },
            },
          }) ;         
        });
      }

      if(resources){
        resources.forEach(async (r) => {
          await prisma.resources.create({
            data: {
              description : r.description,
              link : r.link,

              Event: {
                connect: {
                  id: event.id,
                },
              },
            },
          });
        });
      }

      res.status(200).json({message: "Event Created Successfully"});

    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;