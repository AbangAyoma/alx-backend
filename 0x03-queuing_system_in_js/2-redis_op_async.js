import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

// Event listeners for connection status
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

// Promisify the `get` method
const getAsync = promisify(client.get).bind(client);

// Function to set a key-value pair in Redis
function setNewSchool(schoolName, value) {
    client.set(schoolName, value, print); // `print` provides a confirmation message
}

// Function to display the value of a key in Redis using async/await
async function displaySchoolValue(schoolName) {
    try {
        const value = await getAsync(schoolName); // Await the promisified `get` call
        console.log(value); // Log the value to the console
    } catch (err) {
        console.error(`Error retrieving ${schoolName}: ${err.message}`);
    }
}

// Call the functions as required
(async () => {
    await displaySchoolValue('Holberton');
    setNewSchool('HolbertonSanFrancisco', '100');
    await displaySchoolValue('HolbertonSanFrancisco');
})();
