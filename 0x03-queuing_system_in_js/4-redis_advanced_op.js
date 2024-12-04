import { createClient, print } from 'redis';

const client = createClient();

// Event listeners for connection status
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});

// Function to create the hash
function createHolbertonSchoolsHash() {
    client.hset('HolbertonSchools', 'Portland', 50, print);
    client.hset('HolbertonSchools', 'Seattle', 80, print);
    client.hset('HolbertonSchools', 'New York', 20, print);
    client.hset('HolbertonSchools', 'Bogota', 20, print);
    client.hset('HolbertonSchools', 'Cali', 40, print);
    client.hset('HolbertonSchools', 'Paris', 2, print);
}

// Function to display the hash
function displayHolbertonSchoolsHash() {
    client.hgetall('HolbertonSchools', (err, res) => {
        if (err) {
            console.error(`Error retrieving hash: ${err.message}`);
        } else {
            console.log(res); // Display the hash object
        }
    });
}

// Call the functions
createHolbertonSchoolsHash();
displayHolbertonSchoolsHash();
