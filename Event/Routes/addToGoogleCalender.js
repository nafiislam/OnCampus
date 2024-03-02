import axios from 'axios';
import express from 'express';
import { google } from 'googleapis';
import prisma from '../db.js';
import getRegistry from '../server.js';
const router = express.Router();
import dotenv from 'dotenv';
import { oauth2 } from 'googleapis/build/src/apis/oauth2/index.js';
dotenv.config();
import jwt from 'jsonwebtoken';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPE = 'https://www.googleapis.com/auth/calendar';

// const oath2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URI
// );

// const calender = google.calendar({
//     version: 'v3',
//     auth: oath2Client
// });


// add the event with the corresponding event id to the google calender
router.post('/', async(req, res) => {
    try{
        // console.log(req.body);
        const {email ,admin} = req.headers;
        const {id, response} = req.body;
        console.log("credentialResponse: ", response.credential);

        console.log("type:    " + typeof(response.credential));

        

        // axios.post('https://oauth2.googleapis.com/token', {
        //     code: response.credential,
        //     client_id: process.env.GOOGLE_CLIENT_ID,
        //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
        //     // redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        //     grant_type: 'authorization_code'
        // }).then((response) => {
        //     // console.log('Token Response: ', response.data);
        //     const {access_token, refresh_token, scope, token_type, expiry_date} = response.data;
        //     console.log('Token: ', access_token);
        //     console.log("refresh token: ", refresh_token);
        //     console.log("scope: ", scope);
        //     console.log("token type: ", token_type);
        //     console.log("expiry date: ", expiry_date);
        //     // oath2Client.setCredentials(response.data);
        // }).catch((error) => {
        //     console.log('Token Error: ', error);
        // });

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        console.log(oAuth2Client);

        const decodededJWT = jwt.decode(response.credential, {complete: true});

        console.log("decodededJWT: ", decodededJWT);

        const access_token = decodededJWT.payload.azp;
        console.log("access_token: ", access_token);

        // const {code} = await oAuth2Client.getToken(decodededJWT.signature);
        // console.log("Code: ", code);

        
        
        // const { code } = await oAuth2Client.getToken(response.credential);
        // console.log('Code: ', code); 
        
        // oAuth2Client.setCredentials(
        //     {
        //         access_token: response.credential,
        //     }
        // );

        const calender = google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });

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
                    // description:true,
                    startDate:true,
                    finishDate:true,
                    eventType:true,
                    // location:true,
                    // onlineLink:true,
                }
            });
        console.log("event: ", event);
        if(event){
            const eventStartTime = new Date(event.startDate);
            const eventEndTime = new Date(event.finishDate);
            const eventDetails = {
                summary: event.title,
                description: event.description,
                start: {
                    dateTime: eventStartTime,
                    timeZone: 'Asia/Kolkata',
                },
                end: {
                    dateTime: eventEndTime,
                    timeZone: 'Asia/Kolkata',
                },
                location: event.location,
                visibility: 'public',
            };
            const calendarId = 'primary';
            calender.events.insert({
                calendarId: calendarId,
                resource: eventDetails,
            }, (err, res) => {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Event created: %s', res.data.htmlLink);
            }
            );
            res.status(200).json({message: "Event added to Google Calender"});
        }
        else{
            res.status(400).json({message: "Event not found"});
        }
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
}
);


// router.post('/', async(req, res) => {
//     try{
//         console.log(req.body);
//         const {email ,admin} = req.headers;
//         const {id} = req.body;
        
//         if(!email){
//             res.status(401).json({message: "Unauthorized"});
//             return;
//         }
        
//         const user_url = await getRegistry("user");
//         const user_id_res = await axios.post(`${user_url.url}/getUserIDByEmail`, {
//             email: email,
//         });
//         console.log(email);
//         const user_id = user_id_res.data.id;
//         console.log("user_id: ", user_id);

//         if (user_id === '-1') {
//             res.status(400).json({message: "User not found"});
//             return;
//         }
//         //have to shift to user service
//         const user = await prisma.user.findUnique({
//             where:{
//                 id:user_id
//             },
//             select:{
//                 id:true,
//                 name:true,
//                 email:true,
//                 profilePicture:true,
//             }
//         })

//         var event = await prisma.event.findUnique({
//                 where:{
//                     id:id
//                 },
//                 select:{
//                     id:true,
//                     title:true,
//                     description:true,
//                     startDate:true,
//                     finishDate:true,
//                     eventType:true,
//                     location:true,
//                     onlineLink:true,
//                 }
//             });
//     }
//     catch(e){
//       console.log(e);
//       res.status(500).json({message: "Internal Server Error"});
//     }
// });

export default router;