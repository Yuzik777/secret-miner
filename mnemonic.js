import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import {
  WalletContractV5R1
} from '@ton/ton';


const tryMineMnemonic = async (end) => {

  const mnemonic = await mnemonicNew(24, ''); // Generate new menemonics
  const keypair = await mnemonicToPrivateKey(mnemonic); // Generates KeyPair from mnemonics
  const address = WalletContractV5R1.create({ workchain: 0, publicKey: keypair.publicKey }).address;
  const tail = address.toString().slice(-end.length);

  return tail.toLowerCase() === end ? 
    {
      mnemonic,
      address: address.toString()
    } :
    undefined;
}

export const mineMnemonic = async (end, onSpeedCalculated) => {
  let start = new Date();
  let count = 0;

  while(true) {
 
    const res = await tryMineMnemonic(end);
  
    if (res) {
      return res;
    }
  
    count++;
    if(count === 20) {
      const speed = count * 1.0 / ((new Date().getTime() - start.getTime()) / (1000 * 60));
      onSpeedCalculated && onSpeedCalculated(speed);
      count = 0;
      start = new Date();
    }
  }

};

mineMnemonic('ya', console.log);