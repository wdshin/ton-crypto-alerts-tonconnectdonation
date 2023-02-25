import { CHAIN } from "@tonconnect/protocol";
import { beginCell, Sender, SenderArguments, Address } from "ton-core";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();



  return {
    sender: {
      send: async (args: SenderArguments) => {

        const streamerAddress = Address.parse("EQB_ryLyj9tdIGuwBOqsxg6bPXeCD55J9GiEP4VJhtVwmz8n");
        const commentGuidCell = beginCell()
          .storeUint(666, 64)
          .endCell();

        const mainCell = beginCell()
          .storeAddress(streamerAddress)
          .storeRef(commentGuidCell)
          .endCell();

        const boc = mainCell.toBoc().toString('base64url');

        tonConnectUI.sendTransaction({
          messages: [
            {
              address: Address.parse("EQB3lEqFKg0mrIxHs20Zg5EAXpzTt7X2KS3vosutA92qq9G2").toString(),
              amount: args.value.toString(),
              payload: boc,
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain ?? null,
  };
}
