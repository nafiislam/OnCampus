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
      const {title,
          content,
          moreData,
          imgList,
          list,
        radio,
        pid} = req.body;

        if(title==undefined || content==undefined || imgList==undefined || list==undefined||moreData==undefined||radio==undefined||pid==undefined){
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
        if(pid==""){
            res.status(400).json({message: "pid is required"});
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

      const r = await axios.post(`${user_url.url}/checkBan`, {
        pid: pid,
        uid:user_id
      });

      if(r.status!=200){
        res.sendStatus(400).send({message:"Banned"})
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

      var post = null;

      if(radio=="BLOOD"){
        post = await prisma.post.update({
            where:{
                id:pid,
                authorId: user_id
            },
            data: {
                title: title,
                content: content,
                images: images,
                imageNames: imageNames,
                attachments: files,
                attachmentNames: fileNames,
                bloodInfo:{
                  update:{
                    data:{
                        bloodGroup: moreData.bloodGroup,
                        units: moreData.units,
                        hospital: moreData.hospital,
                        contact: moreData.contact,
                        time: moreData.time
                      }
                  }
                }
            },
            select: {
                id: true,
            },
        });
      }
      else if(radio=="TUITION"){
        post = await prisma.post.update({
            where:{
                id:pid,
                authorId: user_id
            },
            data: {
                title: title,
                content: content,
                images: images,
                imageNames: imageNames,
                attachments: files,
                attachmentNames: fileNames,
                tuitionInfo:{
                  update:{
                    data:{
                        genderPreference: moreData.genderPreference,
                        location: moreData.location,
                        class: moreData.class,
                        member: moreData.member,
                        subject: moreData.subject,
                        time: moreData.time,
                        medium: moreData.medium,
                        salary: moreData.salary,
                        contact: moreData.contact,
                        studentInstitute: moreData.studentInstitute,
                        gender: moreData.gender
                      }
                  }
                }
            },
            select: {
                id: true,
            },
        });
      }
      else if(radio=="PRODUCT"){
        post = await prisma.post.update({
            where:{
                id:pid,
                authorId: user_id
            },
            data: {
                title: title,
                content: content,
                images: images,
                imageNames: imageNames,
                attachments: files,
                attachmentNames: fileNames,
                productInfo:{
                    update:{
                        data:{
                            type: moreData.type,
                            name: moreData.name,
                            price: moreData.price,
                            contact: moreData.contact
                          }
                    }
                }
            },
            select: {
                id: true,
            },
        });
      }
      else{

        post = await prisma.post.update({
            where:{
                id:pid,
                authorId: user_id
            },
            data: {
                title: title,
                content: content,
                images: images,
                imageNames: imageNames,
                attachments: files,
                attachmentNames: fileNames,
            },
            select: {
                id: true,
            },
        });
      }

      res.status(200).json({message: "Post updated"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;