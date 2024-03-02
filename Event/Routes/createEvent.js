import axios from 'axios';
import express from 'express';
import prisma from '../db.js';
import getRegistry from '../server.js';
const router = express.Router();

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
              eventTag} = req.body;

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
              tag: eventTag,
              createdBy: {
                  connect: {
                      id: user_id,
                  },
              }, 
          },
          select : {
            id: true,
          }
      });


      console.log("ccccccccccc");

      

      if(timeline){
        timeline.forEach(async (t) => {
          console.log(t.finishDate);
          await prisma.timeline.create({
            data: {
              name: t.name,
              description: t.description,
              startDate: startDate,
              finishDate: finishDate,
              meetingType: "Offline",
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

      console.log("bbbbbbbbbbb");


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

      console.log("aaaaaaaaaaaaaaaa");

      res.status(200).json({message: "Event Created Successfully"});

    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;