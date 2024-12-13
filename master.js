import {Worker} from 'node:worker_threads';
import * as os from 'node:os';
import fs from 'node:fs';
import path from 'path';


const numWorkers = os.cpus().length/4;
console.log('Number of threads:', numWorkers);

const metrics = new Array(numWorkers).fill(0);
const workers = [];
const tail = 'BRUH';

function appendToFile(data) {
  fs.appendFile(logFilePath, data + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

const logFilePath = path.join('./', 'mining_results.log');


for (let i = 0; i < numWorkers; ++i) {
  const worker = new Worker('./worker.js', { workerData: tail });
  workers.push(worker);

  console.log(`Worker ${i} started.`);

  worker.on('message', message => {
    if (message.type === 'speed') {
      metrics[i] = Math.floor(message.data);
      console.clear();
      console.table(metrics);
      const sum = metrics.reduce( (sum, cur) => sum+cur, 0);
      console.log('Total mined per minute:', Math.floor(sum));

    } else if (message.type === 'result') {
      console.log(`Worker ${i} mined.`);
      console.log(message.data.mnemonic, message.data.address);
      appendToFile(`mnemonic: ${message.data.mnemonic}\naddrs: ${message.data.address}`);

      workers.forEach((worker) => worker.terminate());
    }
  });

  worker.on('exit', () => {
    console.log(`Worker ${i} exited.`);
});
}
