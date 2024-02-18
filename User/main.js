import createUsers from "./keycloak.js";
import csv from 'csv-writer'
const createCsvWriter = csv.createObjectCsvWriter;

const allCreatedUsers = await createUsers(1905001,1905002)
const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
        { id: 'email', title: 'email' },
        { id: 'password', title: 'password' },
    ],
});

csvWriter.writeRecords(allCreatedUsers)
    .then(() => console.log('CSV file written successfully'))
    .catch((err) => console.error('Error writing CSV file:', err));