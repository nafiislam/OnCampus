import express from 'express'
import pkg from '@prisma/client'
const { clubRole, dept, Access } = pkg
import prisma from '../db.js'
import { validateRequestAdmin } from './validateRequest.js'

const router = express.Router();

router.use(validateRequestAdmin);

async function createUser(user) {

    const {
        name,
        email,
        batch,
        department,
        session,
        meritPosition,
        clubRoles
    } = user;

    if (name == undefined || email == undefined || batch == undefined || department == undefined || session == undefined || meritPosition == undefined || clubRoles == undefined) {
        return { message: "All fields are required" };
    }

    if (name === "") {
        return { message: "Name is required" };
    }

    if (email === "") {
        return { message: "email is required" };
    }

    if (batch === "") {
        return { message: "Batch is required" };
    }

    if (department === "") {
        return { message: "Department is required" };
    }

    if (dept[department] == undefined) {
        return { message: "Invalid department" };
    }

    if (session === "") {
        return { message: "Session is required" };
    }

    if (meritPosition === "") {
        return { message: "Merit Position is required" };
    }

    if (!Array.isArray(clubRoles)) {
        return { message: "Invalid request body" };
    }

    for (let club_role of clubRoles) {
        if (club_role.clubName == undefined || club_role.role == undefined) {
            return { message: "All fields are required" };
        }

        if (club_role.clubName === "") {
            return { message: "Club Name is required" };
        }

        if (club_role.role === "") {
            return { message: "Role is required" };
        }

        if (clubRole[club_role.role.toUpperCase()] == undefined) {
            return { message: "Invalid role" };
        }
    }

    try {
        await prisma.$transaction(async (tx) => {

            const newUser = await tx.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    batch: user.batch,
                    department: dept[user.department],
                    session: user.session,
                    meritPosition: user.meritPosition,
                }
            })

            console.log(newUser)

            const clubRoles = user.clubRoles

            for (let club_role of clubRoles) {
                console.log(clubRole[club_role.role.toUpperCase()])
                const updatedClub = await tx.club.update({
                    where: {
                        name: club_role.clubName,
                    },
                    data: {
                        members: {
                            create: {
                                role: clubRole[club_role.role.toUpperCase()],
                                email: email,
                            },
                        },
                    },
                    include: {
                        members: true, // Include the members in the response
                    },
                })
                console.log(updatedClub)
            }
        }
        )

        return { message: 'user successfully created' };
    } catch (error) {


        // Handle the error
        console.error('Error during transaction:', error);
        return { message: 'bad request' };
    } finally {
        // Ensure that the Prisma client is properly disconnected
        await prisma.$disconnect();
    }

}

router.post('/createUser', async (req, res) => {
    console.log(req.body)
    console.log(req.headers)

    const user = req.body
    const msg = await createUser(user)

    res.send(msg);

});

router.post('/createClub', async (req, res) => {
    console.log(req.body)

    const clubName = req.body.clubName
    const members = req.body.members

    if (clubName == undefined || members == undefined) {
        res.send({ message: "All fields are required" });
    }

    if (clubName === "") {
        res.send({ message: "Club Name is required" });
    }

    if (!Array.isArray(members)) {
        res.send({ message: "Invalid request body" });
    }

    for (let member of members) {
        if (member.email == undefined || member.role == undefined) {
            res.send({ message: "All fields are required" });
        }

        if (member.email === "") {
            res.send({ message: "Email is required" });
        }

        if (member.role === "") {
            res.send({ message: "Role is required" });
        }

        if (clubRole[member.role.toUpperCase()] == undefined) {
            res.send({ message: "Invalid role" });
        }
    }

    let message = ""
    try {
        const newClub = await prisma.club.create({
            data: {
                name: clubName.toUpperCase(),
                members: {
                    createMany: {
                        data: members.map((member) => ({
                            role: clubRole[member.role.toUpperCase()],
                            email: member.email,
                        })),
                    },
                },
            },
            include: {
                members: true, // Include the members in the response
            },
        });
        console.log(newClub)
        message = 'club successfully created'
    } catch (error) {
        // Handle the error
        console.error('Error during transaction:', error);
        message = 'bad request'
    } finally {
        // Ensure that the Prisma client is properly disconnected
        await prisma.$disconnect();
    }

    res.send({ message: message });
});

router.post('/createBatch', async (req, res) => {
    console.log(req.body)

    const batch = req.body.batch

    if (batch == undefined) {
        res.send({ message: "All fields are required" });
    }

    if (batch === "") {
        res.send({ message: "Batch is required" });
    }

    try {
        const newBatch = await prisma.batch.create({
            data: {
                batchName: batch,
            },
        });
        console.log(newBatch)
        res.send({ message: 'batch successfully created' });
    }
    catch (error) {
        // Handle the error
        console.error('Error during transaction:', error);
        res.send({ message: 'bad request' });
    } finally {
        // Ensure that the Prisma client is properly disconnected
        await prisma.$disconnect();
    }

})

// router.post('/createDept', async (req, res) => {
//     console.log(req.body)

//     const dept = req.body.department

//     if (dept == undefined) {
//         res.send({ message: "All fields are required" });
//     }

//     if (dept === "") {
//         res.send({ message: "Department is required" });
//     }

//     try {
//         const newDept = await prisma.department.create({
//             data: {
//                 deptName: dept,
//             },
//         });
//         console.log(newDept)
//         res.send({ message: 'department successfully created' });
//     }
//     catch (error) {
//         // Handle the error
//         console.error('Error during transaction:', error);
//         res.send({ message: 'bad request' });
//     } finally {
//         // Ensure that the Prisma client is properly disconnected
//         await prisma.$disconnect();
//     }

// })

router.get('/getBatch', async (req, res) => {
    console.log("getBatch")
    const batches = await prisma.batch.findMany()
    res.send(batches)
})

router.get('/getDept', async (req, res) => {
    console.log("getDept")

    const depts = []
    for (let d of Object.values(dept)) {
        depts.push(d)
    }
    // console.log(depts)

    res.send(depts)
})

router.get('/getClubRoles', async (req, res) => {
    console.log("getClubRoles")

    const roles = []
    for (let r of Object.values(clubRole)) {
        roles.push(r)
    }
    // console.log(roles)

    res.send(roles)
})

router.get('/getClubs', async (req, res) => {
    console.log("getClubs")
    const clubs = await prisma.club.findMany()
    res.send(clubs)
})

router.get('/getUsers', async (req, res) => {
    console.log("getUsers")
    const users = await prisma.user.findMany()
    console.log(users)
    res.send(users)
})

router.post("/updateChannelAccess", async (req, res) => {

    console.log(req.body)

    const {
        email,
        accessGeneral,
        accessDept,
        accessBatch,
        accessDeptBatch
    } = req.body;

    if (email == undefined || accessGeneral == undefined || accessDept == undefined || accessBatch == undefined || accessDeptBatch == undefined) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    if (email === "") {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    if (Access[accessGeneral] == undefined || Access[accessDept] == undefined || Access[accessBatch] == undefined || Access[accessDeptBatch] == undefined) {
        res.status(400).json({ message: "Invalid access" });
        return;
    }

    try {
        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                accessGeneral: Access[accessGeneral],
                accessDept: Access[accessDept],
                accessBatch: Access[accessBatch],
                accessDeptBatch: Access[accessDeptBatch],
            }
        });

        console.log(user)
        res.send({ message: "User updated" });
    } catch (error) {
        console.error("Error while updating user:", error);
        res.status(500).json({ message: "Error!" });
    }

});

router.post("/updateClubRoles", async (req, res) => {

    console.log(req.body)

    const {
        email,
        ClubMember
    } = req.body;

    if (email == undefined || ClubMember == undefined) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    if (email === "") {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    if (!Array.isArray(ClubMember)) {
        res.status(400).json({ message: "Invalid request body" });
        return;
    }

    for (let club_role of ClubMember) {
        console.log(club_role)
        if (club_role.club.name == undefined || club_role.role == undefined) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if (club_role.club.name === "") {
            res.status(400).json({ message: "Club Name is required" });
            return;
        }

        if (club_role.role === "") {
            res.status(400).json({ message: "Role is required" });
            return;
        }

        if (clubRole[club_role.role.toUpperCase()] == undefined) {
            res.status(400).json({ message: "Invalid role" });
            return;
        }

    }

    try {
        await prisma.$transaction(async (tx) => {

            await tx.clubMember.deleteMany({
                where: {
                    email: email
                }
            });

            for (let club_role of ClubMember) {
                const updatedClub = await tx.club.update({
                    where: {
                        name: club_role.club.name,
                    },
                    data: {
                        members: {
                            create: {
                                role: clubRole[club_role.role.toUpperCase()],
                                email: email,
                            },
                        },
                    },
                    include: {
                        members: true, // Include the members in the response
                    },
                })
                console.log(updatedClub)
            }
        })
    } catch (error) {
        console.error("Error while updating user club roles:", error);
        res.status(500).json({ message: "Error!" });
    }

    res.send({ message: "User Club Roles updated" });

});



router.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

export default router;