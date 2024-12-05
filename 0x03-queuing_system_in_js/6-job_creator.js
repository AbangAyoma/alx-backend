import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a push notification message',
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData).save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  } else {
    console.error('Failed to create notification job:', err);
  }
});

// Set up job event listeners
job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', () => {
  console.log('Notification job failed');
});
