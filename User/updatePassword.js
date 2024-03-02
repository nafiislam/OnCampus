import KcAdminClient from '@keycloak/keycloak-admin-client';

const baseUrl = 'http://127.0.0.1:4000'
const adminUser = 'oncampusbuet@gmail.com'
const adminPassword = 'admin'
const realmName = 'OnCampus'
const clientSecret = 'TmrAWuKCGwhb1JnR3k646uW9sliR6IJs'


export default async function updatePassword(userEmail, previousPassword, newPassword) {

    try {

        const kcClient = new KcAdminClient({
            baseUrl: baseUrl,
            realmName: 'OnCampus',
        });

        try {
            await kcClient.auth({
                username: userEmail,
                password: previousPassword,
                grantType: 'password',
                clientId: 'oncampus_client',
                clientSecret: clientSecret
            });
        } catch (e) {
            console.log(e.responseData)
            return {
                msg: "Invalid Credentials",
                success: false
            }
        }


        const kcAdminClient = new KcAdminClient({
            baseUrl: baseUrl,
            realmName: 'master',
        });

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

        const users = await kcAdminClient.users.find({ email: userEmail });
        console.log(users)
        if (users.length === 0) {
            return {
                msg: "User not found",
                success: false
            }
        }


        try {
            const res = await kcAdminClient.users.resetPassword({
                id: users[0].id,
                credential: {
                    temporary: false,
                    type: "password",
                    value: newPassword,
                },
            });

            console.log(res)
        } catch (e) {
            console.log(e.responseData)
        }

        return {
            msg: "Password Updated",
            success: true
        }

    }
    catch (e) {
        console.log(e.responseData)
        return {
            msg: "Internal Server Error",
            success: false
        }
    }
}