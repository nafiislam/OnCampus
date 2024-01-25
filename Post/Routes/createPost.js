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
          postType,
          isComment,
          isNotify,
          isAnonymous,
          reminderCheck,
          reminder,
          discussionCheck,
          bloodCheck,
          tutionCheck,
          productCheck,
          techCheck,
          pollCheck,
          options,
          imgList,
          list} = req.body;
      
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
    
        if (postType === "") {
          res.status(400).json({message: "Post type is required"});
          return;
        }

      if (pollCheck) {
          if (options.length < 2) {
            res.status(400).json({message: "At least two options are required"});
            return;
          }
      }
    
        if (reminderCheck) {
          if (reminder === "") {
            res.status(400).json({message: "Reminder date and time is required"});
            return;
          }
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

      
      var tagList = [];
      if(discussionCheck){
        tagList.push(Tag.DISCUSSION);
      }
      if(bloodCheck){
        tagList.push(Tag.BLOOD);
      }
      if(tutionCheck){
        tagList.push(Tag.TUITION);
      }
      if(productCheck){
        tagList.push(Tag.PRODUCT);
      }
      if(techCheck){
        tagList.push(Tag.TECH);
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

      const post = await prisma.post.create({
          data: {
              title: title,
              content: content,
              type: postType,
              commentAllow: isComment,
              anonymous: isAnonymous,
              tags: tagList,
              isPoll: pollCheck,
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

      if(reminderCheck){
        const rem_res = await prisma.reminder.create({
          data:{
            time: reminder,
            type: ReminderTag.POST,
            post:{
              connect:{
                id: post.id
              }
            },
            author:{
              connect:{
                id: user_id
              }
            }
          }
        });
      }

      if(isNotify){
        const users_res = await axios.post(`${user_url.url}/getUserIDsByType`, {
            email: email,
            type: postType,
        });
        let users = users_res.data;
        console.log("users: ", users);
        if(users.length > 0){
            users.forEach(async (user) => {
                await prisma.notification.create({
                    data: {
                        content: 'New Post by '+user_id,
                        type: ReminderTag.POST,
                        post: {
                            connect: {
                                id: post.id,
                            },
                        },
                        author: {
                            connect: {
                                id: user_id,
                            },
                        },
                        belongsTo:{
                            connect:{
                                id: user.id
                            }
                        }
                    }
                });
            })
        }
      }

      if (pollCheck) {
          options.forEach(async (option) => {
            await prisma.option.create({
              data: {
                title: option,
                post: {
                  connect: {
                    id: post.id,
                  },
                },
              },
            });
          });
      }
      res.status(200).json({message: "Post Created"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;