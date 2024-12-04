import { createClient, print } from 'redis';

const client = createClient();

// Event listeners for connection status
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

// Function to set a key-value pair in Redis
function setNewSchool(schoolName, value) {
    client.set(schoolName, value, print); // `print` provides a confirmation message
}

// Function to display the value of a key in Redis
function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, reply) => {
        if (err) {
            console.error(`Error retrieving ${schoolName}: ${err.message}`);
            return;
        }
        console.log(reply); // Log the value to the console
    });
}

// Call the functions as required
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
