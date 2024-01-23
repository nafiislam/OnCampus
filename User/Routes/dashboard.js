import express from 'express';
import { Tag,Role  } from '@prisma/client'
import prisma from '../db.js'

const router = express.Router();

router.get('/', async(req, res) => {
    await prisma.user.deleteMany()
    await prisma.post.deleteMany()
    const user = await prisma.user.create({
        data:{
            id:'1905010',
            name:'Md Muhaiminul Islam Nafi',
            email:`nafiislam964@gmail.com${new Date().getTime()}`,
            password:'123456',
        }
    })
    res.send({message: 'dashboard', user: req.user});
});

export default router;