import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import {
  WalletContractV5R1
} from '@ton/ton';


const generateMnemonicAndAddress = async () => {

  const mnemonic = await mnemonicNew(24, ''); // Generate new menemonics
  const keypair = await mnemonicToPrivateKey(mnemonic); // Generates KeyPair from mnemonics
  const address = WalletContractV5R1.create({ workchain: 0, publicKey: keypair.publicKey}).address;

  return {
      mnemonic,
      address: address.toString({bounceable: false})
  };
}

export const mineMnemonic = async (end, onSpeedCalculated) => {
  let start = new Date();
  let count = 0;

  while(true) {
 
    const res = await generateMnemonicAndAddress(end);

    const tail = res.address.slice(-end.length);
    if (tail === end) {
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

// mineMnemonic('ya', console.log);