import { CHAIN } from "@tonconnect/protocol";
import { beginCell, Address, Slice } from "ton-core";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { DonationArguments, DonationSender } from "../interfaces/DonationSender";
import { createHash } from 'crypto';

const alertCallbackUrl = "https://donate-service.onrender.com/alert";
const donationContractAddress = "EQDUutL94icME-YqaLAI4XeeerrfJrB8y3hXnpMqbpNm4L09";

export function useTonConnect(): {
  sender: DonationSender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  return {
    sender: {
      send: async (args: DonationArguments) => {

        const unixtime = Date.now();
        const digest = generateDigest(args, unixtime);
        //const digestBuffer = Buffer.from(digest, 'hex');

        const payloadCell = beginCell()
          .storeUint(0, 32)
          .storeAddress(args.to)
          .storeStringTail(digest)
          //.storeBuffer(digestBuffer)
          .endCell();

        const transaction = tonConnectUI.sendTransaction({
          messages: [
            {
              address: Address.parse(donationContractAddress).toString(),
              amount: args.value.toString(),
              payload: payloadCell.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });

        const response = await transaction;

        const data = {
          amount: args.value.toString(),
          nickname: args.username,
          wallet_address: args.to.toString(),
          text: args.message,
          sign: digest,
        };

        const status = await fetch(alertCallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

      },
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain ?? null,

  };
}

// Returns message digest as hex string
function generateDigest(args: DonationArguments, unixtime: number): string {
  const body = args.to.toString() + args.value.toString() + args.username + args.message + unixtime;
  const digest = createHash('md5').update(body).digest('hex')
  return digest;
}