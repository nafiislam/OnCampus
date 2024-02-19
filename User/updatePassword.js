import KcAdminClient from '@keycloak/keycloak-admin-client';

const baseUrl = 'http://127.0.0.1:4000'
const adminUser = 'oncampusbuet@gmail.com'
const adminPassword = 'admin'
const realmName = 'OnCampus'
const userEmail = '1905010@cse.buet.ac.bd'
const previousPassword = 'nabc123@N'
const newPassword = 'nabc123@N'
const clientSecret = 'TmrAWuKCGwhb1JnR3k646uW9sliR6IJs'
try{
    const kcClient = new KcAdminClient({
        baseUrl: baseUrl,
        realmName: 'OnCampus',
    });
    await kcClient.auth({
        username: userEmail,
        password: previousPassword,
        grantType: 'password',
        clientId: 'oncampus_client',
        clientSecret: clientSecret
    });

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
    
    const users = await kcAdminClient.users.find({ email: "1905010@cse.buet.ac.bd" });

    await kcAdminClient.users.resetPassword({
        id: users[0].id,
        credential: {
            temporary: false,
            type: "password",
            value: newPassword,
        },
    });
}
catch(e){
    console.log(e)
}