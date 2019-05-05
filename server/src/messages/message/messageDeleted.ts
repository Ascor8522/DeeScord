import { MessageEvent } from "./messageEvent";

export class MessageDeleted extends MessageEvent {
	constructor(messageId: number) {
		super("MessageDeleted", {
			messageId,
		});
	}
}
