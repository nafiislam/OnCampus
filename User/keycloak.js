import KcAdminClient from '@keycloak/keycloak-admin-client';

const baseUrl = 'http://127.0.0.1:4000'
const adminUser = 'oncampusbuet@gmail.com'
const adminPassword = 'admin'
const realmName = 'OnCampus'



// var new_users = await kcAdminClient.users.find({ first: 0, max: 10 });

async function createUser(email, password) {
    const kcAdminClient = new KcAdminClient({
        baseUrl: baseUrl,
        realmName: 'master',
    });
    // Authorize with username / password
    await kcAdminClient.auth({
        username: adminUser,
        password: adminPassword,
        grantType: 'password',
        clientId: 'admin-cli',
    });

    // Override client configuration for all further requests:
    kcAdminClient.setConfig({
        realmName: realmName,
    });

    const res = await kcAdminClient.users.create({
        realm: realmName,
        firstName: '',
        lastName: '',
        email: email,
        emailVerified: false,
        credentials: [
            {
                type: 'password',
                value: password,
                temporary: true,
            },
        ],
        "enabled": true,
        // access: {
        //     manageGroupMembership: true,
        //     view: true,
        //     mapRoles: true,
        //     impersonate: true,
        // },
        realmRoles: []
    });
    // const role = await kcAdminClient.roles.findOneByName({
    //     name: roleName,
    //   });
    // console.log('gere')

    await kcAdminClient.users.addRealmRoleMappings({
        id: res.id,
        roles: [
            { id: '40dc9fbb-fde7-478f-a62c-518279ad7ba4', name: 'user' }
        ],
    });
}
// createUser('nafiisl@gmail.com','nabc123@N')
function generateRandomPassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const specialChars = '!@#$%^&*_+-=|<>?';
    const digits = '0123456789';

    // Ensure at least one character from each character set
    const randomUppercase = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    const randomLowercase = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    const randomDigit = digits[Math.floor(Math.random() * digits.length)];

    // Concatenate the character sets
    const allChars = uppercaseChars + lowercaseChars + specialChars + digits;

    // Generate additional characters to meet the minimum length requirement
    const additionalChars = Array.from({ length: 4 }, () => allChars[Math.floor(Math.random() * allChars.length)]);

    // Shuffle the characters to create a random order
    const shuffledChars = (randomUppercase + randomLowercase + randomSpecialChar + randomDigit + additionalChars.join(''))
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return shuffledChars;
}

const deptMapper = {
    '01': 'arch',
    '02': 'che',
    '04': 'ce',
    '05': 'cse',
    '06': 'eee',
    '08': 'ipe',
    '10': 'me',
    '11': 'mme',
    '12': 'name',
    '15': 'urp',
    '16': 'wre',
    '17': 'nce',
    '18': 'bme',
}


async function createUsers(startId, endId) {

    const kcAdminClient = new KcAdminClient({
        baseUrl: baseUrl,
        realmName: 'master',
    });

    try {
        // Authorize with username / password
        await kcAdminClient.auth({
            username: adminUser,
            password: adminPassword,
            grantType: 'password',
            clientId: 'admin-cli',
        });

        // Override client configuration for all further requests:
        kcAdminClient.setConfig({
            realmName: realmName,
        });
    } catch (e) {
        console.log(e.responseData)
        return {
            msg: "Internal Server Error",
            success: false
        }
    }


    for (let i = startId; i <= endId; i++) {
        try {

            // Override client configuration for all further requests:

            const users = await kcAdminClient.users.find({ email: `${i}@${deptMapper[i.toString().slice(2, 4)]}.buet.ac.bd` });
            // console.log(users)
            if (users.length != 0) {
                console.log('User already exists')
                return {
                    msg: 'User already exists',
                    success: false
                }
            }
        } catch (e) {
            console.log(e.responseData)
            return {
                msg: "Internal Server Error",
                success: false
            }
        }
    }

    var allCreatedUsers = []
    for (let i = startId; i <= endId; i++) {
        const randomPassword = generateRandomPassword();
        allCreatedUsers.push({ email: `${i}@${deptMapper[i.toString().slice(2, 4)]}.buet.ac.bd`, password: `${randomPassword}` })
        try {
            await createUser(`${i}@${deptMapper[i.toString().slice(2, 4)]}.buet.ac.bd`, `${randomPassword}`)
        } catch (e) {
            console.log(e.responseData)
            return {
                msg: "Internal Server Error",
                success: false
            }
        }
    }
    return {
        msg: "Users created successfully",
        success: true,
        data: allCreatedUsers
    }
}


async function changeRole(email, prevRole, newRole) {
    const kcAdminClient = new KcAdminClient({
        baseUrl: baseUrl,
        realmName: 'master',
    });

    try {
        // Authorize with username / password
        await kcAdminClient.auth({
            username: adminUser,
            password: adminPassword,
            grantType: 'password',
            clientId: 'admin-cli',
        });

        // Override client configuration for all further requests:
        kcAdminClient.setConfig({
            realmName: realmName,
        });
    } catch (e) {
        console.log(e.responseData)
        return {
            msg: "Internal Server Error",
            success: false
        }
    }
    try {
        let user = await kcAdminClient.users.find({ email: email });
        user = user[0]

        console.log(user)

        if (user.length == 0) {
            return {
                msg: "User not found",
                success: false
            }
        }

        console.log(user)

        let role = await kcAdminClient.roles.findOneByName({
            name: prevRole,
        });

        if (role == null) {
            return {
                msg: "Role not found",
                success: false
            }
        }

        await kcAdminClient.users.delRealmRoleMappings({
            id: user.id,
            roles: [
                { id: role.id, name: prevRole }
            ],
        });

        console.log('Role removed')

        role = await kcAdminClient.roles.findOneByName({
            name: newRole,
        });

        if (role == null) {
            return {
                msg: "Role not found",
                success: false
            }
        }


        await kcAdminClient.users.addRealmRoleMappings({
            id: user.id,
            roles: [
                { id: role.id, name: newRole }
            ],
        });

        console.log('Role added')

        return {
            msg: "Role added successfully",
            success: true
        }
    } catch (e) {
        console.log(e.responseData)
        return {
            msg: "Internal Server Error",
            success: false
        }
    }

}

export {
    createUsers,
    deptMapper,
    changeRole
}
