import { mineMnemonic } from "./mnemonic.js";
import {parentPort, workerData} from 'node:worker_threads';

const sendSpeedMetric = (speed) => parentPort.postMessage({type: 'speed', data: speed});

const res = await mineMnemonic(workerData, sendSpeedMetric);

parentPort.postMessage({ type: 'result', data: res });
