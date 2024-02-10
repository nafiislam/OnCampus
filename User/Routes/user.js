import express from 'express'
import pkg from '@prisma/client'
const { Role } = pkg;
import prisma from '../db.js'
import { validateRequestUser } from './validateRequest.js'


const router = express.Router();

router.use(validateRequestUser);

async function getMyInfo(email) {

    return await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            ClubMember: {
                select: {
                    role: true,
                    club: {
                        select: {
                            name: true,
                        }
                    }
                },
            },
            posts: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    type: true,
                    author: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    anonymous: true,
                    isPoll: true,
                    tags: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
            reminders: true,
            myNotifications: true,
            createdNotifications: true,
            savedPosts: {
                include: {
                    author: true,
                }
            },
            likedPosts: {
                include: {
                    author: true,
                }
            }
        }
    });

}

async function getUserInfo(email) {

    return await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            ClubMember: {
                select: {
                    role: true,
                    club: {
                        select: {
                            name: true,
                        }
                    }
                },
            },
            posts: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    type: true,
                    author: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    anonymous: true,
                    isPoll: true,
                    tags: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }
        }
    });

}

router.post('/getUser', async (req, res) => {
    const getUserEmail = req.body.email;
    const userEmail = req.headers.email;
    console.log(getUserEmail);

    if (getUserEmail == undefined) {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    try {
        let user = null;

        if (getUserEmail === userEmail) {
            user = await getMyInfo(getUserEmail);
        } else {
            user = await getUserInfo(getUserEmail)
        }

        if (user == null) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.log(user);
        res.send(user);
    } catch (error) {
        console.error("Error while getting user info:", error);
        res.status(500).json({ message: "Error!" });
    }

});

router.post('/updateProfile', async (req, res) => {
    const email = req.headers.email;
    const {
        data,
        type
    } = req.body;

    if (data == undefined) {
        res.status(400).json({ message: "Data is required" });
        return;
    }

    if (type == undefined) {
        res.status(400).json({ message: "Type is required" });
        return;
    }

    console.log(data);

    if (type === "profilePicUpdate") {
        const {
            profilePicture
        } = data;

        if (profilePicture == undefined) {
            res.status(400).json({ message: "URL is required" });
            return;
        }

        if (profilePicture.length != 1) {
            res.status(400).json({ message: "Invalid URL" });
            return;
        }

        const {
            url
        } = profilePicture[0];

        try {
            const user = await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    profilePicture: url
                }
            });

            res.send(user);
            console.log(user);
        } catch (error) {
            console.error("Error while updating user info:", error);
            res.status(500).json({ message: "Error!" });
        }
    } else if (type === "profileUpdate") {
        const {
            aboutMe,
            address,
            bloodGroup,
            dateOfBirth,
            emergencyContact,
            phoneNumber,
            section,
            role
        } = data;

        console.log("here");

        if (role == null) {
            res.status(400).json({ message: "Role is Required" });
            return;
        }

        let dob = null;
        if (dateOfBirth) {
            dob = new Date(dateOfBirth);
            if (dob == "Invalid Date") {
                res.status(400).json({ message: "Invalid Date of Birth" });
                return;
            }
            console.log(dob);

        }



        try {
            const user = await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    aboutMe: aboutMe,
                    address: address,
                    bloodGroup: bloodGroup,
                    dateOfBirth: dob,
                    emergencyContact: emergencyContact,
                    phoneNumber: phoneNumber,
                    section: section,
                    role: role

                }
            });

            res.send(user);
            console.log(user);
        } catch (error) {
            console.error("Error while updating user info:", error);
            res.status(500).json({ message: "Error!" });
        }
    } else {
        res.status(400).json({ message: "Invalid type" });
    }

});


router.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

export default router;