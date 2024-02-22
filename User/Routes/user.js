import express from 'express'
import pkg from '@prisma/client'
const { Role } = pkg;
import prisma from '../db.js'
import { validateRequestUser } from './validateRequest.js'
import updatePassword from '../updatePassword.js';


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
                    likedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    savedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    commentAllow: true,
                    bloodInfo: true,
                    tuitionInfo: true,
                    productInfo: true,
                    open: true,
                }
            },
            reminders: true,
            myNotifications: true,
            createdNotifications: true,
            savedPosts: {
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
                    likedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    savedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    commentAllow: true,
                    bloodInfo: true,
                    tuitionInfo: true,
                    productInfo: true,
                    open: true,
                }
            },
            likedPosts: {
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
                    likedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    savedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    commentAllow: true,
                    bloodInfo: true,
                    tuitionInfo: true,
                    productInfo: true,
                    open: true,
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
                    likedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    savedBy: {
                        select: {
                            profilePicture: true,
                            name: true,
                            id: true,
                            email: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    commentAllow: true,
                    bloodInfo: true,
                    tuitionInfo: true,
                    productInfo: true,
                    open: true,
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
            name,
            session,
            aboutMe,
            address,
            bloodGroup,
            dateOfBirth,
            emergencyContact,
            phoneNumber,
            section,
        } = data;

        console.log("here");

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
                    name: name,
                    session: session,
                    aboutMe: aboutMe,
                    address: address,
                    bloodGroup: bloodGroup,
                    dateOfBirth: dob,
                    emergencyContact: emergencyContact,
                    phoneNumber: phoneNumber,
                    section: section,
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

router.post('/updatePassword', async (req, res) => {
    const email = req.headers.email;
    const {
        previousPassword,
        newPassword
    } = req.body;

    console.log(previousPassword, newPassword);
    console.log(email);

    if (previousPassword == undefined) {
        res.status(400).json({ message: "Previous Password is required" });
        return;
    }

    if (newPassword == undefined) {
        res.status(400).json({ message: "New Password is required" });
        return;
    }

    if (previousPassword === newPassword) {
        res.status(400).json({ message: "New Password cannot be same as previous password" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (user == null) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        console.log(user);

        const result = await updatePassword(email, previousPassword, newPassword);
        if (result.success) {
            res.send({ message: "Password updated successfully" });
        } else {
            res.status(400).json({ message: result.msg });
        }

        console.log(result);
        res.send(result);

    } catch (error) {
        console.error("Error while updating user password:", error);
        res.status(500).json({ message: "Error!" });
    }

});


router.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

export default router;