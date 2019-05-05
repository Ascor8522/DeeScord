import { MessageEvent } from "./messageEvent";

export class MessageEdited extends MessageEvent {
	constructor(messageContent: string, messageId: number) {
		super("MessageEdited", {
			messageContent,
			messageId,
		});
	}
}
