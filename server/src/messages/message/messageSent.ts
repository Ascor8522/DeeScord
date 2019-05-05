import { MessageEvent } from "./messageEvent";

export class MessageSent extends MessageEvent {
	constructor(messageAuthorId: number, messageChannelId: number, messageContent: string, messageId: number, messageTimestamp: number) {
		super("MessageSent", {
			messageAuthorId,
			messageChannelId,
			messageContent,
			messageId,
			messageTimestamp,
		});
	}
}
