import express from 'express'
import pkg from '@prisma/client'
const { clubRole, dept, Access, Role } = pkg
import prisma from '../db.js'
import { validateRequestAdmin } from './validateRequest.js'
import { createUsers, changeRole } from '../keycloak.js'

const router = express.Router();

router.use(validateRequestAdmin);

const deptMapper = {
    '01': 'Architecture',
    '02': 'Chemical_Engineering',
    '04': 'Civil_Engineering',
    '05': 'Computer_Science_and_Engineering',
    '06': 'Electrical_and_Electronics_Engineering',
    '08': 'Industrial_and_Production_Engineering',
    '10': 'Mechanical_Engineering',
    '11': 'Materials_and_Metallurgical_Engineering',
    '12': 'Naval_Architecture_and_Marine_Engineering',
    '15': 'Urban_and_Regional_Planning',
    '16': 'Water_Resource_Engineering',
    '17': 'Nanomaterials_and_Ceramic_Engineering',
    '18': 'Biomedical_Engineering'
}

// const newUser = await prisma.user.create({
//     data: {
//         email: "1812025@name.buet.ac.bd",
//         department: dept['Naval_Architecture_and_Marine_Engineering'],
//         batch: '18'
//         }

// })

async function createStudents(startId, endId) {
    

    if (startId.length != 7 || endId.length != 7) {
        return {
            msg: "Invalid ID",
            success: false
        }
    }

    console.log(startId, endId)

    if (isNaN(startId) || isNaN(endId)) {
        return {
            msg: "Invalid ID",
            success: false
        }
    }

    

    if (startId.slice(0, 2) != endId.slice(0, 2)) {
        return {
            msg: "Invalid ID",
            success: false
        }
    }

    if (startId.slice(2, 4) != endId.slice(2, 4)) {
        return {
            msg: "Invalid ID",
            success: false
        }
    }

    if (startId.slice(4, 7) > endId.slice(4, 7)) {
        return {
            msg: "Invalid ID",
            success: false
        }
    }

    

    if (deptMapper[startId.slice(2, 4)] == undefined) {
        return {
            msg: "Invalid ID",
            success: false
        }
    }

    

    const batchID = startId.slice(0, 2)
    const department = deptMapper[startId.slice(2, 4)]
    console.log(batchID, department)
    try {
        const allCreatedUsers = await createUsers(startId, endId)
        if (allCreatedUsers.success) {
            for (let user of allCreatedUsers.data) {
                const newUser = await prisma.user.create({
                    data: {
                        email: user.email,
                        department: dept[department],
                        batch: `20${batchID}`,
                    }
                })
            }
        }

        console.log(allCreatedUsers)
        return allCreatedUsers
    } catch (e) {
        console.log(e)
        return {
            msg: "Internal Server Error",
            success: false
        }
    }

}

router.post('/createUser', async (req, res) => {
    console.log(req.body)
    console.log(req.headers)

    const {
        startId,
        endId
    } = req.body;

    if (startId == undefined || endId == undefined) {
        res.status(400).json({ message: "All fields are required" });
    }

    const result = await createStudents(startId, endId)

    if (result.success) {
        res.send(result.data)
    } else {
        res.status(500).json({ message: result.msg });
    }

});

router.post('/createClub', async (req, res) => {
    console.log(req.body)

    const clubName = req.body.clubName
    const members = req.body.members

    if (clubName == undefined || members == undefined) {
        res.status(400).send({ message: "All fields are required" });
    }

    if (clubName === "") {
        res.status(400).send({ message: "Club Name is required" });
    }

    if (!Array.isArray(members)) {
        res.status(400).send({ message: "Invalid request body" });
    }

    for (let member of members) {
        if (member.email == undefined || member.role == undefined) {
            res.status(400).send({ message: "All fields are required" });
        }

        if (member.email === "") {
            res.status(400).send({ message: "Email is required" });
        }

        if (member.role === "") {
            res.status(400).send({ message: "Role is required" });
        }

        if (clubRole[member.role.toUpperCase()] == undefined) {
            res.status(400).send({ message: "Invalid role" });
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
        res.status(400).send({ message: 'bad request' });
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
        res.status(400).send({ message: "All fields are required" });
    }

    if (batch === "") {
        res.status(400).send({ message: "Batch is required" });
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
        res.status(400).send({ message: 'bad request' });
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
    for (let d of Object.keys(deptMapper)) {
        depts.push({
            value: deptMapper[d],
            key: d
        })
    }
    console.log(depts)
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


router.post("/updateRole", async (req, res) => {

    console.log(req.body)

    const {
        email,
        prevRole,
        newRole
    } = req.body;

    if (email == undefined || prevRole == undefined || newRole == undefined) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    if (email === "") {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    if (prevRole === "") {
        res.status(400).json({ message: "Previous Role is required" });
        return;
    }

    if (newRole === "") {
        res.status(400).json({ message: "New Role is required" });
        return;
    }

    try {

        const result = await changeRole(email, prevRole, newRole)
        console.log(result)
        if (!result.success) {
            res.status(500).json({ message: result.msg });
            return;
        }

        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                role: Role[newRole.toUpperCase()],
            }
        });

        res.send({ message: "User role updated" });
    } catch (error) {
        console.error("Error while updating user role:", error);
        res.status(500).json({ message: "Error!" });
    }

});


router.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

export default router;