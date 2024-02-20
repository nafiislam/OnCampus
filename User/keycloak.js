import KcAdminClient from '@keycloak/keycloak-admin-client';

const baseUrl = 'http://127.0.0.1:4000'
const adminUser = 'oncampusbuet@gmail.com'
const adminPassword = 'admin'
const realmName = 'OnCampus'
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

// var new_users = await kcAdminClient.users.find({ first: 0, max: 10 });

async function createUser(email, password) {
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


    for (let i = startId; i <= endId; i++) {
        try {
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

export {
    createUsers,
    deptMapper
}
