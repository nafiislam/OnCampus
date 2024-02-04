import express from 'express'
import { Tag, Role, clubRole } from '@prisma/client'
import prisma from '../db.js'
import validateRequest from './validateRequest.js'

const router = express.Router();

router.use(validateRequest);

async function createUser(user) {

    const {
        name,
        id,
        batch,
        department,
        session,
        meritPosition,
        clubRoles
    } = req.body;

    if (name == undefined || id == undefined || batch == undefined || department == undefined || session == undefined || meritPosition == undefined || clubRoles == undefined) {
        return { message: "All fields are required" };
    }

    if (name === "") {
        return { message: "Name is required" };
    }

    if (id === "") {
        return { message: "ID is required" };
    }

    if (batch === "") {
        return { message: "Batch is required" };
    }

    if (department === "") {
        return { message: "Department is required" };
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

    try {
        await prisma.$transaction(async (tx) => {

            const email = user.id + "@" + user.department + ".buet.ac.bd"

            const newUser = await tx.user.create({
                data: {
                    name: user.name,
                    email: email,
                    batch: user.batch,
                    department: user.department,
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

    let message = ""
    try {
        const newClub = await prisma.club.create({
            data: {
                name: clubName,
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

export default router;