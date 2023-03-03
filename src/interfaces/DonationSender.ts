import { Sender, SenderArguments } from "ton-core";

export interface DonationSender extends Sender {
	send(args: DonationArguments): Promise<void>;
}


export type DonationArguments = SenderArguments & {
	username: string,
	message: string,
}