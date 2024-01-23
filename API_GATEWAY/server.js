import axios from 'axios';
export default async function getRegistry(service){
    try {
        const response = await axios.post('http://localhost:5003/getServiceUrl', {
            serverName: service,
        });
    
        if (response.status !== 200) {
            console.log(response.data.message);
            return null;
        }
        else{
            return response.data;
        }
    } catch (error) {
        console.error("An error occurred while making the request:", error.message);
        return null;
    }
}