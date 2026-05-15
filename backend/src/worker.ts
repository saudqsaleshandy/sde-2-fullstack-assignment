import { Worker } from 'bullmq';
import { bullConnection } from './config/redis';
import { SEND_QUEUE } from './sequences/scheduler';
import { processSendJob } from './worker/processor';

const worker = new Worker(SEND_QUEUE, processSendJob, {
  connection: bullConnection,
  concurrency: 4,
});

worker.on('completed', (job) => {
  console.log(`[worker] job ${job.id} ok`);
});

worker.on('failed', (job, err) => {
  console.warn(`[worker] job ${job?.id} failed: ${err.message}`);
});

console.log('[worker] listening on queue', SEND_QUEUE);
