import { mineMnemonic } from "./mnemonic.js";

const sendSpeedMetric = (speed) => process.send({type: 'speed', data: speed});

process.on('message', async (tail) => {
  const res = await mineMnemonic(tail, sendSpeedMetric);

  process.send({ type: 'result', data: res });
  process.exit();
});