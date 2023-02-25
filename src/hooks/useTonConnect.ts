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

        const commentGuidCell = beginCell()
          .storeUint(666, 64)
          .endCell();

        const mainCell = beginCell()
          .storeAddress(args.to)
          .storeRef(commentGuidCell)
          .endCell();

        const boc = mainCell.toBoc().toString('base64');

        tonConnectUI.sendTransaction({
          messages: [
            {
              address: Address.parse("EQDLffuSGDQxc7TbCOQJP_BxJ541B6K1rC9o7anyCCtPZO3H").toString(),
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
