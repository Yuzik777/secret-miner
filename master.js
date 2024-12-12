import {fork} from 'node:child_process';
import * as path from 'node:path';
import * as os from 'node:os';

const numWorkers = os.cpus().length/2;
console.log('Number of threads:', numWorkers);

const program = path.resolve('worker.js');
const parameters = [];
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

const metrics = new Array(numWorkers).fill(0);
const workers = [];
const tail = 'ya';

for (let i = 0; i < numWorkers; ++i) {
  const worker = fork(program, parameters, options);
  workers.push(worker);

  worker.send(tail);
  console.log(`Worker ${i} started.`);
  worker.on('message', message => {
    console.log(message)
    if (message.type === 'speed') {
      metrics[i] = Math.floor(message.data);
      console.clear();
      console.table(metrics);
    } else if (message.type === 'result') {
      console.log(`Worker ${i} mined.`);
      console.log(message.data.mnemonic, message.data.address);
      workers.forEach((worker) => worker.kill());
    }
  });

  worker.on('exit', () => {
    console.log(`Worker ${i} exited.`);
});
}
