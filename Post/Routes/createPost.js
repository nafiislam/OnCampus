import express from 'express';
import { Tag,Role, ReminderTag } from '@prisma/client'
import prisma from '../db.js'
import getRegistry from '../server.js'
import axios from 'axios';
const router = express.Router();

async function createNotification(email,postType,postID,user_id){
  const user_url = await getRegistry("user");
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
                  content: `New Post in ${postType}`,
                  type: ReminderTag.POST,
                  post: {
                      connect: {
                          id: postID,
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
          radio,
          moreData,
          pollCheck,
          options,
          imgList,
          list} = req.body;

        if(title==undefined || content==undefined || postType==undefined || isComment==undefined || isNotify==undefined || isAnonymous==undefined || reminderCheck==undefined || reminder==undefined || pollCheck==undefined || options==undefined || imgList==undefined || list==undefined|| radio==undefined || moreData==undefined){
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

      const r = await axios.post(`${user_url.url}/checkBan/type`, {
        type: postType,
        uid:user_id
      });

      if(r.status!=200){
      res.sendStatus(400).send({message:"Banned"})
      }

      var tagList = [];
      if(radio=="DISCUSSION"){
        console.log("discussion");
        tagList.push(Tag.DISCUSSION);
      }
      else if(radio=="BLOOD"){
        if(moreData.bloodGroup==undefined || moreData.units==undefined || moreData.hospital==undefined || moreData.contact==undefined || moreData.time==undefined){
          res.status(400).json({message: "All fields are required for moreData"});
          return;
        }
        tagList.push(Tag.BLOOD);
      }
      else if(radio=="TUITION"){
        if(moreData.genderPreference==undefined || moreData.location==undefined || moreData.class==undefined || moreData.member==undefined || moreData.subject==undefined || moreData.time==undefined || moreData.medium==undefined || moreData.salary==undefined || moreData.contact==undefined || moreData.studentInstitute==undefined||moreData.gender==undefined){
          res.status(400).json({message: "All fields are required for moreData"});
          return;
        }
        tagList.push(Tag.TUITION);
      }
      else if(radio=="PRODUCT"){
        if(moreData.type==undefined || moreData.name==undefined || moreData.price==undefined || moreData.contact==undefined){
          res.status(400).json({message: "All fields are required for moreData"});
          return;
        }
        tagList.push(Tag.PRODUCT);
      }
      else{
        res.status(400).json({message: "Invalid radio"});
        return;
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
        post = await prisma.post.create({
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
                bloodInfo:{
                  create:{
                    bloodGroup: moreData.bloodGroup,
                    units: moreData.units,
                    hospital: moreData.hospital,
                    contact: moreData.contact,
                    time: moreData.time
                  }
                }
            },
            select: {
                id: true,
            },
        });
      }
      else if(radio=="TUITION"){
        post = await prisma.post.create({
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
                tuitionInfo:{
                  create:{
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
            },
            select: {
                id: true,
            },
        });
      }
      else if(radio=="PRODUCT"){
        post = await prisma.post.create({
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
                productInfo:{
                  create:{
                    type: moreData.type,
                    name: moreData.name,
                    price: moreData.price,
                    contact: moreData.contact
                  }
                }
            },
            select: {
                id: true,
            },
        });
      }
      else{
        console.log("discussion");
        post = await prisma.post.create({
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
      }
      
      if(reminderCheck){
        if(new Date(reminder).getTime()>=new Date().getTime()){
          setTimeout(createNotification, new Date(reminder).getTime() - new Date().getTime(), email,postType,post.id,user_id);
        }
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
                        content: `New Post in ${postType}`,
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