import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Redis client setup
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Kue queue setup
const queue = kue.createQueue();

// Global state
let reservationEnabled = true;

// Function to set the number of available seats
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get the current number of available seats
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats, 10) : 0;
}

// Initialize the number of available seats to 50
reserveSeat(50);

// Routes
// GET /available_seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

// GET /reserve_seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.status(403).json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (!err) {
      res.json({ status: 'Reservation in process' });
    } else {
      res.status(500).json({ status: 'Reservation failed' });
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// GET /process
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      let availableSeats = await getCurrentAvailableSeats();

      if (availableSeats <= 0) {
        reservationEnabled = false;
        throw new Error('Not enough seats available');
      }

      availableSeats -= 1;
      await reserveSeat(availableSeats);

      if (availableSeats === 0) {
        reservationEnabled = false;
      }

      done();
    } catch (err) {
      done(err);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
