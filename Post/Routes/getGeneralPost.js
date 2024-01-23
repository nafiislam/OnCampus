import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.get('/', async(req, res) => {
    const id='1905010'
    await prisma.post.deleteMany()
    const post = await prisma.post.create({
        data:{
            title:'My first post',
            content:'Hello world',
            anonymous:false,
            author:{
                connect:{
                    id:id
                }
            },
            comments:{
                create:{
                    content:'This is a great post',
                    author:{
                        connect:{
                            id:id
                        }
                    }
                }
            },
            likedBy:{
                connect:[{
                    id:id,
                    },{
                    id:'1905010'
                }],
                
            }
            ,viewedBy:{
                connect:{
                    id:id
                }
            }
            ,tags:[Tag.TUITION,Tag.BLOOD]
            ,attachments:['./images/1.pdf','./images/2.pdf']
            ,images:['./images/1.jpg','./images/2.jpg']
            ,savedBy:{
                connect:{
                    id:id
                }
            }
        }
    })
    res.send({message: 'GetGeneralPOst', user: req.user});
});

export default router;